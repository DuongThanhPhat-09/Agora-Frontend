import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import TutorSearchPage from "./pages/TutorSearch/TutorSearchPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import { TutorDetailPage } from "./pages/TutorDetail";
import TutorLayout from "./layouts/TutorLayout";
import TutorDashboard from "./pages/TutorWorkspace/TutorDashboard";
import TutorSchedulePage from "./pages/TutorSchedule";
import MessagesPage from "./pages/TutorMessages";
import { TutorWalletPage } from "./pages/TutorWallet";
import { TutorClassesPage } from "./pages/TutorClasses";
import { TutorProfilePage } from "./pages/TutorProfile";
import { AdminDashboardPage } from "./pages/AdminDashboard";
import { UserManagementPage } from "./pages/AdminUserManagement";
import { AdminVettingPage } from "./pages/AdminVetting";
import { AdminDisputesPage } from "./pages/AdminDisputes";
import AdminDisputeDetailPage from "./pages/AdminDisputes/AdminDisputeDetailPage";
import { AdminFinancialsPage } from "./pages/AdminFinancials";
import { AdminSettingsPage } from "./pages/AdminSettings";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFoundPage from "./pages/Error/NotFoundPage";
import UnauthorizedPage from "./pages/Error/UnauthorizedPage";
import ForbiddenPage from "./pages/Error/ForbiddenPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---------------------

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/tutor-search" element={<TutorSearchPage />} />
        <Route path="/tutor-detail" element={<TutorDetailPage />} />
        <Route path="/tutor-detail/:id" element={<TutorDetailPage />} />

        {/* Redirect old tutor URLs to new structure */}
        <Route path="/tutor-workspace" element={<Navigate to="/tutor/workspace" replace />} />
        <Route path="/tutor-schedule" element={<Navigate to="/tutor/schedule" replace />} />
        <Route path="/tutor-classes" element={<Navigate to="/tutor/classes" replace />} />
        <Route path="/tutor-messages" element={<Navigate to="/tutor/messages" replace />} />
        <Route path="/tutor-wallet" element={<Navigate to="/tutor/wallet" replace />} />
        <Route path="/tutor-profile" element={<Navigate to="/tutor/profile" replace />} />

        {/* Tutor Layout with nested routes - PROTECTED */}
        <Route
          path="/tutor"
          element={
            // <ProtectedRoute allowedRoles={["Tutor"]}>
            //   <TutorLayout />
            // </ProtectedRoute>
            <TutorLayout />

          }
        >
          <Route path="workspace" element={<TutorDashboard />} />
          <Route path="schedule" element={<TutorSchedulePage />} />
          <Route path="classes" element={<TutorClassesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="wallet" element={<TutorWalletPage />} />
          <Route path="profile" element={<TutorProfilePage />} />
        </Route>

        {/* Admin Layout - PROTECTED */}
        <Route
          path="/admin"
          element={
            // <ProtectedRoute allowedRoles={["Admin"]}>
            //   <AdminLayout />
            // </ProtectedRoute>
            <AdminLayout />

          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="vetting" element={<AdminVettingPage />} />
          <Route path="disputes" element={<AdminDisputesPage />} />
          <Route path="disputes/:id" element={<AdminDisputeDetailPage />} />
          <Route path="financials" element={<AdminFinancialsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Error Pages */}
        <Route path="/401" element={<UnauthorizedPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Catch-all Route - Must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
