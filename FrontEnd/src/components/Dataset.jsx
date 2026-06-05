import { useState } from "react";
function Dataset() {
  const letters = ["A", "B", "C", "D", "E", "F"];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section
      id="dataset"
      style={{
        padding: "120px 80px",
        background: "#F4FFFD",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        <h2
          style={{
            fontSize: "52px",
            color: "#2B2B2B",
            marginBottom: "20px",
          }}
        >
          Dataset BISINDO
        </h2>

        <p
          style={{
            maxWidth: "850px",
            margin: "auto",
            color: "#666",
            fontSize: "18px",
            lineHeight: "1.8",
          }}
        >
          SignBridge menggunakan dataset Bahasa Isyarat Indonesia
          (BISINDO) sebagai sumber data untuk melatih model
          Artificial Intelligence dalam mengenali gesture alfabet
          secara cepat dan akurat.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "30px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {letters.map((letter) => (
          <div
            key={letter}
            onClick={() =>
                setSelectedImage(`/dataset/${letter}.jpg`)
            }
            style={{
              background: "white",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid #D7F2EB",
              boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(46,196,182,0.15)";
            }}

            onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(0,0,0,0.05)";
            }}
          >
            <img
            src={`/dataset/${letter}.jpg`}
            alt={`Huruf ${letter}`}
            style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                transition: "0.4s ease",
            }}
            />

            <div
              style={{
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  color: "#2EC4B6",
                  marginBottom: "8px",
                }}
              >
                Huruf {letter}
              </h3>

              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                Gesture BISINDO
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        <p
          style={{
            color: "#666",
            marginBottom: "25px",
            fontSize: "18px",
          }}
        >
          Dan 20+ gesture lainnya yang digunakan
          untuk melatih model AI SignBridge.
        </p>

       <a
        href="https://www.kaggle.com/datasets/achmadnoer/alfabet-bisindo/data"
        target="_blank"
        rel="noreferrer"
        style={{
            display: "inline-block",
            padding: "14px 28px",
            background: "#2EC4B6",
            color: "white",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
            e.target.style.background = "#4FD6CA";
            e.target.style.transform = "translateY(-3px)";
        }}
        onMouseOut={(e) => {
            e.target.style.background = "#2EC4B6";
            e.target.style.transform = "translateY(0)";
        }}
        >
        Lihat Dataset Lengkap
        </a>
      </div>
      <div
  style={{
    marginTop: "80px",
    textAlign: "center",
    background: "white",
    padding: "50px",
    borderRadius: "30px",
    border: "1px solid #D7F2EB",
    boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
    maxWidth: "900px",
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  <h2
    style={{
      color: "#2B2B2B",
      marginBottom: "20px",
      fontSize: "36px",
    }}
  >
    Ingin mencoba deteksi bahasa isyarat?
  </h2>

  <p
    style={{
      color: "#666",
      fontSize: "18px",
      lineHeight: "1.8",
      maxWidth: "650px",
      margin: "0 auto 30px auto",
    }}
  >
    Gunakan fitur AI Detection untuk mengenali gesture
    bahasa isyarat secara otomatis menggunakan model
    Artificial Intelligence yang telah dilatih menggunakan
    dataset BISINDO.
  </p>

  <a
  href="/"
  onClick={() => {
    sessionStorage.setItem("scrollToDetection", "true");
  }}
  style={{
    textDecoration: "none",
  }}
  >
    <button
      style={{
        padding: "16px 36px",
        border: "none",
        borderRadius: "14px",
        background: "#2EC4B6",
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.background = "#4FD6CA";
        e.target.style.transform = "translateY(-3px)";
      }}
      onMouseOut={(e) => {
        e.target.style.background = "#2EC4B6";
        e.target.style.transform = "translateY(0)";
      }}
    >
       Coba Deteksi AI
    </button>
  </a>
</div>
{selectedImage && (
  <div
    onClick={() => setSelectedImage(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      cursor: "pointer",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
      }}
    >
      <img
        src={selectedImage}
        alt="Preview"
        style={{
          maxWidth: "80vw",
          maxHeight: "80vh",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      />

      <button
        onClick={() => setSelectedImage(null)}
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          width: "40px",
          height: "40px",
          border: "none",
          borderRadius: "50%",
          background: "#2EC4B6",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  </div>
)}
    </section>
    
  );
}

export default Dataset;