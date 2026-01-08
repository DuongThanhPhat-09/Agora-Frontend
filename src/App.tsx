import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import TutorSearchPage from "./pages/TutorSearch/TutorSearchPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutor-search" element={<TutorSearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
