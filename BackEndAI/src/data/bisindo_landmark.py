import os
import cv2
import numpy as np
import mediapipe as mp
import pandas as pd
from tqdm import tqdm

DATASET_PATH = "dataset/BISINDO-Master/train/images"
OUTPUT_CSV = "data/bisindo_landmarks.csv"

os.makedirs("data", exist_ok=True)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.6
)

def get_landmarks(hand):
    return np.array([[lm.x, lm.y, lm.z] for lm in hand.landmark], dtype=np.float32)

def flatten_hand(hand_pts, center):
    return (hand_pts - center).flatten()

data = []

images = [f for f in os.listdir(DATASET_PATH) if f.endswith((".jpg", ".png"))]

print("Total Images:", len(images))

for img_name in tqdm(images):
    path = os.path.join(DATASET_PATH, img_name)
    img = cv2.imread(path)
    if img is None:
        continue

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    if not result.multi_hand_landmarks:
        continue

    label = img_name[0].upper()

    hands_list = result.multi_hand_landmarks

    hands_list = sorted(hands_list, key=lambda h: h.landmark[0].x)

    h1 = get_landmarks(hands_list[0])

    if len(hands_list) == 2:
        h2 = get_landmarks(hands_list[1])
    else:
        h2 = np.zeros((21, 3), dtype=np.float32)

    center = (h1.mean(axis=0) + h2.mean(axis=0)) / 2

    features = []

    features.extend(flatten_hand(h1, center))

    features.extend(flatten_hand(h2, center))

    features.extend([
        np.linalg.norm(h1[0] - h2[0]),
        np.linalg.norm(h1[8] - h2[8]),
        np.linalg.norm(h1[4] - h2[4])
    ])

    features.append(label)

    data.append(features)

df = pd.DataFrame(data)

df = df.apply(pd.to_numeric, errors='ignore')

df.to_csv(OUTPUT_CSV, index=False)

print("DONE:", OUTPUT_CSV)
print("FEATURES:", df.shape[1] - 1)