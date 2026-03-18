import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Popconfirm } from 'antd';
import '../styles/layouts/tutor-portal-layout.css';
import { getUnreadCount } from '../services/notification.service';
import { signalRService } from '../services/signalr.service';
import NotificationDropdown from '../components/NotificationDropdown/NotificationDropdown';
import { getUserInfoFromToken, getUserProfile, clearUserFromStorage, getTourStatus, completeTour } from '../services/auth.service';
import { toast } from 'react-toastify';
import TutorTour, { type TourStep } from '../components/TutorTour/TutorTour';

// Logo Icon (TUTORA symbol)
const LogoIcon = () => (
    <img className="tutor-portal-logo-icon" src="/tutora-logo.png" alt="Tutora" width="36" height="36" />
);


// Notification Bell Icon
const NotificationIcon = () => (
    <svg className="tutor-portal-notification-icon" viewBox="0 0 18 20" fill="currentColor">
        <path d="M9 0C5.68629 0 3 2.68629 3 6V11L1 14V15H17V14L15 11V6C15 2.68629 12.3137 0 9 0Z" />
        <path d="M9 20C10.6569 20 12 18.6569 12 17H6C6 18.6569 7.34315 20 9 20Z" />
    </svg>
);

// Icons as SVG components for cleaner code - Updated to 17.5px to match Figma
const DashboardIcon = () => (
    <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <path d="M2 4C2 2.89543 2.89543 2 4 2H7C7.55228 2 8 2.44772 8 3V7C8 7.55228 7.55228 8 7 8H4C2.89543 8 2 7.10457 2 6V4Z" />
        <path d="M2 12C2 10.8954 2.89543 10 4 10H7C7.55228 10 8 10.4477 8 11V15C8 15.5523 7.55228 16 7 16H4C2.89543 16 2 15.1046 2 14V12Z" />
        <path d="M10 3C10 2.44772 10.4477 2 11 2H14C15.1046 2 16 2.89543 16 4V6C16 7.10457 15.1046 8 14 8H11C10.4477 8 10 7.55228 10 7V3Z" />
        <path d="M10 11C10 10.4477 10.4477 10 11 10H14C15.1046 10 16 10.8954 16 12V14C16 15.1046 15.1046 16 14 16H11C10.4477 16 10 15.5523 10 15V11Z" />
    </svg>
);

const ProfileIcon = () => (
    <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <path d="M9 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9 2C7.34315 2 6 3.34315 6 5C6 6.65685 7.34315 8 9 8Z" />
        <path d="M2 16C2 12.6863 5.13401 10 9 10C12.866 10 16 12.6863 16 16H2Z" />
    </svg>
);

const ScheduleIcon = () => (
    <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <path d="M5 1C4.44772 1 4 1.44772 4 2V3H3C1.89543 3 1 3.89543 1 5V15C1 16.1046 1.89543 17 3 17H15C16.1046 17 17 16.1046 17 15V5C17 3.89543 16.1046 3 15 3H14V2C14 1.44772 13.5523 1 13 1C12.4477 1 12 1.44772 12 2V3H6V2C6 1.44772 5.55228 1 5 1ZM3 7H15V15H3V7Z" />
    </svg>
);

const ClassIcon = () => (
    <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <path d="M9 2L1 6L9 10L17 6L9 2Z" />
        <path d="M1 12L9 16L17 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
);

// SessionsIcon removed — Sessions nav item no longer used
// const SessionsIcon = () => (
//     <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
//         <circle cx="9" cy="9" r="7" />
//         <path d="M9 5V9L12 11" strokeLinecap="round" />
//     </svg>
// );

const FinanceIcon = () => (
    <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="4" width="16" height="12" rx="2" strokeLinecap="round" />
        <path d="M1 8H17" strokeLinecap="round" />
        <path d="M12 12H14" strokeLinecap="round" />
        <path d="M4 4V3C4 2.44772 4.44772 2 5 2H13C13.5523 2 14 2.44772 14 3V4" strokeLinecap="round" />
    </svg>
);

// SettingsIcon removed — Settings nav item no longer used
// const SettingsIcon = () => (
//     <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
//         <circle cx="9" cy="9" r="2.5" />
//         <path d="M9 1V3M9 15V17M1 9H3M15 9H17M3.05 3.05L4.46 4.46M13.54 13.54L14.95 14.95M3.05 14.95L4.46 13.54M13.54 4.46L14.95 3.05" strokeLinecap="round" />
//     </svg>
// );

const MessagesIcon = () => (
    <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 4L9 9L17 4M1 14V4C1 2.89543 1.89543 2 3 2H15C16.1046 2 17 2.89543 17 4V14C17 15.1046 16.1046 16 15 16H3C1.89543 16 1 15.1046 1 14Z" strokeLinecap="round" />
    </svg>
);

// Hamburger Menu Icon for mobile
const MenuIcon = () => (
    <svg className="tutor-portal-menu-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 5H17M3 10H17M3 15H17" strokeLinecap="round" />
    </svg>
);

// Close Icon for mobile sidebar
const CloseIcon = () => (
    <svg className="tutor-portal-close-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
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

const BookingIcon = () => (
    <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 3V1M7 3V1M3 13V5C3 3.89543 3.89543 3 5 3H13C14.1046 3 15 3.89543 15 5V13C15 14.1046 14.1046 15 13 15H5C3.89543 15 3 14.1046 3 13Z" strokeLinecap="round" />
        <path d="M7 8L9 10L12 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 8H15" strokeLinecap="round" />
    </svg>
);

const AccountIcon = () => (
    <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="5.5" r="3" />
        <path d="M2.5 16.5C2.5 13.5 5.18629 11 9 11C12.8137 11 15.5 13.5 15.5 16.5" strokeLinecap="round" />
    </svg>
);

// Navigation items matching Figma design
const navItems = [
    { path: '/tutor-portal/dashboard', label: 'Tổng quan', icon: DashboardIcon },
    { path: '/tutor-portal/profile', label: 'Hồ sơ công khai', icon: ProfileIcon },
    { path: '/tutor-portal/messages', label: 'Tin nhắn', icon: MessagesIcon },
    { path: '/tutor-portal/bookings', label: 'Yêu cầu đặt lịch', icon: BookingIcon },
    { path: '/tutor-portal/schedule', label: 'Lịch dạy', icon: ScheduleIcon },
    { path: '/tutor-portal/classes', label: 'Quản lý lớp học', icon: ClassIcon },
    { path: '/tutor-portal/finance', label: 'Tài chính', icon: FinanceIcon },
    { path: '/tutor-portal/account', label: 'Tài khoản', icon: AccountIcon },
];

const TutorPortalLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showTour, setShowTour] = useState(false);
    const [showTourPrompt, setShowTourPrompt] = useState(false);

    // Dashboard tour steps
    const tourSteps: TourStep[] = [
        {
            target: '[data-tour="sidebar"]',
            title: '🎯 Chào mừng đến TUTORA!',
            description: 'Đây là Bảng điều khiển của bạn. Menu bên trái giúp bạn truy cập nhanh mọi chức năng quản lý gia sư.',
            placement: 'right',
        },
        {
            target: '[data-tour="nav-dashboard"]',
            title: '📊 Tổng quan',
            description: 'Xem tổng quan hoạt động: thống kê buổi học, đánh giá, doanh thu, và lịch dạy.',
            placement: 'right',
        },
        {
            target: '[data-tour="stats-grid"]',
            title: '📈 Thống kê nhanh',
            description: 'Các thẻ thống kê giúp bạn theo dõi số buổi học, đánh giá trung bình, số dư ví, và doanh thu.',
            placement: 'bottom',
        },
        {
            target: '[data-tour="quick-actions"]',
            title: '⚡ Thao tác nhanh',
            description: 'Điểm danh, thêm lịch rảnh, tạo lớp học, rút tiền — chỉ 1 click!',
            placement: 'bottom',
        },
        {
            target: '[data-tour="calendar-widget"]',
            title: '📅 Lịch mini',
            description: 'Xem nhanh những ngày có lớp (chấm xanh). Click vào ngày để xem chi tiết lịch dạy.',
            placement: 'left',
        },
        {
            target: '[data-tour="nav-profile"]',
            title: '🪪 Hồ sơ công khai',
            description: 'Chỉnh sửa hồ sơ hiển thị cho phụ huynh: ảnh đại diện, giới thiệu, bằng cấp, giá dạy, video giới thiệu.',
            placement: 'right',
        },
        {
            target: '[data-tour="nav-messages"]',
            title: '💌 Tin nhắn',
            description: 'Nhắn tin trực tiếp với phụ huynh và học sinh. Hỗ trợ gửi file đính kèm.',
            placement: 'right',
        },
        {
            target: '[data-tour="nav-bookings"]',
            title: '📥 Yêu cầu đặt lịch',
            description: 'Xem và phản hồi yêu cầu đặt lịch từ phụ huynh. Chấp nhận hoặc từ chối lịch học.',
            placement: 'right',
        },
        {
            target: '[data-tour="nav-schedule"]',
            title: '🗓️ Lịch dạy',
            description: 'Cài đặt lịch rảnh để phụ huynh có thể đặt lịch. Kéo thả trên lưới để tạo nhanh!',
            placement: 'right',
        },
        {
            target: '[data-tour="nav-classes"]',
            title: '🎓 Quản lý lớp học',
            description: 'Xem danh sách lớp, điểm danh học sinh, ghi nhận bài học, theo dõi tiến độ.',
            placement: 'right',
        },
        {
            target: '[data-tour="nav-finance"]',
            title: '💳 Tài chính',
            description: 'Xem thu nhập, lịch sử giao dịch, rút tiền về tài khoản ngân hàng của bạn.',
            placement: 'right',
        },
        {
            target: '[data-tour="nav-account"]',
            title: '👤 Tài khoản',
            description: 'Quản lý thông tin cá nhân, cập nhật hồ sơ và đổi mật khẩu tài khoản của bạn.',
            placement: 'right',
        },
        {
            target: '[data-tour="stats-grid"]',
            title: '🎉 Sẵn sàng rồi!',
            description: 'Chúc bạn có trải nghiệm làm gia sư thật tuyệt vời với TUTORA! Nếu cần hỗ trợ, đừng ngần ngại liên hệ đội ngũ của chúng tôi nhé. 💪',
            placement: 'bottom',
        },
    ];

    // Show tour prompt only on first visit to dashboard (check localStorage first, then API)
    useEffect(() => {
        if (location.pathname !== '/tutor-portal/dashboard') return;
        // Fast check: localStorage cache
        if (localStorage.getItem('tutorTourCompleted')) return;
        // Slower check: verify with backend API
        let cancelled = false;
        getTourStatus().then(completed => {
            if (cancelled) return;
            if (completed) {
                localStorage.setItem('tutorTourCompleted', 'true');
            } else {
                const timer = setTimeout(() => setShowTourPrompt(true), 800);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                cancelled = true; // prevent cleanup issues
                return () => clearTimeout(timer);
            }
        });
        return () => { cancelled = true; };
    }, [location.pathname]);

    const handleAcceptTour = () => {
        setShowTourPrompt(false);
        setShowTour(true);
    };

    const handleSkipTour = () => {
        setShowTourPrompt(false);
        localStorage.setItem('tutorTourCompleted', 'true');
        completeTour();
    };

    const handleReplayTour = () => {
        setSidebarOpen(false);
        setShowTour(true);
    };

    // Prefetch all tutor portal pages after initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            import('../pages/TutorPortal/TutorPortalProfile');
            import('../pages/TutorPortal/TutorPortalDashboard');
            import('../pages/TutorPortal/TutorPortalSchedule');
            import('../pages/TutorPortal/TutorPortalMessages');
            import('../pages/TutorPortal/TutorPortalClasses');
            import('../pages/TutorPortal/TutorPortalBookings');
            import('../pages/TutorFinance/TutorFinanceDashboard/TutorFinanceDashboardPage');
        }, 1500);
        return () => clearTimeout(timer);
    }, []);
    const [userData, setUserData] = useState({
        name: 'User',
        initials: 'U',
        role: 'TUTOR',
        avatar: 'https://ui-avatars.com/api/?name=User&background=3d4a3e&color=f2f0e4&size=128'
    });

    const isActive = (path: string) => {
        if (path === '/tutor-portal/finance') {
            return location.pathname.startsWith('/tutor-portal/finance');
        }
        return location.pathname === path;
    };

    // Helper function to generate avatar from name
    const generateAvatarFromName = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3d4a3e&color=f2f0e4&size=128`;
    };

    // Helper function to get initials from name
    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Load user data from auth service + fetch real avatar from profile API
    useEffect(() => {
        const user = getUserInfoFromToken();

        if (user) {
            const displayName = user.fullname ||
                (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) ||
                user.email?.split('@')[0] ||
                'User';
            const initials = getInitials(displayName);

            setUserData({
                name: displayName,
                initials: initials,
                role: user.role || 'TUTOR',
                avatar: generateAvatarFromName(displayName)
            });

            // Fetch real avatar from user profile API
            if (user.userId) {
                getUserProfile(user.userId).then((profile) => {
                    const avatar = profile?.content?.avatarUrl || profile?.content?.avatarurl;
                    if (avatar) {
                        setUserData(prev => ({ ...prev, avatar }));
                    }
                }).catch(() => { /* keep fallback avatar */ });
            }
        }
    }, []);

    // Fetch unread notification count on mount
    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                const count = await getUnreadCount();
                setNotificationCount(count);
            } catch (error) {
                console.error('Failed to fetch notification count:', error);
                // Keep count at 0 on error
            }
        };

        fetchNotificationCount();

        const handleNotificationCountUpdate = (count: number) => {
            setNotificationCount(count);
        };

        const handleNewNotification = (notification: any) => {
            const user = getUserInfoFromToken();
            const currentUserId = user?.userId || user?.sub;
            if (notification.userid && currentUserId && notification.userid !== currentUserId) {
                return;
            }
            setNotificationCount((prev: number) => prev + 1);
        };

        signalRService.onNotificationCountUpdated(handleNotificationCountUpdate);
        signalRService.onNotificationReceived(handleNewNotification);

        // Ensure notification hub is connected regardless of whether chat page has been visited
        signalRService.connect().catch(() => {/* handled internally */});

        return () => {
            signalRService.offNotificationCountUpdated();
            signalRService.offNotificationReceived();
        };
    }, []);

    const handleRefreshNotificationCount = async () => {
        try {
            const count = await getUnreadCount();
            setNotificationCount(count);
        } catch (error) {
            console.error('Failed to refresh notification count:', error);
        }
    };

    return (
        <div className="tutor-portal-layout">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="tutor-portal-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`tutor-portal-sidebar ${sidebarOpen ? 'open' : ''}`} data-tour="sidebar">
                {/* Logo Section */}
                <div className="tutor-portal-sidebar-logo">
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                        <LogoIcon />
                        <span className="tutor-portal-logo-text">TUTORA</span>
                    </Link>
                    {/* Mobile Close Button */}
                    <button
                        className="tutor-portal-sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="tutor-portal-sidebar-nav">
                    {navItems.map((item) => (
                        <div
                            key={item.path}
                            className={`tutor-portal-nav-item ${isActive(item.path) ? 'active' : ''}`}
                            title={item.label}
                            data-tour={`nav-${item.path.split('/').pop()}`}
                            onClick={() => {
                                navigate(item.path);
                                setSidebarOpen(false);
                            }}
                        >
                            <item.icon />
                            <span className="tutor-portal-nav-text">{item.label}</span>
                        </div>
                    ))}
                    {/* Replay Tour Button */}
                    <div
                        className="tutor-portal-nav-item"
                        title="Hướng dẫn sử dụng"
                        onClick={handleReplayTour}
                        style={{ marginTop: 8, opacity: 0.7 }}
                    >
                        <svg className="tutor-portal-nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="9" cy="9" r="7" />
                            <path d="M9 6v0.01M9 8.5v4" strokeLinecap="round" />
                        </svg>
                        <span className="tutor-portal-nav-text">Hướng dẫn</span>
                    </div>
                </nav>

                {/* User Profile Card at Bottom */}
                <div className="tutor-portal-sidebar-user">
                    <div className="tutor-portal-user-card">
                        <div className="tutor-portal-user-avatar">
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
                            <span className="tutor-portal-user-initials" style={{ display: 'none' }}>{userData.initials}</span>
                        </div>
                        <div className="tutor-portal-user-info">
                            <span className="tutor-portal-user-name">{userData.name}</span>
                            <span className="tutor-portal-user-role">{userData.role}</span>
                        </div>
                    </div>
                </div>

            </aside>

            {/* Main Content */}
            <main className="tutor-portal-main">
                {/* Header */}
                <header className="tutor-portal-header">
                    <div className="tutor-portal-header-container">
                        {/* Mobile Menu Button */}
                        <button
                            className="tutor-portal-menu-btn"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon />
                        </button>

                        {/* Spacer */}
                        <div style={{ flex: 1 }} />

                        {/* Right: User Info + Notifications + Avatar */}
                        <div className="tutor-portal-header-right">
                            {/* Notification Button */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    className="tutor-portal-notification-btn"
                                    data-tour="notification-btn"
                                    onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                                >
                                    <NotificationIcon />
                                    {notificationCount > 0 && (
                                        <div className="tutor-portal-notification-badge">
                                            <span className="tutor-portal-notification-count">{notificationCount}</span>
                                        </div>
                                    )}
                                </button>
                                <NotificationDropdown
                                    isOpen={showNotificationDropdown}
                                    onClose={() => setShowNotificationDropdown(false)}
                                    onCountUpdate={handleRefreshNotificationCount}
                                />
                            </div>

                            {/* User Info */}
                            <div className="tutor-portal-header-user">
                                <div className="tutor-portal-header-user-info">
                                    <span className="tutor-portal-header-user-name">{userData.name}</span>
                                    <span className="tutor-portal-header-user-role">{userData.role}</span>
                                </div>
                                <img
                                    className="tutor-portal-header-avatar"
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
                                    className="tutor-portal-header-logout-btn"
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

            {/* Tour Welcome Prompt */}
            {showTourPrompt && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 99998,
                    background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 20, padding: '40px 36px',
                        maxWidth: 420, width: '90%', textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
                        <h2 style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: 22, fontWeight: 700, color: '#1a2238',
                            margin: '0 0 12px',
                        }}>Chào mừng bạn đến TUTORA!</h2>
                        <p style={{
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: 15, color: 'rgba(62,47,40,0.7)',
                            lineHeight: 1.6, margin: '0 0 28px',
                        }}>
                            Hãy để TUTORA hướng dẫn bạn khám phá các tính năng để có trải nghiệm mượt mà nhất nhé!
                        </p>
                        <button
                            onClick={handleAcceptTour}
                            style={{
                                display: 'block', width: '100%', padding: '14px 20px',
                                border: 'none', borderRadius: 12, background: '#1a2238',
                                color: '#fff', fontSize: 15, fontWeight: 700,
                                cursor: 'pointer', marginBottom: 12,
                                fontFamily: "'IBM Plex Sans', sans-serif",
                            }}
                        >Bắt đầu khám phá ✨</button>
                        <button
                            onClick={handleSkipTour}
                            style={{
                                display: 'block', width: '100%', padding: '12px 20px',
                                border: 'none', borderRadius: 12, background: 'transparent',
                                color: 'rgba(62,47,40,0.5)', fontSize: 14, fontWeight: 500,
                                cursor: 'pointer',
                                fontFamily: "'IBM Plex Sans', sans-serif",
                            }}
                        >Bỏ qua</button>
                    </div>
                </div>
            )}

            {/* Tutor Onboarding Tour */}
            {showTour && (
                <TutorTour
                    steps={tourSteps}
                    onComplete={() => {
                        setShowTour(false);
                        setSidebarOpen(false);
                        localStorage.setItem('tutorTourCompleted', 'true');
                        completeTour(); // Persist to backend DB
                    }}
                    onSidebarOpen={() => setSidebarOpen(true)}
                    onSidebarClose={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default TutorPortalLayout;
