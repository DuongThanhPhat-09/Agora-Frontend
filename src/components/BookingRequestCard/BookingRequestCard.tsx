import { useState } from 'react';
import { Calendar, Clock, User, BookOpen, Check, X, AlertCircle } from 'lucide-react';
import styles from './BookingRequestCard.module.css';
import { acceptBooking, declineBooking } from '../../services/booking.service';
import { message as antMessage } from 'antd';

interface BookingRequestData {
    bookingId: number;
    studentName: string;
    subjectName: string;
    packageType: string;
    sessionCount: number;
    totalPrice: number;
    tutorReceivable: number;
    schedule: Array<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }>;
    status: string;
}

interface BookingRequestCardProps {
    message: {
        content: string; // JSON string
        senderId: string;
        createdAt: string;
    };
    isTutor?: boolean;
}

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const BookingRequestCard = ({ message, isTutor = false }: BookingRequestCardProps) => {
    let data: BookingRequestData;
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

    const [status, setStatus] = useState(data.status);
    const [loading, setLoading] = useState(false);

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
            case 'paid': return 'Đã thanh toán';
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
                    <span className={styles.value}>{data.studentName}</span>
                </div>
                <div className={styles.infoRow}>
                    <BookOpen size={14} className={styles.icon} />
                    <span className={styles.label}>Môn học:</span>
                    <span className={styles.value}>{data.subjectName}</span>
                </div>
                <div className={styles.infoRow}>
                    <Calendar size={14} className={styles.icon} />
                    <span className={styles.label}>Lịch học:</span>
                    <div className={styles.scheduleList}>
                        {data.schedule.map((s, i) => (
                            <div key={i} className={styles.scheduleItem}>
                                {DAY_NAMES[s.dayOfWeek]} {s.startTime}-{s.endTime}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.infoRow}>
                    <Clock size={14} className={styles.icon} />
                    <span className={styles.label}>Gói học:</span>
                    <span className={styles.value}>{data.sessionCount} buổi</span>
                </div>
                <div className={styles.priceSection}>
                    <div className={styles.priceRow}>
                        <span>Tổng cộng:</span>
                        <span className={styles.totalPrice}>{formatPrice(data.totalPrice)}</span>
                    </div>
                    {isTutor && (
                        <div className={styles.receivableRow}>
                            <span>Thu nhập dự kiến:</span>
                            <span className={styles.receivableValue}>{formatPrice(data.tutorReceivable)}</span>
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

            <div className={`${styles.statusBadge} ${styles[status]}`}>
                {getStatusLabel(status)}
            </div>
        </div>
    );
};

export default BookingRequestCard;
