import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import TutorSearchPage from "./pages/TutorSearch/TutorSearchPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import { TutorDetailPage } from "./pages/TutorDetail";
import { TutorWorkspacePage } from "./pages/TutorWorkspace";
import TutorSchedulePage from "./pages/TutorSchedule";
import MessagesPage from "./pages/TutorMessages";
import { TutorWalletPage } from "./pages/TutorWallet";
import { TutorClassesPage } from "./pages/TutorClasses";
import { TutorProfilePage } from "./pages/TutorProfile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ---------------------

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutor-search" element={<TutorSearchPage />} />
        <Route path="/tutor-detail" element={<TutorDetailPage />} />
        <Route path="/tutor-detail/:id" element={<TutorDetailPage />} />
        <Route path="/tutor-workspace" element={<TutorWorkspacePage />} />
        <Route path="/tutor-schedule" element={<TutorSchedulePage />} />
        <Route path="/tutor-classes" element={<TutorClassesPage />} />
        <Route path="/tutor-messages" element={<MessagesPage />} />
        <Route path="/tutor-wallet" element={<TutorWalletPage />} />
        <Route path="/tutor-profile" element={<TutorProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
