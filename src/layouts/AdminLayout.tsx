import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';
import '../styles/layouts/admin-layout.css';

const AdminLayout: React.FC = () => {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-wrapper">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
