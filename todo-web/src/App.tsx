// dependencies

import {BrowserRouter, Route, Routes} from "react-router-dom";

// page
import Home from "./pages/Home.tsx";
import Footer from "@/components/Footer.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} index/>
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
