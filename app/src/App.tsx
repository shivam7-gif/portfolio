import { Routes, Route } from "react-router-dom";
import Page from "./pages/page2";
import LandingPage from "./pages/LandingPage";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/page" element={<Page />} />
      </Routes>
    </div>
  );
}

export default App;
