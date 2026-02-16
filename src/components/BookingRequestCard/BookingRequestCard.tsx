import { useState, useEffect } from 'react';
import { Calendar, Clock, User, BookOpen, Check, X, AlertCircle } from 'lucide-react';
import styles from './BookingRequestCard.module.css';
import { acceptBooking, declineBooking, getBookingById } from '../../services/booking.service';
import { message as antMessage } from 'antd';

interface BookingRequestData {
    bookingId: number;
    student?: { studentId: string; fullName?: string; gradeLevel?: string };
    subject?: { subjectId: number; subjectName?: string };
    packageType: string;
    sessionCount: number;
    price: number;
    finalPrice: number;
    platformFee?: number;
    teachingMode: string;
    schedule: Array<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }>;
    status: string;
}

interface BookingRequestCardProps {
    message: {
        content: string;
        senderId: string;
        createdAt: string;
        metadata?: any;
    };
    isTutor?: boolean;
    onProceedToPayment?: (bookingId: number) => void;
}

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const BookingRequestCard = ({ message, isTutor = false, onProceedToPayment }: BookingRequestCardProps) => {
    let data: BookingRequestData;

    if (message.metadata) {
        data = message.metadata;
    } else {
        try {
            data = JSON.parse(message.content);
        } catch (e) {
            return (
                <div className={styles.errorCard}>
                    <AlertCircle size={16} />
                    <span>Invalid booking request data</span>
                </div>
            );
        }
    }

    // Handle both flat metadata from chat messages (studentName, subjectName as strings)
    // AND nested BookingResponseDTO structure from API (student.fullName, subject.subjectName)
    const rawData = data as any;
    const totalPrice = data.finalPrice || data.price || rawData.FinalPrice || rawData.Price || 0;
    const tutorReceivable = data.platformFee != null
        ? (data.finalPrice - data.platformFee)
        : Math.round(totalPrice * 0.85);
    const studentName = rawData.studentName || rawData.StudentName || data.student?.fullName || 'Học sinh';
    const subjectName = rawData.subjectName || rawData.SubjectName || data.subject?.subjectName || 'Môn học';
    const sessionCount = data.sessionCount || rawData.SessionCount || 0;
    const teachingMode = data.teachingMode || rawData.TeachingMode || '';

    const getTeachingModeLabel = (mode: string) => {
        switch (mode.toLowerCase()) {
            case 'online': return '🌐 Trực tuyến';
            case 'offline': return '🏫 Trực tiếp';
            case 'hybrid': return '🔄 Kết hợp';
            default: return mode;
        }
    };

    const [status, setStatus] = useState(data.status);
    const [loading, setLoading] = useState(false);

    // Fetch latest booking status on mount to handle page reload
    useEffect(() => {
        const fetchLatestStatus = async () => {
            try {
                const response = await getBookingById(data.bookingId);
                if (response.statusCode === 200 && response.content.status !== status) {
                    setStatus(response.content.status);
                }
            } catch (error) {
                console.error('Failed to fetch latest booking status:', error);
            }
        };

        fetchLatestStatus();
    }, [data.bookingId]); // Only run on mount or when bookingId changes

    const handleAccept = async () => {
        try {
            setLoading(true);
            await acceptBooking(data.bookingId);
            setStatus('accepted');
            antMessage.success('Đã chấp nhận yêu cầu đặt lịch!');
        } catch (error) {
            antMessage.error('Không thể chấp nhận yêu cầu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        try {
            setLoading(true);
            await declineBooking(data.bookingId, 'Tutor declined via chat');
            setStatus('cancelled');
            antMessage.info('Đã từ chối yêu cầu đặt lịch.');
        } catch (error) {
            antMessage.error('Có lỗi xảy ra khi từ chối yêu cầu.');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const getStatusLabel = (s: string) => {
        switch (s) {
            case 'pending_tutor': return 'Chờ xác nhận';
            case 'accepted': return 'Đã chấp nhận';
            case 'pending_payment': return 'Chờ thanh toán';
            case 'paid': return 'Đã thanh toán';
            case 'payment_timeout': return 'Đã hết hạn';
            case 'ongoing': return 'Đang diễn ra';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã từ chối';
            default: return s;
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.headerIcon}>
                    <BookOpen size={16} />
                </div>
                <span className={styles.headerTitle}>YÊU CẦU ĐẶT LỊCH MỚI</span>
            </div>

            <div className={styles.content}>
                <div className={styles.infoRow}>
                    <User size={14} className={styles.icon} />
                    <span className={styles.label}>Học sinh:</span>
                    <span className={styles.value}>{studentName}</span>
                </div>
                <div className={styles.infoRow}>
                    <BookOpen size={14} className={styles.icon} />
                    <span className={styles.label}>Môn học:</span>
                    <span className={styles.value}>{subjectName}</span>
                </div>
                <div className={styles.infoRow}>
                    <Calendar size={14} className={styles.icon} />
                    <span className={styles.label}>Lịch học:</span>
                    <div className={styles.scheduleList}>
                        {(data.schedule || []).map((s, i) => (
                            <div key={i} className={styles.scheduleItem}>
                                {DAY_NAMES[s.dayOfWeek]} {s.startTime}-{s.endTime}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.infoRow}>
                    <Clock size={14} className={styles.icon} />
                    <span className={styles.label}>Gói học:</span>
                    <span className={styles.value}>{sessionCount} buổi</span>
                </div>
                {teachingMode && (
                    <div className={styles.infoRow}>
                        <BookOpen size={14} className={styles.icon} />
                        <span className={styles.label}>Hình thức:</span>
                        <span className={styles.value}>{getTeachingModeLabel(teachingMode)}</span>
                    </div>
                )}
                <div className={styles.priceSection}>
                    <div className={styles.priceRow}>
                        <span>Tổng cộng:</span>
                        <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
                    </div>
                    {isTutor && (
                        <div className={styles.receivableRow}>
                            <span>Thu nhập dự kiến:</span>
                            <span className={styles.receivableValue}>{formatPrice(tutorReceivable)}</span>
                        </div>
                    )}
                </div>
            </div>

            {isTutor && status === 'pending_tutor' && (
                <div className={styles.actions}>
                    <button
                        className={styles.acceptBtn}
                        onClick={handleAccept}
                        disabled={loading}
                    >
                        {loading ? '...' : <><Check size={14} /> Chấp nhận</>}
                    </button>
                    <button
                        className={styles.declineBtn}
                        onClick={handleDecline}
                        disabled={loading}
                    >
                        {loading ? '...' : <><X size={14} /> Từ chối</>}
                    </button>
                </div>
            )}

            {!isTutor && status === 'accepted' && (
                <div className={styles.paymentPrompt}>
                    <div className={styles.paymentText}>
                        <Check size={16} className={styles.successIcon} />
                        <span>Gia sư đã chấp nhận yêu cầu! Vui lòng thanh toán để xác nhận lớp học.</span>
                    </div>
                    <button
                        className={styles.paymentBtn}
                        onClick={() => onProceedToPayment?.(data.bookingId)}
                    >
                        Tiến hành thanh toán
                    </button>
                </div>
            )}

            {!isTutor && status === 'payment_timeout' && (
                <div className={styles.paymentPrompt} style={{ backgroundColor: '#fee2e2', borderColor: '#ef4444' }}>
                    <div className={styles.paymentText} style={{ color: '#b91c1c' }}>
                        <AlertCircle size={16} />
                        <span>Yêu cầu đã hết hạn thanh toán (24h) và bị hủy.</span>
                    </div>
                </div>
            )}

            <div className={`${styles.statusBadge} ${styles[status]}`}>
                {getStatusLabel(status)}
            </div>
        </div>
    );
};

export default BookingRequestCard;
