import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import DatasetPage from "./pages/DatasetPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galeri-bisindo" element={<DatasetPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;