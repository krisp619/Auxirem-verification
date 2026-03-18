import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Verify from "./pages/Verify";
import CertificateView from "./pages/CertificateView";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home / Verify Page */}
        <Route path="/verify" element={<Verify />} />

        {/* Certificate Page */}
        <Route path="/certificate/:id" element={<CertificateView />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;