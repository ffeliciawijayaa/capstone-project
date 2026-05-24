import cv2
import mediapipe as mp
import os
import csv

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.5)

DATASET_DIR = 'dataset/asl_alphabet_train'
CSV_FILE = 'hand_landmarks.csv'
LABELS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'del', 'nothing', 'space'
]

header = ['label']
for i in range(21):
    header.extend([f'x{i}', f'y{i}', f'z{i}'])

print("Memulai ekstraksi landmark tangan...")

with open(CSV_FILE, mode='w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)

    # Looping untuk setiap label
    for label in LABELS:
        class_path = os.path.join(DATASET_DIR, label)
        
        if not os.path.exists(class_path):
            print(f"Peringatan: Folder {class_path} tidak ditemukan. Melewati...")
            continue
            
        print(f"Memproses kelas: {label}...")
        
        success_count = 0 
        
        for img_name in os.listdir(class_path):
            img_path = os.path.join(class_path, img_name)
            img = cv2.imread(img_path)
            
            if img is None: 
                continue
            
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            results = hands.process(img_rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    row = [label]
                    for landmark in hand_landmarks.landmark:
                        row.extend([landmark.x, landmark.y, landmark.z])
                    writer.writerow(row)
                    success_count += 1
                    
        print(f"Selesai kelas {label}: {success_count} gambar diekstrak.")

print(f"\nEkstraksi selesai 100%! Data berhasil disimpan di {CSV_FILE}")