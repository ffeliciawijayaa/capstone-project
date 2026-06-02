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
          gap: "60px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
  style={{
    width: "220px",
    height: "220px",
    background: "#E8FFF5",
    borderRadius: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "90px",
  }}
>
  🤟
</div>
        </div>

        <div style={{ flex: 1 }}>
          <h2
  style={{
    fontSize: "48px",
    color: "#2B2B2B",
    marginBottom: "25px",
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