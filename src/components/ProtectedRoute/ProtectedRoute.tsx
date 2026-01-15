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
            return <Navigate to="/403" replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
