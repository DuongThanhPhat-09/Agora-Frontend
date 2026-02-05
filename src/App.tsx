import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import TutorSearchPage from './pages/TutorSearch/TutorSearchPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ResetPasswordPage from './pages/Login/ResetPasswordPage';
import { TutorDetailPage } from './pages/TutorDetail';
import TutorLayout from './layouts/TutorLayout';
import TutorDashboard from './pages/TutorWorkspace/TutorDashboard';
import TutorSchedulePage from './pages/TutorSchedule';
import MessagesPage from './pages/TutorMessages';
import { TutorWalletPage } from './pages/TutorWallet';
import { TutorClassesPage } from './pages/TutorClasses';
import { TutorProfilePage } from './pages/TutorProfile';
import { AdminDashboardPage } from './pages/AdminDashboard';
import { UserManagementPage } from './pages/AdminUserManagement';
import { AdminVettingPage } from './pages/AdminVetting';
import { AdminDisputesPage } from './pages/AdminDisputes';
import AdminDisputeDetailPageExpanded from './pages/AdminDisputes/AdminDisputeDetailPageExpanded';
import { AdminFinancialsPage } from './pages/AdminFinancials';
import { AdminSettingsPage } from './pages/AdminSettings';
import AdminLayout from './layouts/AdminLayout';
import TutorPortalLayout from './layouts/TutorPortalLayout';
import {
  TutorPortalProfile,
  TutorPortalDashboard,
  TutorPortalSchedule,
  TutorPortalMessages,
  TutorPortalClasses,
  TutorPortalClassDetail,
  TutorPortalStudentProfile,
} from './pages/TutorPortal';
import NotFoundPage from './pages/Error/NotFoundPage';
import UnauthorizedPage from './pages/Error/UnauthorizedPage';
import ForbiddenPage from './pages/Error/ForbiddenPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ParentLayout from './layouts/ParentLayout';
import ParentDashboard from './pages/ParentDashboard';
import ParentChildren from './pages/ParentChildren';
import ChildrenDetail from './pages/ParentChildren/Details';
import ParentWallet from './pages/ParentWallet';
import ParentMessage from './pages/ParentMessage';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';

// ---------------------

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} style={{ zIndex: 99999 }} />

      <Routes>
        {/* Public Routes */}
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/tutor-search" element={<TutorSearchPage />} />
        <Route path="/tutor-detail" element={<TutorDetailPage />} />
        <Route path="/tutor-detail/:id" element={<TutorDetailPage />} />

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
          <Route path="disputes/:disputeId" element={<AdminDisputeDetailPageExpanded />} />
          <Route path="financials" element={<AdminFinancialsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Tutor Portal - New Layout based on Figma */}
        <Route path="/tutor-portal" element={<TutorPortalLayout />}>
          <Route index element={<Navigate to="/tutor-portal/dashboard" replace />} />
          <Route path="dashboard" element={<TutorPortalDashboard />} />
          <Route path="profile" element={<TutorPortalProfile />} />
          <Route path="schedule" element={<TutorPortalSchedule />} />
          <Route path="messages" element={<TutorPortalMessages />} />
          <Route path="classes" element={<TutorPortalClasses />} />
          <Route path="classes/:classId" element={<TutorPortalClassDetail />} />
          <Route path="students/:studentId" element={<TutorPortalStudentProfile />} />
          {/* Future routes: sessions, finance, settings */}
        </Route>

        {/* Parent Layout - PROTECTED */}
        <Route
          path="/parent"
          element={
            // <ProtectedRoute allowedRoles={["Admin"]}>
            //   <AdminLayout />
            // </ProtectedRoute>
            <ParentLayout />
          }
        >
          <Route index element={<Navigate to="/parent/dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="children" element={<ParentChildren />} />
          <Route path="children/:id" element={<ChildrenDetail />} />
          <Route path="wallet" element={<ParentWallet />} />
          <Route path="messages" element={<ParentMessage />} />
        </Route>

        {/* Student Layout - PROTECTED */}
        <Route
          path="/student"
          element={
            // <ProtectedRoute allowedRoles={["Admin"]}>
            //   <AdminLayout />
            // </ProtectedRoute>
            <ParentLayout />
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

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
