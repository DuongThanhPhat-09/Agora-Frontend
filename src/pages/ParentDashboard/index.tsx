import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfoFromToken } from '../../services/auth.service';
import { getPendingLessons, type PendingLessonDto } from '../../services/parent-lesson.service';
import { useStudentContext } from '../../contexts/StudentContext';
import { getWalletBalance, type WalletBalanceResponse } from '../../services/wallet.service';
import { getParentBookings } from '../../services/booking.service';
import { toast } from 'react-toastify';
import styles from './styles.module.css';

// Icon components for stats cards
const AttendanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" />
    <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GradeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M4 17V3h12v14l-6-3-6 3z" strokeLinejoin="round" />
    <path d="M8 8h4M8 11h2" strokeLinecap="round" />
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <rect x="2" y="4" width="16" height="13" rx="2" />
    <path d="M2 8h16" />
    <circle cx="14" cy="12" r="1" fill="#1a2238" />
  </svg>
);

const SessionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <circle cx="10" cy="10" r="8" />
    <path d="M10 6v4l3 2" strokeLinecap="round" />
  </svg>
);

// Quick action icons
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M2 5l8 5 8-5M2 15V5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" strokeLinecap="round" />
  </svg>
);

const ChildrenActionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" strokeLinecap="round" />
  </svg>
);

const FinanceActionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <rect x="2" y="4" width="16" height="13" rx="2" />
    <path d="M10 8v5M7.5 10.5h5" strokeLinecap="round" />
  </svg>
);

// Lesson icon
const LessonDefaultIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M4 17V3h12v14l-6-3-6 3z" strokeLinejoin="round" />
  </svg>
);

// Warning icon for Needs Attention
const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 1L1 16h16L9 1z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
    <path d="M9 7v4M9 13v1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Check icon for no attention needed
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8" fill="#22c55e" />
    <path d="M6 9l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper to format lesson time
const formatLessonTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  if (date.toDateString() === now.toDateString()) {
    return `Hôm nay, ${timeStr}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Ngày mai, ${timeStr}`;
  } else {
    return `${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}, ${timeStr}`;
  }
};

// Helper to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending_parent_confirmation':
      return { label: 'Chờ xác nhận', className: styles.badgeOrange };
    case 'scheduled':
      return { label: 'Đã lên lịch', className: styles.badgeBlue };
    case 'in_progress':
      return { label: 'Đang học', className: styles.badgeGreen };
    case 'completed':
      return { label: 'Hoàn thành', className: styles.badgeGreen };
    case 'pending_report':
      return { label: 'Chờ báo cáo', className: styles.badgeOrange };
    default:
      return { label: status, className: styles.badgeBlue };
  }
};

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { selectedStudent } = useStudentContext();
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState('');
  const [allPendingLessons, setAllPendingLessons] = useState<PendingLessonDto[]>([]);
  const [walletData, setWalletData] = useState<WalletBalanceResponse | null>(null);
  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [selectedStudent]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get parent name from token
      const user = getUserInfoFromToken();
      if (user) {
        const displayName = user.fullname ||
          (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) ||
          user.email?.split('@')[0] || 'Phụ huynh';
        setParentName(displayName);
      }

      // Parallel API calls
      const [pendingRes, walletRes, bookingsRes] = await Promise.allSettled([
        getPendingLessons(),
        getWalletBalance(),
        getParentBookings({ page: 1, pageSize: 100 }),
      ]);

      // Pending lessons (store all)
      if (pendingRes.status === 'fulfilled' && pendingRes.value?.content) {
        setAllPendingLessons(pendingRes.value.content);
      }

      // Wallet
      if (walletRes.status === 'fulfilled' && walletRes.value?.content) {
        setWalletData(walletRes.value.content);
      }

      // Bookings (store all)
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.content) {
        const bookings = bookingsRes.value.content;
        const bookingList = Array.isArray(bookings) ? bookings : (bookings as any).items || (bookings as any).content || [];
        setAllBookings(bookingList);
      }

    } catch (err) {
      console.error('Error loading dashboard:', err);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Filter by selected student
  const pendingLessons = selectedStudent
    ? allPendingLessons.filter(l => l.studentName === selectedStudent.fullName)
    : allPendingLessons;

  const filteredBookings = selectedStudent
    ? allBookings.filter((b: any) => b.student?.studentId === selectedStudent.studentId)
    : allBookings;

  // Derive stats from filtered data
  const pendingCount = pendingLessons.length;
  const totalBookings = filteredBookings.length;
  const completedBookings = filteredBookings.filter((b: any) =>
    b.status === 'completed' || b.status === 'fully_paid'
  ).length;
  const walletBalance = walletData?.balance ?? 0;
  const hasPendingConfirmation = pendingLessons.some(l => l.status === 'pending_parent_confirmation');

  // Get current week range
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const weekRange = `${startOfWeek.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${endOfWeek.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className={styles.spinner} />
            <p style={{ marginTop: '16px', color: 'rgba(62,47,40,0.5)' }}>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Welcome Banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>Chào mừng trở lại, {parentName}</h1>
            <p className={styles.welcomeSubtitle}>
              {selectedStudent ? `Đây là tình hình của ${selectedStudent.fullName} trong tuần này` : 'Tổng quan hoạt động học tập'}
            </p>
            <span className={styles.welcomeDate}>{weekRange}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {/* Bookings */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIconWrap}>
                <AttendanceIcon />
              </div>
              <span className={`${styles.statBadge} ${totalBookings > 0 ? styles.badgeGreen : styles.badgeBlue}`}>
                {totalBookings > 0 ? `${completedBookings}/${totalBookings}` : '---'}
              </span>
            </div>
            <div className={styles.statValue}>{totalBookings}</div>
            <div className={styles.statLabel}>Đặt lịch</div>
            <div className={styles.statSubtitle}>Tổng bookings</div>
          </div>

          {/* Pending Lessons */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIconWrap}>
                <GradeIcon />
              </div>
              <span className={`${styles.statBadge} ${pendingCount > 0 ? styles.badgeOrange : styles.badgeGreen}`}>
                {pendingCount > 0 ? 'Cần xử lý' : 'OK'}
              </span>
            </div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Chờ xác nhận</div>
            <div className={styles.statSubtitle}>Buổi học cần xác nhận</div>
          </div>

          {/* Wallet Balance */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIconWrap}>
                <WalletIcon />
              </div>
              <span className={`${styles.statBadge} ${walletBalance > 0 ? styles.badgeGreen : styles.badgeOrange}`}>
                {walletBalance > 0 ? 'Có tiền' : 'Hết tiền'}
              </span>
            </div>
            <div className={styles.statValue}>{formatCurrency(walletBalance)}</div>
            <div className={styles.statLabel}>Số dư ví</div>
            <div className={styles.statSubtitle}>
              {walletData?.frozenBalance ? `Đang giữ: ${formatCurrency(walletData.frozenBalance)}` : 'Khả dụng'}
            </div>
          </div>

          {/* Sessions */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIconWrap}>
                <SessionsIcon />
              </div>
              <span className={`${styles.statBadge} ${pendingCount > 0 ? styles.badgeBlue : styles.badgeGreen}`}>
                {pendingCount > 0 ? 'Sắp tới' : 'Trống'}
              </span>
            </div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Buổi học</div>
            <div className={styles.statSubtitle}>Đang chờ xử lý</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn} onClick={() => navigate('/parent/messages')}>
            <MessageIcon />
            <span>Tin nhắn</span>
          </button>
          <button className={styles.quickActionBtn} onClick={() => navigate('/parent/student')}>
            <ChildrenActionIcon />
            <span>Con em</span>
          </button>
          <button className={styles.quickActionBtn} onClick={() => navigate('/parent/wallet')}>
            <FinanceActionIcon />
            <span>Tài chính</span>
          </button>
        </div>

        {/* Main Content Grid (2 columns) */}
        <div className={styles.contentGrid}>
          {/* Left: Upcoming Lessons */}
          <div className={styles.lessonsCard}>
            <div className={styles.lessonsHeader}>
              <h3>Buổi học chờ xác nhận</h3>
              <a
                href="#"
                className={styles.viewAllLink}
                onClick={(e) => { e.preventDefault(); navigate('/parent/lessons'); }}
              >
                Xem tất cả &rarr;
              </a>
            </div>
            <div className={styles.lessonsList}>
              {pendingLessons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(62,47,40,0.4)' }}>
                  <p>Không có buổi học nào chờ xác nhận</p>
                </div>
              ) : (
                pendingLessons.slice(0, 4).map((lesson) => {
                  const badge = getStatusBadge(lesson.status);
                  return (
                    <div
                      key={lesson.lessonId}
                      className={`${styles.lessonItem} ${lesson.status === 'pending_parent_confirmation' ? styles.lessonHighlighted : ''}`}
                      onClick={() => navigate(`/parent/lessons/${lesson.lessonId}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.lessonLeft}>
                        <div className={styles.lessonIcon}>
                          <LessonDefaultIcon />
                        </div>
                        <div className={styles.lessonInfo}>
                          <span className={styles.lessonSubject}>
                            {lesson.subjectName} - {lesson.tutorName}
                          </span>
                          <span className={styles.lessonTime}>
                            {formatLessonTime(lesson.scheduledStart)} • {lesson.studentName}
                          </span>
                        </div>
                      </div>
                      <div className={styles.lessonRight}>
                        <span className={`${styles.lessonBadge} ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Latest Session + Needs Attention */}
          <div className={styles.rightColumn}>
            {/* Wallet Summary Card */}
            <div className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <h3>Thông tin ví</h3>
                <span className={styles.sessionDate}>
                  {walletData?.lastUpdated
                    ? new Date(walletData.lastUpdated).toLocaleDateString('vi-VN')
                    : 'Hiện tại'}
                </span>
              </div>
              <div className={styles.sessionContent}>
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionInfoLabel}>Số dư khả dụng</span>
                  <span className={styles.sessionInfoValue}>{formatCurrency(walletBalance)}</span>
                </div>
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionInfoLabel}>Đang giữ (escrow)</span>
                  <span className={styles.sessionInfoValue}>{formatCurrency(walletData?.frozenBalance ?? 0)}</span>
                </div>
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionInfoLabel}>Tổng cộng</span>
                  <span className={styles.sessionInfoValue}>{formatCurrency(walletData?.totalBalance ?? 0)}</span>
                </div>
                <button className={styles.sessionBtn} onClick={() => navigate('/parent/wallet')}>
                  Nạp tiền
                </button>
              </div>
            </div>

            {/* Needs Attention Card */}
            <div className={styles.attentionCard}>
              <h3>Cần chú ý</h3>
              <div className={styles.attentionContent}>
                {hasPendingConfirmation ? (
                  <>
                    <div className={styles.attentionIcon}>
                      <WarningIcon />
                    </div>
                    <div className={styles.attentionDetails}>
                      <span className={styles.attentionTitle}>Cần xác nhận buổi học</span>
                      <span className={styles.attentionDesc}>
                        Bạn có {pendingLessons.filter(l => l.status === 'pending_parent_confirmation').length} buổi học cần xác nhận
                      </span>
                      <a
                        href="#"
                        className={styles.attentionLink}
                        onClick={(e) => { e.preventDefault(); navigate('/parent/lessons'); }}
                      >
                        Xem ngay
                      </a>
                    </div>
                  </>
                ) : walletBalance <= 0 ? (
                  <>
                    <div className={styles.attentionIcon}>
                      <WarningIcon />
                    </div>
                    <div className={styles.attentionDetails}>
                      <span className={styles.attentionTitle}>Ví hết tiền</span>
                      <span className={styles.attentionDesc}>Nạp tiền để đặt lịch học</span>
                      <a
                        href="#"
                        className={styles.attentionLink}
                        onClick={(e) => { e.preventDefault(); navigate('/parent/wallet'); }}
                      >
                        Nạp tiền
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.attentionIcon}>
                      <CheckIcon />
                    </div>
                    <div className={styles.attentionDetails}>
                      <span className={styles.attentionTitle}>Mọi thứ ổn!</span>
                      <span className={styles.attentionDesc}>Không có vấn đề nào cần xử lý</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
