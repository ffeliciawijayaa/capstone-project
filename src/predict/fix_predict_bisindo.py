import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
from collections import deque


#custom layer
@tf.keras.utils.register_keras_serializable(package="Custom")
class LandmarkNormalizationLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32)


#load model
MODEL_PATH = r"C:\Users\FELICIA\Documents\GitHub\Local\capstone-project\models\bisindo_model.keras"
CLASSES_PATH = r"C:\Users\FELICIA\Documents\GitHub\Local\capstone-project\models\classes.npy"

print("Loading model...")

with tf.keras.utils.custom_object_scope(
    {"LandmarkNormalizationLayer": LandmarkNormalizationLayer}
):
    model = tf.keras.models.load_model(MODEL_PATH)

classes = np.load(CLASSES_PATH, allow_pickle=True)


#mediapipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

history = deque(maxlen=15)


#feature extraction
def extract(hand1, hand2=None):
    def pts(h):
        return np.array([[lm.x, lm.y, lm.z] for lm in h.landmark], dtype=np.float32)

    h1 = pts(hand1)

    if hand2 is not None:
        h2 = pts(hand2)
    else:
        h2 = np.zeros((21, 3), dtype=np.float32)

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


#camera
cap = cv2.VideoCapture(0)
print("Webcam siap")

label = "-"
conf = 0.0

#loop
while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    res = hands.process(rgb)

    if res.multi_hand_landmarks:

        hands_list = res.multi_hand_landmarks
        hands_list = sorted(hands_list, key=lambda x: x.landmark[0].x)

        h1 = hands_list[0]
        h2 = hands_list[1] if len(hands_list) == 2 else None

        X = extract(h1, h2)

        # safety check shape
        if X.shape == (1, 129):

            pred = model.predict(X, verbose=0)[0]
            idx = np.argmax(pred)
            confidence = float(np.max(pred))

            history.append(idx)

            final_idx = max(set(history), key=history.count)

            label = classes[final_idx]
            conf = confidence

    else:
        #reset kalau tangan hilang
        history.clear()
        label = "-"
        conf = 0.0


    #display
    cv2.putText(
        frame,
        f"{label} ({conf:.2f})",
        (20, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.imshow("SignBridge Demo", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()