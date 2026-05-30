import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
from collections import deque

model = tf.keras.models.load_model("models/bisindo_model.keras")
classes = np.load("models/classes.npy", allow_pickle=True)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=2)

history = deque(maxlen=15)

def extract(hand1, hand2=None):
    def pts(h):
        return np.array([[lm.x, lm.y, lm.z] for lm in h.landmark], dtype=np.float32)

    h1 = pts(hand1)

    if hand2:
        h2 = pts(hand2)
    else:
        h2 = np.zeros((21,3), dtype=np.float32)

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

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    res = hands.process(rgb)

    label = "-"
    conf = 0

    if res.multi_hand_landmarks:
        h = res.multi_hand_landmarks

        h = sorted(h, key=lambda x: x.landmark[0].x)

        h1 = h[0]
        h2 = h[1] if len(h) == 2 else None

        X = extract(h1, h2)

        pred = model.predict(X, verbose=0)

        idx = np.argmax(pred)
        conf = np.max(pred)

        history.append(idx)

        final = max(set(history), key=history.count)

        label = classes[final]

    cv2.putText(frame, f"{label} ({conf:.2f})",
                (20, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0,255,0), 2)

    cv2.imshow("BISINDO FINAL FIX", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break