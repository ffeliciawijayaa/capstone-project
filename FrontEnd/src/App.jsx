// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Home from "./pages/Home";
import DatasetPage from "./pages/DatasetPage";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar sekarang menggunakan Link standar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galeri-bisindo" element={<DatasetPage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;