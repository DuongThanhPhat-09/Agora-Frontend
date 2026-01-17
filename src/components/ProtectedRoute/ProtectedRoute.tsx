<<<<<<< HEAD
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../services/auth.service";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    allowedRoles,
    children,
}) => {
    const user = getCurrentUser();

    if (!user || !user.accessToken) {
        // Chưa đăng nhập -> Chuyển hướng về login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        // Kiểm tra Role (Giả sử user object có trường 'role' hoặc 'roles')
        // Cần đảm bảo cấu trúc user object khớp với auth.service
        const userRole = user.role; // Hoặc user.roles tùy backend

        if (!allowedRoles.includes(userRole)) {
            // Đã đăng nhập nhưng không có quyền -> 403
=======
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
>>>>>>> e8acb344551b5d2048e3d9225a8f07810184fa45
            return <Navigate to="/403" replace />;
        }
    }

<<<<<<< HEAD
    return children ? <>{children}</> : <Outlet />;
=======
    // Cho phép truy cập
    return <>{children}</>;
>>>>>>> e8acb344551b5d2048e3d9225a8f07810184fa45
};

export default ProtectedRoute;
