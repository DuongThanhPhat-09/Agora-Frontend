import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { Gauge, LayoutDashboard, MessageSquare, User, Wallet } from 'lucide-react';

interface ParentLayoutProps {
  children?: React.ReactNode;
}

// Navigation items
const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/parent/dashboard' },
  { id: 'student', label: 'Student', path: '/parent/student' },
  { id: 'booking', label: 'Booking', path: '/parent/booking' },
  { id: 'monitoring', label: 'Monitoring', path: '/parent/monitoring' },
  { id: 'wallet', label: 'Wallet', path: '/parent/wallet' },
  { id: 'messages', label: 'Messages', path: '/parent/messages' },
];

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 3C11.6569 3 13 4.34315 13 6C13 7.65685 11.6569 9 10 9C8.34315 9 7 7.65685 7 6C7 4.34315 8.34315 3 10 3Z"
      fill="#525252"
    />
    <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z" fill="#525252" />
  </svg>
);

// Header icons
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
      stroke="#525252"
      strokeWidth="1.5"
    />
    <path d="M9 9L13 13" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NotificationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2.5C10.8284 2.5 11.5 3.17157 11.5 4V4.94513C13.3699 5.40714 14.8429 6.95306 15.4602 8.95492C15.7125 9.79475 15.877 10.6705 15.9465 11.5644C16.2783 15.7583 13.0836 19.5 8.49999 19.5H8.5C3.91635 19.5 0.721676 15.7583 1.05345 11.5644C1.12297 10.6705 1.2875 9.79475 1.53983 8.95492C2.15712 6.95306 3.63009 5.40714 5.5 4.94513V4C5.5 3.17157 6.17157 2.5 7 2.5H10Z"
      fill="#171717"
    />
  </svg>
);

const SettingsHeaderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 1C7.55228 1 8 1.44772 8 2V4C8 4.55228 7.55228 5 7 5C6.44772 5 6 4.55228 6 4V2C6 1.44772 6 44772 1 7 1ZM1 7H2C2.55228 7 3 7.44772 3 8C3 8.55228 2.55228 9 2 9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7ZM7 9C7.55228 9 8 8.44772 8 9V12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12V9C6 8.44772 6 44772 8 7 8ZM11 7H12C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9H11C10.4477 9 10 8.55228 10 8.44772 10.4477 7 11 7Z"
      fill="#171717"
    />
  </svg>
);

const ProfileHeaderIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="12" r="6" fill="#d4d4d4" />
    <path d="M6 30C6 24.4772 10.4772 20 16 20H20C25.5228 20 30 24.4772 30 30H6Z" fill="#d4d4d4" />
  </svg>
);

// Mobile menu toggle icon
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6H21C21.5523 6 5.44772 6 5C21.5523 6 5 5.44772 6 5C21.5523 6 6 4.44772 6 6V6H17C17.5523 6 6 4.44772 6 6V18H3Z"
      fill="#171717"
    />
    <path
      d="M3 12H21C21.5523 12 11.44772 12 5C21.5523 12 5 5.44772 12 5C21.5523 12 5 5.44772 12 5V18H3Z"
      fill="#171717"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5L19 5L5 19H5" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 5L5 19L19 5H19" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ParentLayout: React.FC<ParentLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNavClick = (path: string) => {
    navigate(path);
    // Close sidebar on mobile when clicking nav link
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Handle scroll lock
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className={styles.studentLayout}>
      {/* Mobile Menu Toggle Button */}
      <button
        className={styles.mobileMenuToggle}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${isSidebarOpen ? '' : styles.hidden}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        {/* Sidebar Header - Logo */}
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>TutorPortal</h1>
        </div>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            let IconComponent;
            switch (item.id) {
              case 'dashboard':
                IconComponent = <LayoutDashboard />;
                break;
              case 'student':
                IconComponent = <User />;
                break;
              case 'booking':
                IconComponent = <User />;
                break;
              case 'monitoring':
                IconComponent = <Gauge />;
                break;
              case 'wallet':
                IconComponent = <Wallet />;
                break;
              case 'messages':
                IconComponent = <MessageSquare />;
                break;
              default:
                IconComponent = undefined;
            }

            return (
              <div
                key={item.id}
                className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
                onClick={() => handleNavClick(item.path)}
                data-node-id={`nav-${item.id}`}
              >
                <div className={styles.iconWrapper}>{IconComponent}</div>
                <div className={styles.textWrapper}>
                  <p className={styles.text}>{item.label}</p>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer - Settings */}
        <div className={styles.sidebarFooter}>
          <div
            className={styles.settingsLink}
            onClick={() => handleNavClick('/student/settings')}
            data-node-id="nav-settings"
          >
            <div className={styles.iconWrapper}>
              <SettingsIcon />
            </div>
            <div className={styles.textWrapper}>
              <p className={styles.text}>Settings</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Header - Top Bar */}
        <header className={styles.header} data-node-id="header">
          <div className={styles.container}>
            {/* Left: Search Bar */}
            <div className={styles.leftContainer}>
              {/* Search Bar */}
              <div className={styles.searchBar}>
                <div className={styles.background}>
                  <div className={styles.searchIcon}>
                    <SearchIcon />
                  </div>
                  <div className={styles.searchText}>
                    <input type="text" placeholder="Search..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Notification, Settings, Profile */}
            <div className={styles.headerActions}>
              {/* Notification Button */}
              <div className={styles.headerActionButton} data-node-id="notification-btn">
                <div className={styles.notificationButton}>
                  <NotificationIcon />
                </div>
              </div>

              {/* Settings Button */}
              <div className={styles.buttonMargin}>
                <div className={styles.headerActionButton} data-node-id="settings-btn">
                  <div className={styles.settingsButton}>
                    <SettingsHeaderIcon />
                  </div>
                </div>
              </div>

              {/* Profile Button */}
              <div className={styles.profileButtonWrapper}>
                <div className={styles.profileButton}>
                  <ProfileHeaderIcon />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Children will be rendered here */}
        <div className={styles.contentArea}>{children || <Outlet />}</div>
      </div>
    </div>
  );
};

export default ParentLayout;
