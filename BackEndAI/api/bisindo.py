import os
import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
from collections import deque
from fastapi import APIRouter, UploadFile, File, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/bisindo", tags=["BISINDO"])

#cusotm layer
@tf.keras.utils.register_keras_serializable(package="Custom")
class LandmarkNormalizationLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32)

#load model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "bisindo_model.keras")
CLASSES_PATH = os.path.join(BASE_DIR, "models", "classes.npy")


print("Loading BISINDO model for API...")
with tf.keras.utils.custom_object_scope({"LandmarkNormalizationLayer": LandmarkNormalizationLayer}):
    bisindo_model = tf.keras.models.load_model(MODEL_PATH, compile=False)
bisindo_classes = np.load(CLASSES_PATH, allow_pickle=True)

#mediapipe
mp_hands_bisindo = mp.solutions.hands
hands_static = mp_hands_bisindo.Hands(
    static_image_mode=True, 
    max_num_hands=2, 
    min_detection_confidence=0.5
)

#fungsi ekstraksi
def extract_features(hand1, hand2=None):
    def pts(h):
        return np.array([[lm.x, lm.y, lm.z] for lm in h.landmark], dtype=np.float32)

    h1 = pts(hand1)
    h2 = pts(hand2) if hand2 is not None else np.zeros((21, 3), dtype=np.float32)
    center = (h1.mean(axis=0) + h2.mean(axis=0)) / 2

    feat = []
    feat.extend((h1 - center).flatten())
    feat.extend((h2 - center).flatten())
    feat.extend([
        np.linalg.norm(h1[0] - h2[0]),
        np.linalg.norm(h1[8] - h2[8]),
        np.linalg.norm(h1[4] - h2[4])
    ])
    return np.array(feat, dtype=np.float32).reshape(1, -1)


#endpoint predict image
@router.post("/predict_image")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        return {"prediction": "-", "confidence": "0.00%"}

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    res = hands_static.process(rgb)

    if not res.multi_hand_landmarks:
        return {"prediction": "-", "confidence": "0.00%"}

    hands_list = sorted(res.multi_hand_landmarks, key=lambda x: x.landmark[0].x)
    h1 = hands_list[0]
    h2 = hands_list[1] if len(hands_list) == 2 else None

    X = extract_features(h1, h2)

    if X.shape == (1, 129):
        predictions = bisindo_model.predict(X, verbose=0)
        
        target_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))
        predicted_class = str(bisindo_classes[target_index])
        
        return {
            "prediction": predicted_class if confidence > 0.7 else "-",
            "confidence": f"{confidence * 100:.2f}%"
        }
    
    return {"prediction": "-", "confidence": "0.00%"}


#endpoint predict webcam
@router.websocket("/predict_webcam")
async def predict_webcam(websocket: WebSocket):
    await websocket.accept()
    
    hands_live = mp_hands_bisindo.Hands(
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    history = deque(maxlen=15)
    
    try:
        while True:
            bytes_data = await websocket.receive_bytes()
            nparr = np.frombuffer(bytes_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                continue

            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            res = hands_live.process(rgb)

            label = "-"
            conf = 0.0

            if res.multi_hand_landmarks:
                hands_list = sorted(res.multi_hand_landmarks, key=lambda x: x.landmark[0].x)
                h1 = hands_list[0]
                h2 = hands_list[1] if len(hands_list) == 2 else None

                X = extract_features(h1, h2)

                if X.shape == (1, 129):
                    predictions = bisindo_model.predict(X, verbose=0)
                    
                    idx = int(np.argmax(predictions))
                    confidence = float(np.max(predictions))

                    history.append(idx)
                    final_idx = max(set(history), key=history.count)

                    label = str(bisindo_classes[final_idx])
                    conf = confidence
            else:
                history.clear()

            await websocket.send_json({
                "prediction": label,
                "confidence": f"{conf * 100:.2f}%"
            })

    except WebSocketDisconnect:
        print("Disconnect")
    finally:
        hands_live.close()