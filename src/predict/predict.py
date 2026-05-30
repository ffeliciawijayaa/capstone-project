import tensorflow as tf
import numpy as np
import os
import sys
from tensorflow.keras import layers # type: ignore

class AslNormalization(layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0

MODEL_PATH = '/models/asl_model_best.keras'
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
          'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
          'del', 'nothing', 'space']

if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(
        MODEL_PATH, 
        custom_objects={'AslNormalization': AslNormalization},
        compile=False
    )
else:
    print(f"Error: Model {MODEL_PATH} tidak ditemukan!")
    sys.exit()

def prepare_image(path):
    img = tf.keras.utils.load_img(path, target_size=(128, 128))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) 
    return img_array 

# jika mau  prediksi satu satu
if __name__ == "__main__":
    if len(sys.argv) > 1:
        img_path = sys.argv[1].strip(' "')
        
        if os.path.exists(img_path):
            img = prepare_image(img_path)
            predictions = model.predict(img, verbose=0)
            
            predicted_class = labels[np.argmax(predictions)]
            confidence = 100 * np.max(predictions)
            
            print(f"\n==============================")
            print(f"HASIL PREDIKSI : {predicted_class}")
            print(f"CONFIDENCE     : {confidence:.2f}%")
            print(f"==============================")
        else:
            print(f"Error: File tidak ditemukan di {img_path}")
    else:
        print("Gunakan format: python predict.py [path_gambar]")