import { useState } from "react"; // 1. Import useState di bagian paling atas file

// 2. IMPORT FOTO DARI FOLDER ASSETS (Sesuaikan dengan file di image_5e44f6.png)
import fotoMultazam from "../assets/multazam.jpg";
import fotoFeli from "../assets/Feli.jpg"; // Menggunakan 'F' kapital sesuai gambar folder
import fotoAdhit from "../assets/adhit.jpg";
import fotoPandu from "../assets/pandu.jpg";
import fotoShiva from "../assets/shiva.jpg";
import fotoNabila from "../assets/nabila.jpg";

const teamMembers = [
  { name: "Multazam", role: "Lead AI Engineer", image: fotoMultazam },
  { name: "Felicia Wijaya", role: "AI Engineer", image: fotoFeli },
  { name: "Abraham Adhitya V", role: "Fullstack enginer", image: fotoAdhit },
  { name: "Pandu Ksatria J", role: "Fullstack enginer", image: fotoPandu },
  { name: "Shiva Aulia N", role: "Data Science", image: fotoShiva },
  { name: "Nabila Agatha P", role: "Data Science", image: fotoNabila },
];

function AboutUs() {
  // Tambahkan state untuk melacak kartu mana yang sedang didekati kursor
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div style={{ 
      position: "relative", 
      overflow: "hidden", 
      paddingTop: "120px", 
      minHeight: "100vh", 
      backgroundColor: "#f4f7f6" 
    }}>
      
      {/* ELEMEN DEKORATIF ATAS */}
      <div style={{
        position: "absolute",
        top: "-5%",
        right: "-10%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(46,196,182,0.25) 0%, rgba(244,247,246,0) 70%)",
        filter: "blur(80px)",
        zIndex: 0,
        pointerEvents: "none"
      }} />

      {/* ELEMEN DEKORATIF BAWAH */}
      <div style={{
        position: "absolute",
        bottom: "-5%",
        left: "-10%",
        width: "550px",
        height: "550px",
        background: "radial-gradient(circle, rgba(46,196,182,0.18) 0%, rgba(244,247,246,0) 70%)",
        filter: "blur(70px)",
        zIndex: 0,
        pointerEvents: "none"
      }} />

      {/* Header */}
      <section style={{ textAlign: "center", marginBottom: "60px", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "48px", color: "#2B2B2B", fontWeight: "700" }}>Tentang Kami</h1>
        <p style={{ color: "#666", fontSize: "18px", marginTop: "10px" }}>Membangun masa depan inklusif dengan teknologi AI</p>
      </section>

      {/* Project Overview */}
      <section id="overview" style={{ maxWidth: "800px", margin: "0 auto 80px", position: "relative", zIndex: 1, padding: "0 20px" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "20px", color: "#2B2B2B" }}>Project Overview</h2>
        <p style={{ lineHeight: "1.8", color: "#444", fontSize: "16px", textAlign: "justify" }}>
          SignBridge adalah platform berbasis Artificial Intelligence yang dirancang untuk membantu masyarakat mempelajari bahasa isyarat serta mengenali bahasa isyarat secara lebih mudah, cepat, dan interaktif. Kami memanfaatkan teknologi Computer Vision dan Deep Learning untuk mendukung komunikasi yang lebih inklusif bagi penyandang tunarungu dan masyarakat umum.
        </p>
      </section>

      {/* Meet Our Team */}
      <section id="team" style={{ maxWidth: "1000px", margin: "auto", position: "relative", zIndex: 1, padding: "0 20px", paddingBottom: "100px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "32px", color: "#2B2B2B" }}>Tim Kami</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "30px" 
        }}>
          {teamMembers.map((member, index) => {
            // Cek apakah kartu ini sedang di-hover oleh kursor
            const isHovered = hoveredIndex === index;

            return (
              <div 
                key={index} 
                // Pasang event listener untuk mendeteksi kursor masuk dan keluar
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  textAlign: "center", 
                  padding: "35px 20px", 
                  background: "#fff", 
                  borderRadius: "20px",
                  border: "1px solid rgba(46,196,182,0.15)",
                  cursor: "pointer",
                  
                  // ANIMASI UTAMA: Efek transisi biar gerakannya mulus gak patah-patah
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  
                  // Trik transform: jika kursor mengarah, kartu naik ke atas 8 pixel, jika tidak kembali normal
                  transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                  
                  // Trik shadow: jika kursor mengarah, bayangan membesar dan melembut
                  boxShadow: isHovered 
                    ? "0 20px 35px rgba(46,196,182,0.15)" 
                    : "0 10px 30px rgba(0,0,0,0.04)",
                }}
              >
                {/* Lingkaran Foto */}
                <div style={{ 
                  width: "110px", 
                  height: "110px", 
                  background: "#e8f7f5", 
                  borderRadius: "50%", 
                  margin: "0 auto 20px",
                  // overflow hidden wajib ada agar sisi sudut gambar kotak terpotong bulat mengikuti div pembungkusnya
                  overflow: "hidden", 
                  // Efek tambahan: lingkaran foto ikut membesar dikit pas kartu di-hover
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.3s ease",
                  boxShadow: "inset 0 2px 8px rgba(46,196,182,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {/* TAG IMAGE UNTUK MENAMPILKAN FOTO HASIL CROP */}
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover" // Menjaga foto proporsional & tidak gepeng
                    }} 
                  />
                </div>
                <h3 style={{ fontSize: "19px", color: "#2B2B2B", marginBottom: "8px", fontWeight: "600" }}>{member.name}</h3>
                <p style={{ color: "#2ec4b6", fontSize: "14px", fontWeight: "600", letterSpacing: "0.5px" }}>{member.role}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default AboutUs;