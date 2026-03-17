import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Popconfirm } from 'antd';
import '../styles/layouts/admin-layout.css';
import { getUserInfoFromToken, getUserProfile, clearUserFromStorage } from '../services/auth.service';
import { getPendingTutors } from '../services/admin.service';
import { toast } from 'react-toastify';

// Logo Icon
const LogoIcon = () => (
    <img className="admin-portal-logo-icon" src="/tutora-logo.png" alt="Tutora" width="36" height="36" />
);

// Notification Bell Icon
const NotificationIcon = () => (
    <svg className="admin-portal-notification-icon" viewBox="0 0 18 20" fill="currentColor">
        <path d="M9 0C5.68629 0 3 2.68629 3 6V11L1 14V15H17V14L15 11V6C15 2.68629 12.3137 0 9 0Z" />
        <path d="M9 20C10.6569 20 12 18.6569 12 17H6C6 18.6569 7.34315 20 9 20Z" />
    </svg>
);

// Hamburger Menu Icon for mobile
const MenuIcon = () => (
    <svg className="admin-portal-menu-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 5H17M3 10H17M3 15H17" strokeLinecap="round" />
    </svg>
);

// Close Icon for mobile sidebar
const CloseIcon = () => (
    <svg className="admin-portal-close-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round" />
    </svg>
);

// Logout Icon
const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 16H3C2.44772 16 2 15.5523 2 15V3C2 2.44772 2.44772 2 3 2H6" strokeLinecap="round" />
        <path d="M12 12L16 9L12 6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 9H7" strokeLinecap="round" />
    </svg>
);

// Navigation items for admin portal
const navItems = [
    { path: '/admin-portal/dashboard', label: 'Bảng điều khiển', icon: 'dashboard' },
    { path: '/admin-portal/users', label: 'Quản lý người dùng', icon: 'group' },
    { path: '/admin-portal/vetting', label: 'Kiểm duyệt', icon: 'description', hasBadge: true },
    { path: '/admin-portal/warnings', label: 'Cảnh báo', icon: 'warning' },
    { path: '/admin-portal/financials', label: 'Tài chính', icon: 'account_balance' },
    { path: '/admin-portal/payouts', label: 'Payout', icon: 'monitoring' },
    { path: '/admin-portal/settings', label: 'Cài đặt', icon: 'settings' },
];

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [userData, setUserData] = useState({
        name: 'Admin',
        initials: 'AD',
        role: 'ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=3d4a3e&color=f2f0e4&size=128'
    });

    // Fetch pending tutors count
    useEffect(() => {
        getPendingTutors(1, 100).then((res) => {
            setPendingCount(res?.content?.length || 0);
        }).catch(() => { /* ignore */ });
    }, []);

    const isActive = (path: string) => {
        if (path === '/admin-portal/payouts') {
            return location.pathname.startsWith('/admin-portal/payout');
        }
        if (path === '/admin-portal/warnings') {
            return location.pathname.startsWith('/admin-portal/warnings');
        }
        return location.pathname === path;
    };

    const generateAvatarFromName = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3d4a3e&color=f2f0e4&size=128`;
    };

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Load user data
    useEffect(() => {
        const user = getUserInfoFromToken();
        if (user) {
            const displayName = user.fullname ||
                (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) ||
                user.email?.split('@')[0] ||
                'Admin';
            const initials = getInitials(displayName);

            setUserData({
                name: displayName,
                initials,
                role: user.role || 'ADMIN',
                avatar: generateAvatarFromName(displayName)
            });

            if (user.userId) {
                getUserProfile(user.userId).then((profile) => {
                    const avatar = profile?.content?.avatarUrl || profile?.content?.avatarurl;
                    if (avatar) {
                        setUserData(prev => ({ ...prev, avatar }));
                    }
                }).catch(() => { /* keep fallback */ });
            }
        }
    }, []);

    return (
        <div className="admin-portal-layout">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="admin-portal-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Logo Section */}
                <div className="admin-portal-sidebar-logo">
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                        <LogoIcon />
                        <span className="admin-portal-logo-text">TUTORA</span>
                    </Link>
                    {/* Mobile Close Button */}
                    <button
                        className="admin-portal-sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="admin-portal-sidebar-nav">
                    {navItems.map((item) => (
                        <div
                            key={item.path}
                            className={`admin-portal-nav-item ${isActive(item.path) ? 'active' : ''}`}
                            title={item.label}
                            onClick={() => {
                                navigate(item.path);
                                setSidebarOpen(false);
                            }}
                        >
                            <span className="material-symbols-outlined admin-portal-nav-icon-material">{item.icon}</span>
                            <span className="admin-portal-nav-text">{item.label}</span>
                            {item.hasBadge && pendingCount > 0 && (
                                <span className="admin-portal-nav-badge">{pendingCount}</span>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User Profile Card at Bottom */}
                <div className="admin-portal-sidebar-user">
                    <div className="admin-portal-user-card">
                        <div className="admin-portal-user-avatar">
                            <img
                                src={userData.avatar}
                                alt={userData.name}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const span = e.currentTarget.parentElement?.querySelector('span');
                                    if (span) (span as HTMLElement).style.display = 'flex';
                                }}
                            />
                            <span className="admin-portal-user-initials" style={{ display: 'none' }}>{userData.initials}</span>
                        </div>
                        <div className="admin-portal-user-info">
                            <span className="admin-portal-user-name">{userData.name}</span>
                            <span className="admin-portal-user-role">{userData.role}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-portal-main">
                {/* Header */}
                <header className="admin-portal-header">
                    <div className="admin-portal-header-container">
                        {/* Mobile Menu Button */}
                        <button
                            className="admin-portal-menu-btn"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon />
                        </button>

                        {/* Spacer */}
                        <div style={{ flex: 1 }} />

                        {/* Right: Notifications + User Info + Logout */}
                        <div className="admin-portal-header-right">
                            {/* Notification Button */}
                            <button className="admin-portal-notification-btn">
                                <NotificationIcon />
                            </button>

                            {/* User Info */}
                            <div className="admin-portal-header-user">
                                <div className="admin-portal-header-user-info">
                                    <span className="admin-portal-header-user-name">{userData.name}</span>
                                    <span className="admin-portal-header-user-role">{userData.role}</span>
                                </div>
                                <img
                                    className="admin-portal-header-avatar"
                                    src={userData.avatar}
                                    alt="User avatar"
                                />
                            </div>

                            {/* Logout Button */}
                            <Popconfirm
                                title="Đăng xuất"
                                description="Bạn có chắc muốn đăng xuất không?"
                                onConfirm={() => {
                                    clearUserFromStorage();
                                    toast.success('Đăng xuất thành công!');
                                    navigate('/login');
                                }}
                                okText="Đăng xuất"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                            >
                                <button
                                    className="admin-portal-header-logout-btn"
                                    title="Đăng xuất"
                                >
                                    <LogoutIcon />
                                </button>
                            </Popconfirm>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
