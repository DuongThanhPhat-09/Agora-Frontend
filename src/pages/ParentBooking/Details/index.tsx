import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    BookOpen,
    CreditCard,
    Tag,
    CheckCircle2,
    Circle,
    XCircle,
    AlertCircle,
    Copy,
} from 'lucide-react';
import {
    getBookingById,
    type BookingResponseDTO
} from '../../../services/booking.service';
import styles from './styles.module.css';
import { message as antMessage, Spin } from 'antd';

// ===== HELPERS =====
const DAY_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const formatPrice = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatPackage = (pkg: string) => {
    const map: Record<string, string> = {
        '4_sessions': '4 buổi',
        '8_sessions': '8 buổi',
        '12_sessions': '12 buổi',
    };
    return map[pkg] || pkg;
};

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    pending_tutor: { label: 'Chờ gia sư xác nhận', className: 'statusPending', icon: AlertCircle },
    pending_payment: { label: 'Chờ thanh toán', className: 'statusWarning', icon: Clock },
    active: { label: 'Đang học', className: 'statusActive', icon: CheckCircle2 },
    completed: { label: 'Hoàn thành', className: 'statusCompleted', icon: CheckCircle2 },
    cancelled: { label: 'Đã hủy', className: 'statusCancelled', icon: XCircle },
    payment_timeout: { label: 'Hết hạn thanh toán', className: 'statusCancelled', icon: XCircle },
};

// Timeline steps
const TIMELINE_STEPS = [
    { key: 'created', label: 'Tạo booking' },
    { key: 'pending_tutor', label: 'Chờ gia sư' },
    { key: 'accepted', label: 'Gia sư xác nhận' },
    { key: 'pending_payment', label: 'Thanh toán' },
    { key: 'active', label: 'Bắt đầu học' },
    { key: 'completed', label: 'Hoàn thành' },
];

const getTimelineProgress = (status: string) => {
    const progressMap: Record<string, number> = {
        pending_tutor: 2,
        pending_payment: 4,
        active: 5,
        completed: 6,
        cancelled: 0,
        payment_timeout: 0,
    };
    return progressMap[status] || 1;
};

// ===== COMPONENT =====
const BookingDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<BookingResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const bookingId = Number(id);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                const res = await getBookingById(bookingId);
                setBooking(res.content);
            } catch (error) {
                antMessage.error('Không thể tải chi tiết đặt lịch.');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) fetchBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className={styles.loadingOverlay}>
                <Spin size="large" tip="Đang tải chi tiết..." />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className={styles.page}>
                <div className={styles.notFound}>
                    <AlertCircle size={48} />
                    <h2>Không tìm thấy booking</h2>
                    <p>Booking #{id} không tồn tại hoặc bạn không có quyền xem.</p>
                    <button className={styles.backBtnPrimary} onClick={() => navigate('/parent/booking')} type="button">
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending_tutor;
    const StatusIcon = statusCfg.icon;
    const timelineProgress = getTimelineProgress(booking.status);
    const isCancelled = booking.status === 'cancelled' || booking.status === 'payment_timeout';

    return (
        <div className={styles.page}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => navigate('/parent/booking')} type="button">
                    <ArrowLeft size={18} />
                    <span>Quay lại</span>
                </button>
                <div className={styles.topBarRight}>
                    <span className={styles.bookingCode}>
                        <Copy size={12} />
                        BK-{booking.bookingId}
                    </span>
                    <span className={`${styles.statusBadgeLg} ${styles[statusCfg.className]}`}>
                        <StatusIcon size={14} />
                        {statusCfg.label}
                    </span>
                </div>
            </div>

            {/* Main Grid */}
            <div className={styles.detailGrid}>
                {/* Left Column */}
                <div className={styles.leftColumn}>
                    {/* Tutor & Subject Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <BookOpen size={16} className={styles.cardHeadIcon} />
                            <h3 className={styles.cardHeadTitle}>Thông tin khóa học</h3>
                        </div>
                        <div className={styles.tutorRow}>
                            <div className={styles.tutorAvatar}>
                                {booking.tutor.avatarUrl ? (
                                    <img src={booking.tutor.avatarUrl} alt={booking.tutor.fullName} />
                                ) : (
                                    <span>{booking.tutor.fullName.charAt(0)}</span>
                                )}
                            </div>
                            <div className={styles.tutorInfo}>
                                <h4 className={styles.tutorName}>{booking.tutor.fullName}</h4>
                                <p className={styles.tutorRate}>{formatPrice(booking.tutor.hourlyRate)}/giờ</p>
                            </div>
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Môn học</span>
                                <span className={styles.infoValue}>{booking.subject.subjectName}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Gói</span>
                                <span className={styles.infoValue}>{formatPackage(booking.packageType)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Số buổi</span>
                                <span className={styles.infoValue}>{booking.sessionCount} buổi</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Ngày tạo</span>
                                <span className={styles.infoValue}>{formatDate(booking.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Student Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <User size={16} className={styles.cardHeadIcon} />
                            <h3 className={styles.cardHeadTitle}>Học sinh</h3>
                        </div>
                        <div className={styles.studentInfo}>
                            <div className={styles.studentAvatar}>
                                <span>{booking.student.fullName.charAt(0)}</span>
                            </div>
                            <div>
                                <h4 className={styles.studentName}>{booking.student.fullName}</h4>
                                <p className={styles.studentGrade}>{booking.student.gradeLevel}</p>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <Calendar size={16} className={styles.cardHeadIcon} />
                            <h3 className={styles.cardHeadTitle}>Lịch học</h3>
                        </div>
                        <div className={styles.scheduleList}>
                            {booking.schedule.map((s, i) => (
                                <div key={i} className={styles.scheduleItem}>
                                    <div className={styles.scheduleDayBadge}>{DAY_NAMES[s.dayOfWeek]}</div>
                                    <div className={styles.scheduleTime}>
                                        <Clock size={14} />
                                        <span>
                                            {s.startTime} — {s.endTime}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className={styles.rightColumn}>
                    {/* Price Breakdown */}
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <CreditCard size={16} className={styles.cardHeadIcon} />
                            <h3 className={styles.cardHeadTitle}>Chi tiết thanh toán</h3>
                        </div>
                        <div className={styles.priceBreakdown}>
                            <div className={styles.priceRow}>
                                <span>Giá gói ({formatPackage(booking.packageType)})</span>
                                <span>{formatPrice(booking.price)}</span>
                            </div>
                            {booking.discountApplied > 0 && (
                                <div className={`${styles.priceRow} ${styles.priceDiscount}`}>
                                    <span>
                                        <Tag size={12} /> Giảm giá
                                    </span>
                                    <span>-{formatPrice(booking.discountApplied)}</span>
                                </div>
                            )}
                            <div className={styles.priceDivider} />
                            <div className={`${styles.priceRow} ${styles.priceTotal}`}>
                                <span>Tổng thanh toán</span>
                                <span>{formatPrice(booking.finalPrice)}</span>
                            </div>
                            <div className={styles.priceRow + ' ' + styles.priceFee}>
                                <span>Phí nền tảng (10%)</span>
                                <span>{formatPrice(booking.platformFee)}</span>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className={styles.paymentStatusBox}>
                            {booking.paymentStatus === 'paid' ? (
                                <>
                                    <CheckCircle2 size={18} className={styles.paymentPaid} />
                                    <span className={styles.paymentPaid}>Đã thanh toán</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={18} className={styles.paymentUnpaid} />
                                    <span className={styles.paymentUnpaid}>Chưa thanh toán</span>
                                </>
                            )}
                        </div>

                        {booking.paymentDueAt && (
                            <div className={styles.paymentDue}>
                                <Clock size={14} />
                                <span>Hạn thanh toán: {formatDate(booking.paymentDueAt)}</span>
                            </div>
                        )}
                    </div>

                    {/* Status Timeline */}
                    {!isCancelled && (
                        <div className={styles.card}>
                            <div className={styles.cardHead}>
                                <CheckCircle2 size={16} className={styles.cardHeadIcon} />
                                <h3 className={styles.cardHeadTitle}>Tiến trình</h3>
                            </div>
                            <div className={styles.timeline}>
                                {TIMELINE_STEPS.map((step, i) => {
                                    const isCompleted = i < timelineProgress;
                                    const isCurrent = i === timelineProgress - 1;
                                    return (
                                        <div key={step.key} className={styles.timelineStep}>
                                            <div className={styles.timelineIndicator}>
                                                {isCompleted ? (
                                                    <CheckCircle2
                                                        size={20}
                                                        className={`${styles.timelineIcon} ${styles.timelineCompleted}`}
                                                    />
                                                ) : (
                                                    <Circle size={20} className={styles.timelineIcon} />
                                                )}
                                                {i < TIMELINE_STEPS.length - 1 && (
                                                    <div
                                                        className={`${styles.timelineLine} ${isCompleted && !isCurrent ? styles.timelineLineCompleted : ''}`}
                                                    />
                                                )}
                                            </div>
                                            <span
                                                className={`${styles.timelineLabel} ${isCurrent ? styles.timelineLabelCurrent : ''} ${isCompleted && !isCurrent ? styles.timelineLabelCompleted : ''}`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Cancelled notice */}
                    {isCancelled && (
                        <div className={styles.cancelledCard}>
                            <XCircle size={20} />
                            <div>
                                <h4>Booking đã bị hủy</h4>
                                <p>
                                    {booking.status === 'payment_timeout'
                                        ? 'Booking bị hủy tự động do quá hạn thanh toán 24h.'
                                        : 'Booking đã được hủy theo yêu cầu.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                        {booking.status === 'pending_tutor' && (
                            <button className={styles.cancelBtn} type="button">
                                <XCircle size={16} />
                                <span>Hủy booking</span>
                            </button>
                        )}
                        {booking.status === 'pending_payment' && (
                            <button
                                className={styles.payBtn}
                                type="button"
                                onClick={() => navigate(`/parent/booking/${booking.bookingId}/payment`)}
                            >
                                <CreditCard size={16} />
                                <span>Thanh toán ngay</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailPage;
