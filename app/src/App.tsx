import { Routes, Route } from "react-router-dom";
import Page from "./pages/page2";
import LandingPage from "./pages/LandingPage";
import CustomCursor from "./components/customCursor";
import Window from "./pages/Window";

function App() {
  return (
    <div>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/page" element={<Page />} />
        <Route path="/window" element={<Window />} />
      </Routes>
    </div>
  );
}

export default App;
