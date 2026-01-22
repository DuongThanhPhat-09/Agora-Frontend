import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/layouts/tutor-portal-layout.css';

// Back Arrow Icon
const BackIcon = () => (
    <svg className="tutor-portal-header-back-icon" viewBox="0 0 25 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 10H5M5 10L12 17M5 10L12 3" />
    </svg>
);

// Notification Bell Icon
const NotificationIcon = () => (
    <svg className="tutor-portal-notification-icon" viewBox="0 0 16 21" fill="currentColor">
        <path d="M8 0C4.68629 0 2 2.68629 2 6V11L0 14V15H16V14L14 11V6C14 2.68629 11.3137 0 8 0Z" />
        <path d="M8 21C9.65685 21 11 19.6569 11 18H5C5 19.6569 6.34315 21 8 21Z" />
    </svg>
);

// Icons as SVG components for cleaner code
const DashboardIcon = () => (
    <svg className="tutor-portal-nav-icon" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M2 3C2 2.44772 2.44772 2 3 2H5C5.55228 2 6 2.44772 6 3V5C6 5.55228 5.55228 6 5 6H3C2.44772 6 2 5.55228 2 5V3Z" />
        <path d="M2 9C2 8.44772 2.44772 8 3 8H5C5.55228 8 6 8.44772 6 9V11C6 11.5523 5.55228 12 5 12H3C2.44772 12 2 11.5523 2 11V9Z" />
        <path d="M8 3C8 2.44772 8.44772 2 9 2H11C11.5523 2 12 2.44772 12 3V5C12 5.55228 11.5523 6 11 6H9C8.44772 6 8 5.55228 8 5V3Z" />
        <path d="M9 8C8.44772 8 8 8.44772 8 9V11C8 11.5523 8.44772 12 9 12H11C11.5523 12 12 11.5523 12 11V9C12 8.44772 11.5523 8 11 8H9Z" />
    </svg>
);

const ProfileIcon = () => (
    <svg className="tutor-portal-nav-icon" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M7 6C8.10457 6 9 5.10457 9 4C9 2.89543 8.10457 2 7 2C5.89543 2 5 2.89543 5 4C5 5.10457 5.89543 6 7 6Z" />
        <path d="M2 12C2 9.79086 4.23858 8 7 8C9.76142 8 12 9.79086 12 12H2Z" />
    </svg>
);

const ScheduleIcon = () => (
    <svg className="tutor-portal-nav-icon" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M4 1C3.44772 1 3 1.44772 3 2V2.5H2.5C1.67157 2.5 1 3.17157 1 4V11.5C1 12.3284 1.67157 13 2.5 13H11.5C12.3284 13 13 12.3284 13 11.5V4C13 3.17157 12.3284 2.5 11.5 2.5H11V2C11 1.44772 10.5523 1 10 1C9.44772 1 9 1.44772 9 2V2.5H5V2C5 1.44772 4.55228 1 4 1Z" />
    </svg>
);

const ClassIcon = () => (
    <svg className="tutor-portal-nav-icon" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M7 2L1 5L7 8L13 5L7 2Z" />
        <path d="M1 9L7 12L13 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
);

const SessionsIcon = () => (
    <svg className="tutor-portal-nav-icon" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1ZM7 4V7L9 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
);

const FinanceIcon = () => (
    <svg className="tutor-portal-nav-icon" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M2 3C2 2.44772 2.44772 2 3 2H11C11.5523 2 12 2.44772 12 3V11C12 11.5523 11.5523 12 11 12H3C2.44772 12 2 11.5523 2 11V3Z" />
        <path d="M7 4V10M5 6H9M5 8H9" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="tutor-portal-nav-icon" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z" />
        <path d="M11.4 8.4L12.6 8.8C12.8 9 13 9.2 13 9.6V10.4C13 10.8 12.8 11 12.6 11.2L11.4 11.6C11.2 12 11 12.4 10.8 12.6L11 13.8C11 14 10.8 14.2 10.6 14.4L9.8 14.8C9.6 14.8 9.4 14.8 9.2 14.6L8.2 13.6C8 13.6 7.6 13.6 7.4 13.6C7 13.6 6.6 13.6 6.4 13.6L5.4 14.6C5.2 14.8 5 14.8 4.8 14.8L4 14.4C3.8 14.2 3.6 14 3.6 13.8L3.8 12.6C3.6 12.4 3.4 12 3.2 11.6L2 11.2C1.8 11 1.6 10.8 1.6 10.4V9.6C1.6 9.2 1.8 9 2 8.8L3.2 8.4C3.4 8 3.6 7.6 3.8 7.4L3.6 6.2C3.6 6 3.8 5.8 4 5.6L4.8 5.2C5 5.2 5.2 5.2 5.4 5.4L6.4 6.4C6.6 6.4 7 6.4 7.2 6.4C7.6 6.4 8 6.4 8.2 6.4L9.2 5.4C9.4 5.2 9.6 5.2 9.8 5.2L10.6 5.6C10.8 5.8 11 6 11 6.2L10.8 7.4C11 7.6 11.2 8 11.4 8.4Z" />
    </svg>
);

// Navigation items matching Figma design
const navItems = [
    { path: '/tutor-portal/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/tutor-portal/profile', label: 'Public Profile', icon: ProfileIcon },
    { path: '/tutor-portal/schedule', label: 'Teaching Schedule', icon: ScheduleIcon },
    { path: '/tutor-portal/classes', label: 'Class Management', icon: ClassIcon },
    { path: '/tutor-portal/sessions', label: 'Sessions', icon: SessionsIcon },
    { path: '/tutor-portal/finance', label: 'Finance', icon: FinanceIcon },
    { path: '/tutor-portal/settings', label: 'Settings', icon: SettingsIcon },
];

const TutorPortalLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notificationCount] = useState(3);

    const isActive = (path: string) => location.pathname === path;

    // Placeholder avatar - replace with actual user data
    const userAvatar = 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=e5e5e5&color=000&size=128';

    return (
        <div className="tutor-portal-layout">
            {/* Sidebar */}
            <aside className="tutor-portal-sidebar">
                <nav className="tutor-portal-sidebar-nav">
                    {navItems.map((item) => (
                        <div
                            key={item.path}
                            className={`tutor-portal-nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <item.icon />
                            <span className="tutor-portal-nav-text">{item.label}</span>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="tutor-portal-main">
                {/* Header */}
                <header className="tutor-portal-header">
                    <div className="tutor-portal-header-container">
                        {/* Left: Back + Title */}
                        <div className="tutor-portal-header-left">
                            <div onClick={() => navigate(-1)}>
                                <BackIcon />
                            </div>
                            <h1 className="tutor-portal-header-title">Tutor Portal</h1>
                        </div>

                        {/* Right: Notifications + Avatar */}
                        <div className="tutor-portal-header-right">
                            <button className="tutor-portal-notification-btn">
                                <NotificationIcon />
                                {notificationCount > 0 && (
                                    <div className="tutor-portal-notification-badge">
                                        <span className="tutor-portal-notification-count">{notificationCount}</span>
                                    </div>
                                )}
                            </button>
                            <img
                                className="tutor-portal-header-avatar"
                                src={userAvatar}
                                alt="User avatar"
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <Outlet />
            </main>
        </div>
    );
};

export default TutorPortalLayout;
