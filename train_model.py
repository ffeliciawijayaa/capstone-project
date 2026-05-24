import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

print("Membaca data dari CSV...")
# 1. Load Data
df = pd.read_csv('hand_landmarks.csv')

# Pisahkan fitur (koordinat x, y, z) dan target (label)
X = df.drop('label', axis=1).values
y = df['label'].values

# 2. Encode Label
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)
num_classes = len(np.unique(y_encoded))

# Simpan urutan kelas ke file agar bisa diload oleh predict_webcam.py nanti
np.save('classes.npy', encoder.classes_)
print(f"Total kelas yang akan dilatih: {num_classes} kelas")

# 3. Split Data (80% Training, 20% Testing)
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# 4. Bangun Model Arsitektur
# Karena data tabular 1D, arsitektur Dense (Fully Connected) lebih optimal dan cepat daripada 2D CNN
model = Sequential([
    Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(num_classes, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Fitur Early Stopping: berhenti jika val_loss tidak membaik selama 5 epoch
early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# 5. Proses Training
print("Memulai proses training...")
history = model.fit(
    X_train, y_train, 
    epochs=50, 
    batch_size=32, 
    validation_data=(X_test, y_test),
    callbacks=[early_stop]
)

# 6. Evaluasi dan Simpan
print("\nMengevaluasi model pada data test...")
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Akurasi akhir pada data test: {accuracy * 100:.2f}%")

model.save('sign_language_model.h5')
print("\nModel berhasil disimpan sebagai 'sign_language_model.h5'")
print("File 'classes.npy' juga berhasil disimpan.")