import { Link } from "react-router-dom";

function Navbar() {
  const navItemStyle = {
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  const handleMouseOver = (e) => {
    e.target.style.color = "#2EC4B6";
  };

  const handleMouseOut = (e) => {
    e.target.style.color = "#2B2B2B";
  };

  return (
    <nav
      style={{
        width: "100%",
        padding: "20px 70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #D7F2EB",
        zIndex: 1000,
      }}
    >
      <a
        href="#home"
        style={{
          textDecoration: "none",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#2EC4B6",
          }}
        >
          SignBridge
        </h2>
      </a>

      <ul
        style={{
          display: "flex",
          gap: "35px",
          listStyle: "none",
          alignItems: "center",
          fontSize: "17px",
          color: "#2B2B2B",
        }}
      >
        <li
          style={navItemStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <a href="#home" style={linkStyle}>
            Beranda
          </a>
        </li>

        <li
          style={navItemStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <a href="#about" style={linkStyle}>
            Tentang
          </a>
        </li>

        <li
          style={navItemStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <a href="#features" style={linkStyle}>
            Fitur
          </a>
        </li>

        <li
          style={navItemStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <a href="#how-it-works" style={linkStyle}>
            Tutorial
          </a>
        </li>

        <li
          style={navItemStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <Link
            to="/galeri-bisindo"
            style={linkStyle}
          >
            Galeri BISINDO
          </Link>
        </li>

        <a
          href="#detection"
          style={{
            textDecoration: "none",
          }}
        >
          <button
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "12px",
              background: "#2EC4B6",
              color: "white",
              cursor: "pointer",
              fontSize: "15px",
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
            Coba Deteksi AI
          </button>
        </a>
      </ul>
    </nav>
  );
}

export default Navbar;