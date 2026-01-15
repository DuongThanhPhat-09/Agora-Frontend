import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasAnyRole } from '../services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // Nếu không truyền = cho phép tất cả user đã login
    redirectTo?: string; // Trang redirect khi không đủ quyền
}

/**
 * Component bảo vệ route dựa trên authentication và role
 * 
 * @example
 * // Bảo vệ route chỉ cho user đã login
 * <ProtectedRoute>
 *   <ProfilePage />
 * </ProtectedRoute>
 * 
 * @example
 * // Bảo vệ route chỉ cho Admin
 * <ProtectedRoute allowedRoles={["Admin"]}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Bảo vệ route cho nhiều role
 * <ProtectedRoute allowedRoles={["Admin", "Tutor"]}>
 *   <TutorManagement />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = "/login"
}) => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated()) {
        return <Navigate to={redirectTo} replace />;
    }

    // Kiểm tra role (nếu được chỉ định)
    if (allowedRoles && allowedRoles.length > 0) {
        if (!hasAnyRole(allowedRoles)) {
            // User không có quyền → redirect về trang chủ
            return <Navigate to="/" replace />;
        }
    }

    // Cho phép truy cập
    return <>{children}</>;
};

export default ProtectedRoute;
