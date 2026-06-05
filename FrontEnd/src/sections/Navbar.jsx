import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom'; // 1. Tambahkan useLocation di sini
import { Link as ScrollLink } from 'react-scroll';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // 2. Panggil hook useLocation

  const navItemStyle = { cursor: "pointer", transition: "all 0.3s ease" };
  const linkStyle = { textDecoration: "none", color: "inherit", display: "block" };

  const handleMouseOver = (e) => { e.target.style.color = "#2EC4B6"; };
  const handleMouseOut = (e) => { e.target.style.color = "#2B2B2B"; };

  // 3. Ganti pengecekan menggunakan location.pathname dari React Router
  const isHomePage = location.pathname === "/";

  return (
    <nav style={{ width: "100%", padding: "20px 70px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "fixed", top: 0, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)", zIndex: 1000 }}>
      
      {/* Logo SignBridge */}
      <RouterLink to="/" style={{ textDecoration: "none" }}>
        <h2 style={{ fontSize: "30px", fontWeight: "bold", color: "#2EC4B6", margin: 0 }}>SignBridge</h2>
      </RouterLink>

      <ul style={{ display: "flex", gap: "35px", listStyle: "none", alignItems: "center", fontSize: "17px", color: "#2B2B2B", margin: 0 }}>
        
        {/* Jika di halaman utama, tampilkan semua menu lengkap */}
        {isHomePage ? (
          <>
            {/* Beranda */}
            <li style={navItemStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
              <ScrollLink to="top" smooth="true" duration={200} style={linkStyle}>Beranda</ScrollLink>
            </li>

            {/* Tentang */}
            <li 
              style={{ ...navItemStyle, position: "relative" }}
              onMouseEnter={() => setIsDropdownOpen(true)}  
              onMouseLeave={() => setIsDropdownOpen(false)} 
            >
              <span style={{ cursor: "pointer", padding: "20px 0", display: "inline-block" }}>
                Tentang ▼
              </span>
              <div className="dropdown-container" style={{ display: isDropdownOpen ? "block" : "none", position: "absolute", top: "100%", left: "-20px", paddingTop: "5px" }}>
                <div style={{ background: "#fff", padding: "10px 0", width: "180px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
                  <ScrollLink to="about" smooth="true" duration={200} style={{ display: "block", padding: "10px 20px", color: "#333", textDecoration: "none", cursor: "pointer" }} onClick={() => setIsDropdownOpen(false)}>
                    Tentang Proyek
                  </ScrollLink>
                  <RouterLink to="/about" style={{ display: "block", padding: "10px 20px", color: "#333", textDecoration: "none" }} onClick={() => setIsDropdownOpen(false)}>
                    Tentang Kami
                  </RouterLink>
                </div>
              </div>
            </li>

            {/* Fitur */}
            <li style={navItemStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
              <ScrollLink to="features" smooth="true" duration={200} style={linkStyle}>Fitur</ScrollLink>
            </li>

            {/* Tutorial */}
            <li style={navItemStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
              <ScrollLink to="how-it-works" smooth="true" duration={200} style={linkStyle}>Tutorial</ScrollLink>
            </li>

            {/* Galeri BISINDO */}
            <li style={navItemStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
              <RouterLink to="/galeri-bisindo" style={linkStyle}>Galeri BISINDO</RouterLink>
            </li>

            {/* Tombol Coba Deteksi AI */}
            <ScrollLink to="detection" smooth="true" duration={200}>
              <button style={{ padding: "12px 24px", border: "none", borderRadius: "12px", background: "#2EC4B6", color: "white", cursor: "pointer" }}>
                Coba Deteksi AI
              </button>
            </ScrollLink>
          </>
        ) : (
          /* Jika SEDANG DI HALAMAN LAIN (seperti Dataset), hanya munculkan satu teks Beranda saja di kanan */
          <li style={navItemStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <RouterLink to="/" style={{ ...linkStyle, fontWeight: "500" }}>
              Beranda
            </RouterLink>
          </li>
        )}

      </ul>
    </nav>
  );
}

export default Navbar;