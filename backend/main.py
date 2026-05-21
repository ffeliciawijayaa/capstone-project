from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware  # <-- TAMBAHAN UNTUK CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
import os
from correction import correct_text

app = FastAPI()

# ==================== SETTING CORS (TAMBAHAN UTAMA) ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],             # Mengizinkan semua domain (Web/Mobile) mengakses API
    allow_credentials=True,
    allow_methods=["*"],             # Mengizinkan semua metode (GET, POST, dll)
    allow_headers=["*"],             # Mengizinkan semua headers
)
# =======================================================================

# Custom Layer
class AslNormalization(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0

# Ambil folder project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path model
model_path = os.path.join(BASE_DIR, "asl_model_best.h5")

# Load model
model = load_model(
    model_path,
    custom_objects={'AslNormalization': AslNormalization},
    compile=False
)

# Labels
labels = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'del', 'nothing', 'space'
]

# Buffer text realtime
current_text = ""

@app.get("/")
def home():
    return {
        "status": "sip",
        "message": "API jalan"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    global current_text

    contents = await file.read()

    image = Image.open(io.BytesIO(contents)).convert("RGB")

    image = image.resize((128, 128))

    img_array = np.array(image)

    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)

    target_index = np.argmax(predictions)

    confidence = float(np.max(predictions))
    
    if confidence < 0.80: predicted_label = "nothing"
    else: predicted_label = labels[target_index]

    # Tambahkan huruf ke buffer
    if predicted_label not in ["nothing", "space", "del"]:
        current_text += predicted_label

    # Space
    if predicted_label == "space":
        current_text += " "

    # Delete
    if predicted_label == "del":
        current_text = current_text[:-1]

    corrected_text = correct_text(current_text)

    return {
        "prediction": predicted_label,
        "text": current_text,
        "corrected": corrected_text,
        "confidence": f"{confidence * 100:.2f}%"
    }