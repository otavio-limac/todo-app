// dependencies

import {BrowserRouter, Route, Routes} from "react-router-dom";

// page
import Home from "./components/Home.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} index/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
