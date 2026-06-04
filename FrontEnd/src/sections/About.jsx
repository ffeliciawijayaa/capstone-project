
import aboutImg from "../assets/about-image.jpg"; 

function About() {
  return (
    <section
      id="about"
      style={{
        padding: "120px 80px",
        background: "white",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "flex",
          gap: "80px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* === SISI KIRI: FOTO BERSIH === */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative" }}>
          {/* Efek bulatan dekorasi toska */}
          <div
            style={{
              position: "absolute",
              width: "320px",
              height: "320px",
              background: "rgba(46, 196, 182, 0.15)",
              borderRadius: "50%",
              filter: "blur(40px)",
              top: "-10px",
              left: "10px",
              zIndex: 1,
            }}
          ></div>

          {/* Foto Utama */}
          <img
            src={aboutImg}
            alt="Tentang SignBridge"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "380px",
              objectFit: "cover",
              borderRadius: "40px",
              position: "relative",
              zIndex: 2,
              boxShadow: "0 20px 40px rgba(46, 196, 182, 0.15)",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              cursor: "pointer",
            }}
            // === TEMPELKAN KODE EVENT DI SINI (SETELAH TUTUP KURUNG KURAWAL STYLE) ===
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 30px 50px rgba(46, 196, 182, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(46, 196, 182, 0.15)";
            }}
          />
        </div>

        {/* === SISI KANAN: TEKS === */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2
            style={{
              fontSize: "48px",
              color: "#2B2B2B",
              marginBottom: "25px",
              fontWeight: "bold",
            }}
          >
            Tentang SignBridge
          </h2>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
              lineHeight: "1.9",
              marginBottom: "20px",
            }}
          >
            SignBridge merupakan platform berbasis Artificial Intelligence (AI)
            yang dirancang untuk membantu masyarakat mempelajari serta mengenali
            bahasa isyarat secara lebih mudah, cepat, dan interaktif.
          </p>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
              lineHeight: "1.9",
              marginBottom: "20px",
            }}
          >
            Sistem ini memanfaatkan teknologi Computer Vision dan Deep Learning
            untuk mendeteksi gerakan bahasa isyarat melalui gambar maupun kamera
            secara real-time.
          </p>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
              lineHeight: "1.9",
            }}
          >
            Dengan SignBridge, pengguna dapat belajar bahasa isyarat,
            memahami bentuk huruf yang benar, serta meningkatkan komunikasi
            antara penyandang tunarungu dan masyarakat umum.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;