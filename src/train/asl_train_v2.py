import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import Dense, Dropout # type: ignore
from tensorflow.keras.callbacks import EarlyStopping # type: ignore

print("Membaca data dari CSV...")

df = pd.read_csv('/data/hand_landmarks.csv')

X = df.drop('label', axis=1).values
y = df['label'].values

encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)
num_classes = len(np.unique(y_encoded))

np.save('models/classes.npy', encoder.classes_)
print(f"Total kelas yang akan dilatih: {num_classes} kelas")

X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

model = Sequential([
    Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dense(num_classes, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

print("Memulai proses training...")
history = model.fit(
    X_train, y_train, 
    epochs=50, 
    batch_size=32, 
    validation_data=(X_test, y_test),
    callbacks=[early_stop]
)

print("\nMengevaluasi model pada data test...")
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Akurasi akhir pada data test: {accuracy * 100:.2f}%")

model.save('models/asl_model.keras')
print("\nModel berhasil disimpan sebagai 'models/asl_model.keras'")
print("File 'models/classes.npy' juga berhasil disimpan.")