from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.models import load_model # type: ignore
import numpy as np
import cv2
import mediapipe as mp
import os
from src.data.correction import correct_text


from api.bisindo import router as bisindo_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bisindo_router)

# Inisialisasi MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True, 
    max_num_hands=1, 
    min_detection_confidence=0.5
)

class AslNormalization(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "models", "asl_model.keras")

model = load_model(
    model_path,
    custom_objects={'AslNormalization': AslNormalization},
    compile=False
)

labels = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'del', 'nothing', 'space'
]

current_text = ""

@app.get("/")
def home():
    return {"status": "sip", "message": "API ASL dan BISINDO jalan"}

# Endpoint ASL 
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    global current_text

    #Baca gambar yang diunggah menggunakan OpenCV
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    #MediaPipe membutuhkan format RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    #Ekstrak Landmark Tangan menggunakan MediaPipe
    results = hands.process(image_rgb)

    # Validasi jika tidak ada tangan terdeteksi di gambar
    if not results.multi_hand_landmarks:
        return {
            "prediction": "nothing",
            "text": current_text,
            "corrected": correct_text(current_text),
            "confidence": "0.00%",
            "message": "Tidak ada tangan yang terdeteksi"
        }

    #Kumpulkan 63 (X, Y, Z dari 21 titik)
    landmarks = []
    for hand_landmarks in results.multi_hand_landmarks:
        for lm in hand_landmarks.landmark:
            landmarks.extend([lm.x, lm.y, lm.z])
            
    #Format ke dalam numpy array shape (1, 63)
    img_array = np.array([landmarks], dtype=np.float32)

    #Prediksi dengan Model ASL
    predictions = model.predict(img_array, verbose=0)
    target_index = np.argmax(predictions)
    confidence = float(np.max(predictions))
    
    if confidence < 0.80: 
        predicted_label = "nothing"
    else: 
        predicted_label = labels[target_index]

    if predicted_label not in ["nothing", "space", "del"]:
        current_text += predicted_label

    if predicted_label == "space":
        current_text += " "

    if predicted_label == "del":
        current_text = current_text[:-1]

    corrected_text = correct_text(current_text)

    return {
        "prediction": predicted_label,
        "text": current_text,
        "corrected": corrected_text,
        "confidence": f"{confidence * 100:.2f}%"
    }