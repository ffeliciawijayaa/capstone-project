import { useState, useRef } from "react";

function Detection() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("Waiting for detection...");
  const [loading, setLoading] = useState(false);

  // Webcam
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  // Upload image
  const handleImage = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setCameraOn(false);
    }
  };

  // Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
      setImage(null);
    } catch (error) {
      setResult("Cannot access camera");
    }
  };

  // Detection API
  const handleDetection = async () => {
    if (!file) {
      setResult("Please upload image first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResult(
        `Prediction: ${data.prediction}
Text: ${data.text}
Confidence: ${data.confidence}`
      );
    } catch (error) {
      setResult("Failed to connect API");
    }

    setLoading(false);
  };

  return (
    <section
      id="detection"
      style={{
        padding:
          window.innerWidth < 768 ? "80px 20px" : "120px 80px",
        background: "#F4FFFD",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "70px",
        }}
      >
        <h2
          style={{
            fontSize: "52px",
            color: "#2B2B2B",
            marginBottom: "20px",
          }}
        >
          AI Detection Demo
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "18px",
          }}
        >
          Upload sign language image or use realtime camera.
        </p>
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "50px",
          borderRadius: "30px",
          border: "1px solid #D7F2EB",
          boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
        }}
      >
        {/* Preview */}
        <div
          style={{
            width: "100%",
            height: "320px",
            border: "2px dashed #BDEEE6",
            borderRadius: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            marginBottom: "30px",
            background: "#FAFFFE",
          }}
        >
          {cameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : image ? (
            <img
              src={image}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <p
              style={{
                color: "#999",
                fontSize: "18px",
              }}
            >
              Image / Camera Preview
            </p>
          )}
        </div>

        {/* Upload */}
        <label
          style={{
          display: "inline-block",
          padding: "14px 24px",
          background: "#2EC4B6",
          color: "white",
          borderRadius: "12px",
          cursor: "pointer",
          marginBottom: "20px",
          fontWeight: "bold",
          transition: "all 0.35s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#4FD6CA";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#2EC4B6";
        }}
        >
          Choose Image

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            hidden
          />
        </label>

        {/* Camera Button */}
        <button
          onClick={startCamera}
          style={{
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "14px",
            background: "#2EC4B6",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.35s ease",
            marginBottom: "20px",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#4FD6CA";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#2EC4B6";
          }}
        >
          Start Camera
        </button>

        {/* Detect Button */}
        <button
          onClick={handleDetection}
          style={{
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "14px",
            background: "#2EC4B6",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.35s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#4FD6CA";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#2EC4B6";
          }}
        >
          {loading ? "Detecting..." : "Detect Sign Language"}
        </button>

        {/* Result */}
        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            borderRadius: "20px",
            background: "#F4FFFD",
            border: "1px solid #D7F2EB",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: "#2EC4B6",
            }}
          >
            Detection Result
          </h3>

          <p
            style={{
              color: "#555",
              lineHeight: "1.8",
              fontWeight: "bold",
              fontSize: "20px",
              whiteSpace: "pre-line",
            }}
          >
            {result}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Detection;