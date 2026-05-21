import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import cv2
import numpy as np
import tensorflow as tf
from tensorflow import keras
import mediapipe as mp
import sys
from collections import deque

MODEL_PATH = 'asl_model_best.keras'
PADDING_RATIO = 1.5   

#custom layer
class AslNormalization(keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0


#camera
print("Start webcam")
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
ret, frame = cap.read()

if not ret:
    cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)
    ret, frame = cap.read()

if not cap.isOpened():
    print("Kamera error")
    sys.exit()

print("Webcam ok")

#load model
print("Load model")
model = keras.models.load_model(
    MODEL_PATH,
    custom_objects={'AslNormalization': AslNormalization}
)
print("Model loaded")

#media pipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)

labels = [chr(i) for i in range(65, 91)] + ['del', 'nothing', 'space']

#stability buffer
pred_buffer = deque(maxlen=7)

print("\nSignBridge start... (tekan Q untuk keluar)\n")

#loop
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape

    frame_clean = frame.copy()

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    pred_label = "No hand detected"

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:

            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)


            #landmark list
            x_list = [lm.x for lm in hand_landmarks.landmark]
            y_list = [lm.y for lm in hand_landmarks.landmark]

 
            cx = int(np.mean(x_list) * w)
            cy = int(np.mean(y_list) * h)

            width = (max(x_list) - min(x_list)) * w
            height = (max(y_list) - min(y_list)) * h

            box_size = int(max(width, height) * PADDING_RATIO)

            x1 = max(0, cx - box_size // 2)
            x2 = min(w, cx + box_size // 2)
            y1 = max(0, cy - box_size // 2)
            y2 = min(h, cy + box_size // 2)

            #draw box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)


            crop = frame_clean[y1:y2, x1:x2]

            if crop.size > 0:

                crop = cv2.resize(crop, (128, 128))

                inp = np.expand_dims(crop, axis=0)

                # =========================
                # PREDICT
                # =========================
                pred = model.predict(inp, verbose=0)[0]

                idx = np.argmax(pred)
                conf = pred[idx]


                #filter stability
                pred_buffer.append(idx)
                stable_idx = max(set(pred_buffer), key=pred_buffer.count)

                pred_label = f"{labels[stable_idx]} ({conf*100:.1f}%)"


    cv2.putText(frame, f"Deteksi: {pred_label}", (10, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("SignBridge", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("selesai")