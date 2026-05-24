import cv2
import mediapipe as mp
import numpy as np
import threading
import pyttsx3
from tensorflow.keras.models import load_model

# Fungsi untuk mengeluarkan suara tanpa membuat kamera freeze
def speak_text(text):
    if text.strip() == "": 
        return
    def speak_thread():
        # Inisialisasi engine di dalam thread agar aman di Windows
        try:
            import pythoncom
            pythoncom.CoInitialize()
        except ImportError:
            pass
            
        engine = pyttsx3.init()
        # Mengatur kecepatan bicara (opsional, default biasanya 200)
        engine.setProperty('rate', 150) 
        engine.say(text)
        engine.runAndWait()
        
    threading.Thread(target=speak_thread, daemon=True).start()

print("Memuat model...")
model = load_model('sign_language_model.h5')
classes = np.load('classes.npy', allow_pickle=True)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.7)

cap = cv2.VideoCapture(0)

# Variabel untuk logika perangkai kata
current_word = ""
sentence = ""
last_predicted_char = ""
frames_held = 0
FRAMES_TO_CONFIRM = 15 # Tahan gerakan selama 15 frame (sekitar 0.5 detik) untuk mengetik huruf

print("Kamera siap! Tekan 'q' untuk keluar.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break

    frame = cv2.flip(frame, 1)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    predicted_char = ""
    confidence = 0

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            landmark_list = []
            for landmark in hand_landmarks.landmark:
                landmark_list.extend([landmark.x, landmark.y, landmark.z])
            
            input_data = np.array([landmark_list])
            prediction = model.predict(input_data, verbose=0)
            
            class_idx = np.argmax(prediction)
            confidence = np.max(prediction)
            
            if confidence > 0.7:
                predicted_char = classes[class_idx]

    # --- LOGIKA PENGETIKAN & SUARA ---
    if predicted_char != "":
        if predicted_char == last_predicted_char:
            frames_held += 1
        else:
            frames_held = 0
            last_predicted_char = predicted_char

        # Jika karakter ditahan cukup lama, proses karakternya
        if frames_held == FRAMES_TO_CONFIRM:
            if predicted_char == 'space':
                # Jika spasi, baca kata yang sudah dirangkai, lalu masukkan ke kalimat
                speak_text(current_word)
                sentence += current_word + " "
                current_word = ""
            elif predicted_char == 'del':
                # Hapus satu huruf terakhir
                current_word = current_word[:-1]
            elif predicted_char == 'nothing':
                pass # Abaikan
            else:
                # Tambahkan huruf ke kata
                current_word += predicted_char
    else:
        frames_held = 0

    # --- TAMPILAN VISUAL DI LAYAR ---
    # Tampilkan prediksi saat ini di pojok kiri atas
    cv2.putText(frame, f'Prediksi: {predicted_char} ({confidence*100:.0f}%)', 
                (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    
    # Tampilkan indikator "loading" saat menahan huruf
    if frames_held > 0 and frames_held < FRAMES_TO_CONFIRM:
        loading_text = "." * (frames_held // 3)
        cv2.putText(frame, loading_text, (250, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

    # Tampilkan kata yang sedang diketik (warna kuning)
    cv2.putText(frame, f'Kata: {current_word}', (10, 90), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
    
    # Tampilkan kalimat utuh (warna biru)
    cv2.putText(frame, f'Kalimat: {sentence}', (10, 140), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 200, 0), 2)

    cv2.imshow('Sign Language Translator', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()