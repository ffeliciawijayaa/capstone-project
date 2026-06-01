import os
import sys

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import absl.logging
absl.logging.set_verbosity(absl.logging.ERROR)

import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
import logging

tf.get_logger().setLevel(logging.ERROR)
logging.getLogger('tensorflow').setLevel(logging.ERROR)

#custom layer
class LandmarkNormalizationLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32)

#path model & class
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "bisindo_model.keras")
CLASSES_PATH = os.path.join(BASE_DIR, "models", "classes.npy")

#load model
if os.path.exists(MODEL_PATH) and os.path.exists(CLASSES_PATH):
    model = tf.keras.models.load_model(
        MODEL_PATH, 
        custom_objects={'LandmarkNormalizationLayer': LandmarkNormalizationLayer},
        compile=False
    )
    classes = np.load(CLASSES_PATH, allow_pickle=True)
else:
    print(f"Error: Model atau file kelas tidak ditemukan")
    sys.exit()

#inisialisasi mediapipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)

#data preparation
def prepare_image(path):
    image = cv2.imread(path)
    if image is None:
        return None
        
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)

    if not results.multi_hand_landmarks:
        return "NO_HAND"

    #urutkan dan ekstrak 29 fitur
    h = sorted(results.multi_hand_landmarks, key=lambda x: x.landmark[0].x)
    h1, h2 = h[0], h[1] if len(h) == 2 else None

    def pts(hand):
        return np.array([[lm.x, lm.y, lm.z] for lm in hand.landmark], dtype=np.float32)

    pts1 = pts(h1)
    pts2 = pts(h2) if h2 else np.zeros((21, 3), dtype=np.float32)
    center = (pts1.mean(axis=0) + pts2.mean(axis=0)) / 2

    feat = []
    feat.extend((pts1 - center).flatten())
    feat.extend((pts2 - center).flatten())
    feat.extend([
        np.linalg.norm(pts1[0] - pts2[0]),
        np.linalg.norm(pts1[8] - pts2[8]),
        np.linalg.norm(pts1[4] - pts2[4])
    ])
    
    return np.array(feat, dtype=np.float32).reshape(1, -1)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        img_path = sys.argv[1].strip(' "')
        
        if os.path.exists(img_path):
            # Tampilkan pesan loading ringan
            print("Memproses gambar...")
            
            img_array = prepare_image(img_path)
            
            if img_array is None:
                print(f"Error: Tidak dapat membaca file gambar di {img_path}")
            elif str(img_array) == "Tidak Ada Tangan":
                print("\nHasil Prediksi: Tidak Ada Tangan")

            else:
                predictions = model.predict(img_array, verbose=0)
                
                target_index = np.argmax(predictions)
                predicted_class = classes[target_index]
                confidence = 100 * np.max(predictions)
                
                print(f"\nHasil Prediksi: {predicted_class}")
                print(f"Confidence: {confidence:.2f}%")
      
        else:
            print(f"Error: File tidak ditemukan di {img_path}")
    else:
        print("Gunakan format: python predict_image_bisindo.py [path_gambar]")