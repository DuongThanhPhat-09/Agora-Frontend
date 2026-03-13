import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- Static imports (layouts, infrastructure, always-needed components) ---
import AdminLayout from './layouts/AdminLayout';
import TutorPortalLayout from './layouts/TutorPortalLayout';
import ParentLayout from './layouts/ParentLayout';
import StudentLayout from './layouts/StudentLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SessionExpiredModal from './components/SessionExpiredModal';
import PageLoader from './components/PageLoader/PageLoader';
import { getCurrentUser, isTokenExpired } from './services/auth.service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Lazy-loaded pages ---
// Public
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const TutorSearchPage = lazy(() => import('./pages/TutorSearch/TutorSearchPage'));
const TutorDetailPage = lazy(() => import('./pages/TutorDetail/TutorDetailPage'));
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Register/RegisterPage'));
const ResetPasswordPage = lazy(() => import('./pages/Login/ResetPasswordPage'));

// Error pages
const NotFoundPage = lazy(() => import('./pages/Error/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/Error/UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('./pages/Error/ForbiddenPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboard/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('./pages/AdminUserManagement/UserManagementPage'));
const AdminVettingPage = lazy(() => import('./pages/AdminVetting/AdminVettingPage'));
const AdminFinancialsPage = lazy(() => import('./pages/AdminFinancials/AdminFinancialsPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettings/AdminSettingsPage'));
const AdminWarningsPage = lazy(() => import('./pages/AdminWarnings/AdminWarningsPage'));
const PayoutOverviewPage = lazy(() => import('./pages/AdminPayout/PayoutOverview/PayoutOverviewPage'));
const PayoutDetailPage = lazy(() => import('./pages/AdminPayout/PayoutDetail/PayoutDetailPage'));
const PendingReviewPage = lazy(() => import('./pages/AdminPayout/PendingReview/PendingReviewPage'));
const AllPayoutRequestsPage = lazy(() => import('./pages/AdminPayout/AllRequests/AllPayoutRequestsPage'));
const FraudLogsPage = lazy(() => import('./pages/AdminPayout/FraudLogs/FraudLogsPage'));

// Tutor Portal pages
const TutorPortalProfile = lazy(() => import('./pages/TutorPortal/TutorPortalProfile'));
const TutorPortalDashboard = lazy(() => import('./pages/TutorPortal/TutorPortalDashboard'));
const TutorPortalSchedule = lazy(() => import('./pages/TutorPortal/TutorPortalSchedule'));
const TutorPortalMessages = lazy(() => import('./pages/TutorPortal/TutorPortalMessages'));
const TutorPortalClasses = lazy(() => import('./pages/TutorPortal/TutorPortalClasses'));
const TutorPortalClassDetail = lazy(() => import('./pages/TutorPortal/TutorPortalClassDetail'));
const TutorPortalStudentProfile = lazy(() => import('./pages/TutorPortal/TutorPortalStudentProfile'));
const TutorPortalBookings = lazy(() => import('./pages/TutorPortal/TutorPortalBookings'));
const TutorFinanceDashboardPage = lazy(() => import('./pages/TutorFinance/TutorFinanceDashboard/TutorFinanceDashboardPage'));
const TransactionHistoryPage = lazy(() => import('./pages/TutorFinance/TransactionHistory/TransactionHistoryPage'));
const BankInfoManagementPage = lazy(() => import('./pages/TutorFinance/BankInfoManagement/BankInfoManagementPage'));
const TutorAccount = lazy(() => import('./pages/TutorAccount'));
const CreateWithdrawalPage = lazy(() => import('./pages/TutorFinance/CreateWithdrawal/CreateWithdrawalPage'));
const WithdrawalListPage = lazy(() => import('./pages/TutorFinance/WithdrawalList/WithdrawalListPage'));
const WithdrawalDetailPage = lazy(() => import('./pages/TutorFinance/WithdrawalList/WithdrawalDetailPage'));

// Parent pages
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const ParentBooking = lazy(() => import('./pages/ParentBooking'));
const BookingDetail = lazy(() => import('./pages/ParentBooking/Details'));
const ParentWallet = lazy(() => import('./pages/ParentWallet'));
const ParentMessage = lazy(() => import('./pages/ParentMessage'));
const PaymentPage = lazy(() => import('./pages/ParentBooking/Payment'));
const ParentStudent = lazy(() => import('./pages/ParentStudent'));
const ParentLessons = lazy(() => import('./pages/ParentLessons'));
const ParentLessonDetail = lazy(() => import('./pages/ParentLessons/ParentLessonDetail'));
const ParentCalendar = lazy(() => import('./pages/ParentLessons/ParentCalendar'));
const ParentAccount = lazy(() => import('./pages/ParentAccount'));

// Student pages
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentBooking = lazy(() => import('./pages/StudentBooking'));
const StudentLessons = lazy(() => import('./pages/StudentLessons'));
const StudentLessonDetail = lazy(() => import('./pages/StudentLessons/StudentLessonDetail'));
const StudentCalendar = lazy(() => import('./pages/StudentLessons/StudentCalendar'));
const StudentLinkAccount = lazy(() => import('./pages/StudentLinkAccount'));
const StudentAccount = lazy(() => import('./pages/StudentAccount'));

// Payment callback
const PaymentCallback = lazy(() => import('./pages/PaymentCallback/PaymentCallback'));

// ---------------------

function App() {
  const location = useLocation();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const checkTokenExpiry = useCallback(() => {
    const user = getCurrentUser();
    // Chỉ check khi user đã đăng nhập (có data trong localStorage)
    if (user?.accessToken && isTokenExpired()) {
      setShowSessionExpired(true);
    }
  }, []);

  // Check token expiry khi route thay đổi
  useEffect(() => {
    checkTokenExpiry();
  }, [location.pathname, checkTokenExpiry]);

  // Check token expiry định kỳ mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(checkTokenExpiry, 30000);
    return () => clearInterval(interval);
  }, [checkTokenExpiry]);

  return (
    <div>
      <SessionExpiredModal
        isOpen={showSessionExpired}
        onClose={() => setShowSessionExpired(false)}
      />
      <ToastContainer position="top-right" autoClose={5000} style={{ zIndex: 99999 }} />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tutor-search" element={<TutorSearchPage />} />
          <Route path="/tutor-detail" element={<TutorDetailPage />} />
          <Route path="/tutor-detail/:id" element={<TutorDetailPage />} />

          {/* Admin Layout - PROTECTED */}
          <Route
            path="/admin-portal"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin-portal/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="vetting" element={<AdminVettingPage />} />
            {/* <Route path="disputes" element={<AdminDisputesPage />} /> */}
            {/* <Route path="disputes/:disputeId" element={<AdminDisputeDetailPageExpanded />} /> */}
            <Route path="financials" element={<AdminFinancialsPage />} />
            <Route path="warnings" element={<AdminWarningsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="payouts" element={<PayoutOverviewPage />} />
            <Route path="payouts/history" element={<AllPayoutRequestsPage />} />
            <Route path="payouts/:id" element={<PayoutDetailPage />} />
            <Route path="payout/review" element={<PendingReviewPage />} />
            <Route path="payout/review/:id" element={<div className="p-6">Payout Request Detail Page (Coming Soon)</div>} />
            <Route path="payout/fraud-logs" element={<FraudLogsPage />} />
          </Route>

          {/* Tutor Portal - PROTECTED */}
          <Route path="/tutor-portal" element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <TutorPortalLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/tutor-portal/dashboard" replace />} />
            <Route path="dashboard" element={<TutorPortalDashboard />} />
            <Route path="profile" element={<TutorPortalProfile />} />
            <Route path="schedule" element={<TutorPortalSchedule />} />
            <Route path="messages" element={<TutorPortalMessages />} />
            <Route path="classes" element={<TutorPortalClasses />} />
            <Route path="classes/:classId" element={<TutorPortalClassDetail />} />
            <Route path="students/:studentId" element={<TutorPortalStudentProfile />} />
            <Route path="bookings" element={<TutorPortalBookings />} />
            <Route path="finance" element={<TutorFinanceDashboardPage />} />
            <Route path="finance/transactions" element={<TransactionHistoryPage />} />
            <Route path="finance/bank-info" element={<BankInfoManagementPage />} />
            <Route path="finance/withdraw" element={<CreateWithdrawalPage />} />
            <Route path="finance/withdrawals" element={<WithdrawalListPage />} />
            <Route path="finance/withdrawals/:id" element={<WithdrawalDetailPage />} />
            <Route path="account" element={<TutorAccount />} />
          </Route>

          {/* Parent Layout - PROTECTED */}
          <Route
            path="/parent-portal"
            element={
              <ProtectedRoute allowedRoles={["Parent"]}>
                <ParentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/parent-portal/dashboard" replace />} />
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="booking" element={<ParentBooking />} />
            <Route path="booking/:id" element={<BookingDetail />} />
            <Route path="booking/:id/payment" element={<PaymentPage />} />
            <Route path="student" element={<ParentStudent />} />
            <Route path="wallet" element={<ParentWallet />} />
            <Route path="messages" element={<ParentMessage />} />
            <Route path="calendar" element={<ParentCalendar />} />
            <Route path="lessons" element={<ParentLessons />} />
            <Route path="lessons/:lessonId" element={<ParentLessonDetail />} />
            <Route path="account" element={<ParentAccount />} />
            {/* <Route path="disputes" element={<ParentDisputes />} /> */}
          </Route>

          {/* Student Layout - PROTECTED */}
          <Route
            path="/student-portal"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student-portal/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="booking" element={<StudentBooking />} />
            <Route path="booking/:id" element={<BookingDetail />} />
            <Route path="booking/:id/payment" element={<PaymentPage />} />
            <Route path="lessons" element={<StudentLessons />} />
            <Route path="lessons/:lessonId" element={<StudentLessonDetail />} />
            <Route path="calendar" element={<StudentCalendar />} />
            <Route path="messages" element={<ParentMessage />} />
            <Route path="link-account" element={<StudentLinkAccount />} />
            <Route path="account" element={<StudentAccount />} />
          </Route>

          {/* PayOS callback - loaded inside iframe after payment */}
          <Route path="/payment/success" element={<PaymentCallback />} />
          <Route path="/payment/cancel" element={<PaymentCallback />} />

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
      </Suspense>
    </div>
  );
}

export default App;
