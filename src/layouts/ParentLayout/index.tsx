import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { getUnreadCount } from '../../services/notification.service';
import { signalRService } from '../../services/signalr.service';
import NotificationDropdown from '../../components/NotificationDropdown/NotificationDropdown';
import { getUserInfoFromToken } from '../../services/auth.service';
import { getStudents } from '../../services/student.service';
import { getNextLesson } from '../../services/lesson.service';
import type { StudentType } from '../../types/student.type';
import type { LessonResponse } from '../../services/lesson.service';

// Logo Icon (Agora symbol) - same as TutorPortalLayout
const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor">
    <path d="M14 2L2 8V20L14 26L26 20V8L14 2ZM14 4.5L22.5 9V19L14 23.5L5.5 19V9L14 4.5Z" />
    <path d="M14 8L8 11V17L14 20L20 17V11L14 8Z" />
  </svg>
);

// Search Icon
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="6" r="4.5" />
    <path d="M9.5 9.5L13 13" strokeLinecap="round" />
  </svg>
);

// Notification Bell Icon
const NotificationIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor">
    <path d="M9 0C5.68629 0 3 2.68629 3 6V11L1 14V15H17V14L15 11V6C15 2.68629 12.3137 0 9 0Z" />
    <path d="M9 20C10.6569 20 12 18.6569 12 17H6C6 18.6569 7.34315 20 9 20Z" />
  </svg>
);

// Clock Icon for next lesson
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="7" cy="7" r="5.5" />
    <path d="M7 4V7L9 8.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Dropdown Arrow
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Nav Icons
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M2 4C2 2.89543 2.89543 2 4 2H7C7.55228 2 8 2.44772 8 3V7C8 7.55228 7.55228 8 7 8H4C2.89543 8 2 7.10457 2 6V4Z" />
    <path d="M2 12C2 10.8954 2.89543 10 4 10H7C7.55228 10 8 10.4477 8 11V15C8 15.5523 7.55228 16 7 16H4C2.89543 16 2 15.1046 2 14V12Z" />
    <path d="M10 3C10 2.44772 10.4477 2 11 2H14C15.1046 2 16 2.89543 16 4V6C16 7.10457 15.1046 8 14 8H11C10.4477 8 10 7.55228 10 7V3Z" />
    <path d="M10 11C10 10.4477 10.4477 10 11 10H14C15.1046 10 16 10.8954 16 12V14C16 15.1046 15.1046 16 14 16H11C10.4477 16 10 15.5523 10 15V11Z" />
  </svg>
);

const ChildrenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M9 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9 2C7.34315 2 6 3.34315 6 5C6 6.65685 7.34315 8 9 8Z" />
    <path d="M2 16C2 12.6863 5.13401 10 9 10C12.866 10 16 12.6863 16 16H2Z" />
  </svg>
);

const MessagesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 4L9 9L17 4M1 14V4C1 2.89543 1.89543 2 3 2H15C16.1046 2 17 2.89543 17 4V14C17 15.1046 16.1046 16 15 16H3C1.89543 16 1 15.1046 1 14Z" strokeLinecap="round" />
  </svg>
);

const FinanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M2 4C2 2.89543 2.89543 2 4 2H14C15.1046 2 16 2.89543 16 4V14C16 15.1046 15.1046 16 14 16H4C2.89543 16 2 15.1046 2 14V4Z" />
    <path d="M9 5V13M6 8H12M6 10H12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BookingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 3V1M7 3V1M3 13V5C3 3.89543 3.89543 3 5 3H13C14.1046 3 15 3.89543 15 5V13C15 14.1046 14.1046 15 13 15H5C3.89543 15 3 14.1046 3 13Z" strokeLinecap="round" />
    <path d="M7 8L9 10L12 7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8H15" strokeLinecap="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="9" r="2.5" />
    <path d="M9 1V3M9 15V17M1 9H3M15 9H17M3.05 3.05L4.46 4.46M13.54 13.54L14.95 14.95M3.05 14.95L4.46 13.54M13.54 4.46L14.95 3.05" strokeLinecap="round" />
  </svg>
);

// Hamburger Menu Icon for mobile
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 5H17M3 10H17M3 15H17" strokeLinecap="round" />
  </svg>
);

// Close Icon for mobile sidebar
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round" />
  </svg>
);

// Navigation items matching Figma design
const navItems = [
  { path: '/parent/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/parent/student', label: 'Children', icon: ChildrenIcon },
  { path: '/parent/messages', label: 'Messages', icon: MessagesIcon },
  { path: '/parent/wallet', label: 'Finance', icon: FinanceIcon },
  { path: '/parent/booking', label: 'Booking', icon: BookingIcon },
  { path: '/parent/settings', label: 'Settings', icon: SettingsIcon },
];

interface ParentLayoutProps {
  children?: React.ReactNode;
}

const ParentLayout: React.FC<ParentLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [parentData, setParentData] = useState({
    name: 'User',
    initials: 'U',
    role: 'PARENT',
  });
  const [studentData, setStudentData] = useState({
    name: 'Student',
    grade: 'Grade 8 • Active',
    initials: 'S',
  });
  const [nextLesson, setNextLesson] = useState<LessonResponse | null>(null);

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Load user data from auth service
  useEffect(() => {
    const user = getUserInfoFromToken();

    console.log('🔍 ParentLayout - Loading user data from token:', user);

    if (user) {
      const displayName = user.fullname ||
        (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) ||
        user.email?.split('@')[0] ||
        'User';
      const initials = getInitials(displayName);

      console.log('✅ ParentLayout - Setting parent data:', { displayName, initials, role: user.role });

      setParentData({
        name: displayName,
        initials: initials,
        role: user.role || 'PARENT',
      });

      // Load students data
      loadStudentsAndLessons();
    } else {
      console.warn('⚠️ ParentLayout - No user data found in localStorage');
    }
  }, []);

  // Load students and next lesson from API
  const loadStudentsAndLessons = async () => {
    try {
      // Load students
      const studentsResponse = await getStudents();
      if (studentsResponse.content && studentsResponse.content.length > 0) {
        const firstStudent = studentsResponse.content[0];
        const studentName = firstStudent.fullName || 'Student';
        const studentGrade = firstStudent.gradeLevel || 'Grade 8';
        const studentInitials = getInitials(studentName);

        setStudentData({
          name: studentName,
          grade: `${studentGrade} • Active`,
          initials: studentInitials,
        });

        console.log('✅ ParentLayout - Student data loaded:', { studentName, studentGrade });
      }

      // Load next lesson
      const lesson = await getNextLesson();
      if (lesson) {
        setNextLesson(lesson);
        console.log('✅ ParentLayout - Next lesson loaded:', lesson);
      }
    } catch (error) {
      console.error('❌ ParentLayout - Error loading students/lessons:', error);
    }
  };

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Handle scroll lock when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

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

    // Setup SignalR listener for real-time notification updates
    const handleNotificationCountUpdate = (count: number) => {
      console.log('📬 Notification count updated via SignalR:', count);
      setNotificationCount(count);
    };

    signalRService.onNotificationCountUpdated(handleNotificationCountUpdate);

    // Cleanup
    return () => {
      signalRService.offNotificationCountUpdated();
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
    <div className={styles.layout}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content (Left) */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContainer}>
            {/* Mobile Menu Button */}
            <button
              className={styles.menuBtn}
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon />
            </button>

            {/* Left: Student Selector + Next Lesson */}
            <div className={styles.headerLeft}>
              {/* Student Selector */}
              <button className={styles.studentSelector}>
                <div className={styles.studentAvatar}>
                  <span>{studentData.initials}</span>
                </div>
                <div className={styles.studentInfo}>
                  <span className={styles.studentName}>{studentData.name}</span>
                  <span className={styles.studentGrade}>{studentData.grade}</span>
                </div>
                <div className={styles.dropdownArrow}>
                  <ChevronDown />
                </div>
              </button>

              {/* Next Lesson Indicator */}
              {nextLesson && (
                <div className={styles.nextLesson}>
                  <ClockIcon />
                  <span>
                    Next: {new Date(nextLesson.scheduledStart).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} {new Date(nextLesson.scheduledStart).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                  <span className={styles.nextLessonDot}>•</span>
                  <span>{nextLesson.subjectName || 'Lesson'} with {nextLesson.tutorName || 'Tutor'}</span>
                </div>
              )}
            </div>

            {/* Center: Search Bar */}
            <div className={styles.headerSearch}>
              <SearchIcon />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search classes, students, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Right: Notifications + User */}
            <div className={styles.headerRight}>
              {/* Notification Button */}
              <div style={{ position: 'relative' }}>
                <button
                  className={styles.notificationBtn}
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                >
                  <div className={styles.notificationIconWrap}>
                    <NotificationIcon />
                  </div>
                  {notificationCount > 0 && (
                    <div className={styles.notificationBadge}>
                      <span>{notificationCount}</span>
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
              <div className={styles.headerUser}>
                <span className={styles.headerUserName}>{parentData.name}</span>
                <div className={styles.headerAvatar}>
                  <span>{parentData.initials}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.contentArea}>
          {children || <Outlet />}
        </div>
      </main>

      {/* Sidebar (Right) */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        {/* Logo Section */}
        <div className={styles.sidebarLogo}>
          <Link to="/" className={styles.logoLink}>
            <LogoIcon />
            <span className={styles.logoText}>AGORA</span>
          </Link>
          {/* Mobile Close Button */}
          <button
            className={styles.sidebarClose}
            onClick={() => setSidebarOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <item.icon />
              <span className={styles.navText}>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* User Profile Card at Bottom */}
        <div className={styles.sidebarUser}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              <span>{parentData.initials}</span>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{parentData.name}</span>
              <span className={styles.userRole}>{parentData.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ParentLayout;
