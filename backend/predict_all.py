import tensorflow as tf
import numpy as np
import os
import sys
from tensorflow.keras import layers

class AslNormalization(layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0

MODEL_PATH = 'asl_model_best.keras'
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
          'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
          'del', 'nothing', 'space']

model = tf.keras.models.load_model(
    MODEL_PATH, 
    custom_objects={'AslNormalization': AslNormalization},
    compile=False
)

def prepare_image(path):
    img = tf.keras.utils.load_img(path, target_size=(128, 128))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) 
    return img_array

#prediksi 1 folder/batch
if __name__ == "__main__":
    if len(sys.argv) > 1:
        folder_path = sys.argv[1].strip(' "')
        
        if os.path.isdir(folder_path):
            images = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            
            print(f"\n--- Memulai Prediksi Batch ({len(images)} gambar) ---")
            print(f"{'Nama File':<25} | {'Hasil':<10} | {'Confidence'}")
            print("-" * 55)

            for img_name in images:
                img_full_path = os.path.join(folder_path, img_name)
                img = prepare_image(img_full_path)
                
                predictions = model.predict(img, verbose=0)
                predicted_class = labels[np.argmax(predictions)]
                confidence = 100 * np.max(predictions)
                
                print(f"{img_name:<25} | {predicted_class:<10} | {confidence:.2f}%")
            
            print("-" * 55)
            print("Proses selesai!")
        else:
            print(f"Error: {folder_path} bukan sebuah folder")
    else:
        print("Gunakan format: python predict_all.py [path_folder]")