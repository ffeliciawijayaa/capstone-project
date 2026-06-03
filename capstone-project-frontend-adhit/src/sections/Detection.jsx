import { useState, useRef, useEffect } from "react";

function Detection() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("Waiting for detection...");
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState("error"); // "ready" | "detecting" | "error"

  // Webcam & WebSocket References
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [streamData, setStreamData] = useState(null);

  // Ambil nilai teks dari baris hasil pemisah \n secara aman
  const getResultValue = (keyword, fallback = "-") => {
    if (!result || typeof result !== "string") return fallback;
    const lines = result.split("\n");
    const targetLine = lines.find((line) => line.includes(keyword));
    return targetLine ? targetLine.replace(`${keyword}: `, "").trim() : fallback;
  };

  const prediction = getResultValue("Prediction");
  const detectedText = getResultValue("Text");
  const confidence = getResultValue("Confidence");

  // Fungsi mematikan kamera & menutup Jalur WebSocket dengan bersih
 const stopCameraAndWS = () => {
  if (streamData) {
    streamData.getTracks().forEach((track) => track.stop());
  }

  if (wsRef.current) {
    if (
      wsRef.current.readyState === WebSocket.OPEN ||
      wsRef.current.readyState === WebSocket.CONNECTING
    ) {
      wsRef.current.close();
    }

    wsRef.current = null;
  }

  setCameraOn(false);
  setStreamData(null);
  setAiStatus("error");
};


  // Pilih file gambar manual lewat folder internal
  const handleImage = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      stopCameraAndWS();
    }
  };

  // Menyalakan / Mematikan Realtime Webcam + Koneksi WS On-Demand
  const toggleCamera = async () => {
    if (cameraOn) {
      stopCameraAndWS();
      return;
    }

    try {
      // 1. Ambil akses kamera terlebih dahulu
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStreamData(stream);
      setCameraOn(true);
      setImage(null);

      setTimeout(() => {
        if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
      };
    }
    }, 100);

      // 2. Buka WebSocket HANYA ketika kamera berhasil dinyalakan
      console.log("MENGHUBUNGKAN KE WEBSOCKET BACKEND...");
      const ws = new WebSocket("ws://127.0.0.1:8000/bisindo/predict_webcam");
      wsRef.current = ws;

         ws.onopen = () => {
        console.log("WS OPEN");
        setAiStatus("ready");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setAiStatus("ready");
          setResult(
            `Prediction: ${data.prediction || "-"}\nText: -\nConfidence: ${data.confidence || "-"}`
          );
        } catch (err) {
          console.error("Gagal membaca data dari server:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("WEBSOCKET MENGALAMI ERROR:", error);
        setAiStatus("error");
      };

      ws.onclose = (event) => {
        console.log("WEBSOCKET DITUTUP:", event.code);
        setAiStatus("error");
      };

    } catch (err) {
      console.error("Gagal membuka kamera:", err);
      setResult("Cannot access camera");
      setAiStatus("error");
    }
  };

  // LOOPING OTOMATIS: Pengiriman data binary frame kamera ke backend via WebSocket
  useEffect(() => {
  let streamingInterval;

  if (cameraOn && streamData) {
    streamingInterval = setInterval(() => {
      if (
        videoRef.current &&
        canvasRef.current &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (
          !context ||
          video.videoWidth <= 0 ||
          video.videoHeight <= 0
        ) {
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob(async (blob) => {
          if (
            blob &&
            wsRef.current &&
            wsRef.current.readyState === WebSocket.OPEN
          ) {
            const arrayBuffer = await blob.arrayBuffer();

            if (
              wsRef.current &&
              wsRef.current.readyState === WebSocket.OPEN
            ) {
              wsRef.current.send(arrayBuffer);
            }
          }
        }, "image/jpeg", 0.4);
      }
    }, 250);
  }

  return () => {
    if (streamingInterval) {
      clearInterval(streamingInterval);
    }
  };
}, [cameraOn, streamData]);
// Pembersihan otomatis saat component dihapus
useEffect(() => {
  return () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    if (streamData) {
      streamData.getTracks().forEach((track) => track.stop());
    }
  };
}, []);

  // Tombol deteksi manual khusus file foto statis
  const handleDetection = async () => {
    if (!file) {
      setResult("Please upload image first");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/bisindo/predict_image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(
        `Prediction: ${data.prediction || "-"}\nText: -\nConfidence: ${data.confidence || "-"}`
      );
    } catch (err) {
      console.error(err);
      setResult("Failed to connect API");
    } finally {
      setLoading(false);
      };
  };

  return (
    <section
      id="detection"
      style={{
        padding: "80px 5%",
        background: "#F4FFFD",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "70px" }}>
        <h2
          style={{
            fontSize: "42px",
            color: "#2B2B2B",
            marginBottom: "20px",
          }}
        >
          Demo Deteksi AI
        </h2>
        <p style={{ color: "#666", fontSize: "18px" }}>
          Unggah gambar bahasa isyarat atau gunakan kamera langsung.
        </p>
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          position: "relative",
          padding: "5%",
          borderRadius: "30px",
          border: "1px solid #D7F2EB",
          boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
        }}
      >
        {/* Preview Screen */}
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
            position: "relative",
          }}
        >
          {cameraOn ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#000",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  zIndex: 10,
                }}
              >
                <div
                  className="live-dot"
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: aiStatus === "ready" ? "#00A86B" : "#ff3b30",
                  }}
                />
                {aiStatus === "ready" ? "LIVE WEBSOCKET ACTIVE" : "CONNECTING / ERROR"}
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </>
          ) : image ? (
            <img
              src={image}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <p style={{ color: "#999", fontSize: "18px" }}>
              Pratinjau Gambar / Kamera
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <label
            onMouseOver={(e) => (e.currentTarget.style.background = "#4FD6CA")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#2EC4B6")}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px",
              background: "#2EC4B6",
              color: "white",
              borderRadius: "14px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.35s ease",
            }}
          >
            Pilih Gambar
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </label>

          <button
            onClick={toggleCamera}
            onMouseOver={(e) => {
              e.target.style.background = cameraOn ? "#E53935" : "#4FD6CA";
            }}
            onMouseOut={(e) => {
              e.target.style.background = cameraOn ? "#D93025" : "#2EC4B6";
            }}
            style={{
              flex: 1,
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: cameraOn ? "#D93025" : "#2EC4B6",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.35s ease",
            }}
          >
            {cameraOn ? "Stop Realtime Cam" : "Mulai Kamera Langsung"}
          </button>
        </div>

        {/* Action Button khusus foto biasa */}
        {!cameraOn && file && (
          <button
            onClick={handleDetection}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) e.target.style.background = "#4FD6CA";
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.background = "#2EC4B6";
            }}
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: "14px",
              background: loading ? "#7EDFD6" : "#2EC4B6",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.35s ease",
            }}
          >
            {loading ? "⏳ Detecting..." : "Detect Sign Language"}
          </button>
        )}

        {/* Kotak Monitoring Hasil Realtime */}
        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            borderRadius: "20px",
            background: "#F4FFFD",
            border: "1px solid #D7F2EB",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ color: "#2EC4B6", margin: 0 }}>Hasil Deteksi</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: aiStatus === "ready" ? "#00A86B" : "#D93025",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: aiStatus === "ready" ? "#00A86B" : "#D93025",
                }}
              />
              {aiStatus === "ready" ? "Server Active" : "Server Error / Inactive"}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #D7F2EB",
              }}
            >
              <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
                Prediksi AI
              </p>
              <h2 style={{ color: "#2EC4B6", fontSize: "32px", margin: 0 }}>
                {prediction}
              </h2>
            </div>

            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #D7F2EB",
              }}
            >
              <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
                Teks Terdeteksi
              </p>
              <h3 style={{ color: "#333", margin: 0, fontSize: "24px" }}>
                {detectedText}
              </h3>
            </div>

            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #D7F2EB",
              }}
            >
              <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
                Kepercayaan
              </p>
              <h3 style={{ color: "#333", margin: 0, fontSize: "24px" }}>
                {confidence}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detection;