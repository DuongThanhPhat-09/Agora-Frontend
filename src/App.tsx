import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import TutorSearchPage from "./pages/TutorSearch/TutorSearchPage";
import LoginPage from "./pages/Login/LoginPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutor-search" element={<TutorSearchPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
