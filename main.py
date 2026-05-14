from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io

app = FastAPI()

class AslNormalization(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0

#load model
model = tf.keras.models.load_model(
    'asl_model_best.keras', 
    custom_objects={'AslNormalization': AslNormalization}
)

labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
          'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']

@app.get("/")
def home():
    return {"status": "sip", "message": "API jalan"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert('RGB')
    
    image = image.resize((128, 128)) 
    img_array = np.array(image)
    
    img_array = np.expand_dims(img_array, axis=0)


    predictions = model.predict(img_array)
    target_index = np.argmax(predictions)
    confidence = float(np.max(predictions))

    return {
        "prediction": labels[target_index],
        "confidence": f"{confidence * 100:.2f}%"
    }