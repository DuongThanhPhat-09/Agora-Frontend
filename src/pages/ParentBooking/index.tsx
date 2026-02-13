import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, BookOpen, Filter, ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';
import styles from './styles.module.css';

// ===== TYPES =====
interface ScheduleItem {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface BookingItem {
  bookingId: number;
  student: { studentId: string; fullName: string; gradeLevel: string };
  tutor: { tutorId: string; fullName: string; avatarUrl: string; hourlyRate: number };
  subject: { subjectId: number; subjectName: string };
  packageType: string;
  sessionCount: number;
  price: number;
  discountApplied: number;
  finalPrice: number;
  platformFee: number;
  status: string;
  paymentStatus: string;
  schedule: ScheduleItem[];
  createdAt: string;
  paymentDueAt: string | null;
}

// ===== MOCK DATA =====
const mockBookings: BookingItem[] = [
  {
    bookingId: 1,
    student: { studentId: 's1', fullName: 'Nguyễn Minh An', gradeLevel: 'Grade 8' },
    tutor: { tutorId: 't1', fullName: 'Trần Thị Hương', avatarUrl: '', hourlyRate: 200000 },
    subject: { subjectId: 1, subjectName: 'Toán' },
    packageType: '8_sessions',
    sessionCount: 8,
    price: 3200000,
    discountApplied: 320000,
    finalPrice: 2880000,
    platformFee: 288000,
    status: 'active',
    paymentStatus: 'paid',
    schedule: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '14:00', endTime: '16:00' },
    ],
    createdAt: '2025-01-20T10:30:00Z',
    paymentDueAt: null,
  },
  {
    bookingId: 2,
    student: { studentId: 's2', fullName: 'Nguyễn Minh Châu', gradeLevel: 'Grade 10' },
    tutor: { tutorId: 't2', fullName: 'Lê Văn Đức', avatarUrl: '', hourlyRate: 250000 },
    subject: { subjectId: 2, subjectName: 'Vật Lý' },
    packageType: '4_sessions',
    sessionCount: 4,
    price: 2000000,
    discountApplied: 0,
    finalPrice: 2000000,
    platformFee: 200000,
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    schedule: [{ dayOfWeek: 3, startTime: '09:00', endTime: '11:00' }],
    createdAt: '2025-01-22T08:00:00Z',
    paymentDueAt: '2025-01-23T08:00:00Z',
  },
  {
    bookingId: 3,
    student: { studentId: 's1', fullName: 'Nguyễn Minh An', gradeLevel: 'Grade 8' },
    tutor: { tutorId: 't3', fullName: 'Phạm Thị Mai', avatarUrl: '', hourlyRate: 180000 },
    subject: { subjectId: 3, subjectName: 'Tiếng Anh' },
    packageType: '12_sessions',
    sessionCount: 12,
    price: 4320000,
    discountApplied: 432000,
    finalPrice: 3888000,
    platformFee: 388800,
    status: 'pending_tutor',
    paymentStatus: 'unpaid',
    schedule: [
      { dayOfWeek: 2, startTime: '15:00', endTime: '16:30' },
      { dayOfWeek: 5, startTime: '15:00', endTime: '16:30' },
    ],
    createdAt: '2025-01-25T14:00:00Z',
    paymentDueAt: null,
  },
  {
    bookingId: 4,
    student: { studentId: 's2', fullName: 'Nguyễn Minh Châu', gradeLevel: 'Grade 10' },
    tutor: { tutorId: 't1', fullName: 'Trần Thị Hương', avatarUrl: '', hourlyRate: 200000 },
    subject: { subjectId: 4, subjectName: 'Hóa Học' },
    packageType: '8_sessions',
    sessionCount: 8,
    price: 3200000,
    discountApplied: 0,
    finalPrice: 3200000,
    platformFee: 320000,
    status: 'completed',
    paymentStatus: 'paid',
    schedule: [{ dayOfWeek: 6, startTime: '08:00', endTime: '10:00' }],
    createdAt: '2024-12-10T09:00:00Z',
    paymentDueAt: null,
  },
  {
    bookingId: 5,
    student: { studentId: 's1', fullName: 'Nguyễn Minh An', gradeLevel: 'Grade 8' },
    tutor: { tutorId: 't2', fullName: 'Lê Văn Đức', avatarUrl: '', hourlyRate: 250000 },
    subject: { subjectId: 2, subjectName: 'Vật Lý' },
    packageType: '4_sessions',
    sessionCount: 4,
    price: 2000000,
    discountApplied: 0,
    finalPrice: 2000000,
    platformFee: 200000,
    status: 'cancelled',
    paymentStatus: 'unpaid',
    schedule: [{ dayOfWeek: 1, startTime: '10:00', endTime: '12:00' }],
    createdAt: '2025-01-18T16:00:00Z',
    paymentDueAt: null,
  },
];

// ===== HELPERS =====
const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending_tutor', label: 'Chờ gia sư' },
  { key: 'pending_payment', label: 'Chờ thanh toán' },
  { key: 'active', label: 'Đang học' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending_tutor: { label: 'Chờ gia sư', className: 'statusPending' },
  pending_payment: { label: 'Chờ thanh toán', className: 'statusWarning' },
  active: { label: 'Đang học', className: 'statusActive' },
  completed: { label: 'Hoàn thành', className: 'statusCompleted' },
  cancelled: { label: 'Đã hủy', className: 'statusCancelled' },
  payment_timeout: { label: 'Hết hạn TT', className: 'statusCancelled' },
};

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatPackage = (pkg: string) => {
  const map: Record<string, string> = {
    '4_sessions': '4 buổi',
    '8_sessions': '8 buổi',
    '12_sessions': '12 buổi',
  };
  return map[pkg] || pkg;
};

// ===== COMPONENT =====
const ParentBooking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter
  const filtered = activeTab === 'all' ? mockBookings : mockBookings.filter((b) => b.status === activeTab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>My Bookings</h1>
          <p className={styles.subtitle}>Quản lý các lịch đặt gia sư của bạn</p>
        </div>
        <button className={styles.newBookingBtn} type="button">
          <Plus size={18} />
          <span>Đặt gia sư mới</span>
        </button>
      </header>

      {/* Stats Strip */}
      <div className={styles.statsStrip}>
        <div className={styles.statCard}>
          <div className={styles.statIcon + ' ' + styles.statIconBlue}>
            <BookOpen size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{mockBookings.length}</span>
            <span className={styles.statLabel}>Tổng bookings</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon + ' ' + styles.statIconGreen}>
            <Calendar size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{mockBookings.filter((b) => b.status === 'active').length}</span>
            <span className={styles.statLabel}>Đang học</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon + ' ' + styles.statIconAmber}>
            <Clock size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {mockBookings.filter((b) => b.status === 'pending_tutor' || b.status === 'pending_payment').length}
            </span>
            <span className={styles.statLabel}>Đang chờ</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        <Filter size={16} className={styles.filterIcon} />
        <div className={styles.tabs}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(tab.key)}
              type="button"
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className={styles.tabCount}>
                  {mockBookings.filter((b) => b.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <main className={styles.mainContent}>
        {paginated.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <BookOpen size={48} />
            </div>
            <h3 className={styles.emptyTitle}>Chưa có booking nào</h3>
            <p className={styles.emptyText}>Hãy tìm gia sư phù hợp và đặt lịch học cho con bạn.</p>
            <button className={styles.emptyBtn} type="button">
              <Plus size={18} />
              <span>Đặt gia sư ngay</span>
            </button>
          </div>
        ) : (
          <>
            <div className={styles.bookingsList}>
              {paginated.map((booking) => {
                const statusCfg = STATUS_CONFIG[booking.status] || {
                  label: booking.status,
                  className: 'statusPending',
                };
                return (
                  <div
                    key={booking.bookingId}
                    className={styles.bookingCard}
                    onClick={() => navigate(`/parent/booking/${booking.bookingId}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/parent/booking/${booking.bookingId}`)}
                  >
                    {/* Card Header */}
                    <div className={styles.cardHeader}>
                      <div className={styles.cardHeaderLeft}>
                        <div className={styles.tutorAvatar}>
                          {booking.tutor.avatarUrl ? (
                            <img src={booking.tutor.avatarUrl} alt={booking.tutor.fullName} />
                          ) : (
                            <span>{booking.tutor.fullName.charAt(0)}</span>
                          )}
                        </div>
                        <div className={styles.cardTitleGroup}>
                          <h3 className={styles.cardTitle}>{booking.subject.subjectName}</h3>
                          <p className={styles.cardSubtitle}>
                            với {booking.tutor.fullName} • cho {booking.student.fullName}
                          </p>
                        </div>
                      </div>
                      <span className={`${styles.statusBadge} ${styles[statusCfg.className]}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                          <BookOpen size={14} />
                          <span>{formatPackage(booking.packageType)}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Calendar size={14} />
                          <span>
                            {booking.schedule
                              .map((s) => `${DAY_NAMES[s.dayOfWeek]} ${s.startTime}-${s.endTime}`)
                              .join(', ')}
                          </span>
                        </div>
                        <div className={styles.metaItem}>
                          <User size={14} />
                          <span>
                            {booking.student.fullName} ({booking.student.gradeLevel})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className={styles.cardFooter}>
                      <div className={styles.priceGroup}>
                        {booking.discountApplied > 0 && (
                          <span className={styles.priceOriginal}>{formatPrice(booking.price)}</span>
                        )}
                        <span className={styles.priceFinal}>{formatPrice(booking.finalPrice)}</span>
                      </div>
                      <div className={styles.cardActions}>
                        <span className={styles.cardDate}>{formatDate(booking.createdAt)}</span>
                        <button
                          className={styles.viewBtn}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/parent/booking/${booking.bookingId}`);
                          }}
                        >
                          <Eye size={14} />
                          <span>Chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  type="button"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className={styles.pageInfo}>
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  type="button"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ParentBooking;
