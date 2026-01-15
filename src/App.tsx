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
import { AdminDashboardPage } from "./pages/AdminDashboard";
import { UserManagementPage } from "./pages/AdminUserManagement";
import { AdminVettingPage } from "./pages/AdminVetting";
import { AdminDisputesPage } from "./pages/AdminDisputes";
import AdminDisputeDetailPage from "./pages/AdminDisputes/AdminDisputeDetailPage";
import { AdminFinancialsPage } from "./pages/AdminFinancials";
import { AdminSettingsPage } from "./pages/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotFoundPage, UnauthorizedPage, ForbiddenPage } from "./pages/ErrorPage";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Error Pages */}
        <Route path="/401" element={<UnauthorizedPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Tutor Routes - Chỉ cho role "Tutor" */}
        <Route
          path="/tutor-workspace"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <TutorWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-schedule"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <TutorSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-classes"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <TutorClassesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-messages"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-wallet"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <TutorWalletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-profile"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <TutorProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Chỉ cho role "Admin" */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-user-management"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-vetting"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminVettingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-disputes"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDisputesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-disputes/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDisputeDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-financials"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminFinancialsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-settings"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Route - Must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
