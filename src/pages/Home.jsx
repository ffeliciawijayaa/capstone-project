import { useEffect } from "react";

import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Features from "../sections/Features";
import HowItWorks from "../sections/HowItWorks";
import Detection from "../sections/Detection";
import Footer from "../sections/Footer";

function Home() {

  useEffect(() => {
    if (sessionStorage.getItem("scrollToDetection")) {
      sessionStorage.removeItem("scrollToDetection");

      setTimeout(() => {
        document
          .getElementById("detection")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 300);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Detection />
      <Footer />
    </>
  );
}

export default Home;