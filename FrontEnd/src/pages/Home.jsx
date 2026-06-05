import { useEffect } from "react";

import Hero from "../sections/Hero";
import About from "../sections/About";
import Features from "../sections/Features";
import HowItWorks from "../sections/HowItWorks";
import Detection from "../sections/Detection";
import Footer from "../sections/Footer";

function Home() {
  useEffect(() => {
    // 1. Logika otomatis scroll untuk Deteksi AI
    if (sessionStorage.getItem("scrollToDetection")) {
      sessionStorage.removeItem("scrollToDetection");
      setTimeout(() => {
        document
          .getElementById("detection")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }

    // 2. Logika otomatis scroll untuk Tentang Proyek
    if (sessionStorage.getItem("scrollToAbout")) {
      sessionStorage.removeItem("scrollToAbout");
      setTimeout(() => {
        document
          .getElementById("about")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, []); // Penutup useEffect yang benar di sini

  return (
    <div id="top">
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Detection />
      <Footer />
    </div>
  );
}

export default Home;