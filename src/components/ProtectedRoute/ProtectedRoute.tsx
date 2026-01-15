import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasAnyRole } from '../../services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // Nếu không truyền = cho phép tất cả user đã login
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
}) => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated()) {
        // Redirect đến trang 401 Unauthorized
        return <Navigate to="/401" replace />;
    }

    // Kiểm tra role (nếu được chỉ định)
    if (allowedRoles && allowedRoles.length > 0) {
        if (!hasAnyRole(allowedRoles)) {
            // User không có quyền → redirect đến trang 403 Forbidden
            return <Navigate to="/403" replace />;
        }
    }

    // Cho phép truy cập
    return <>{children}</>;
};

export default ProtectedRoute;
