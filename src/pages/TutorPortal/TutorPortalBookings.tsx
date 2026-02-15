import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/tutor-portal-bookings.module.css';
import { getTutorBookings, acceptBooking, declineBooking, type BookingResponseDTO } from '../../services/booking.service';
import { Calendar, Clock, User, BookOpen, ChevronRight, Check, X, Search } from 'lucide-react';
import { message as antMessage, Tabs, Modal, Input } from 'antd';

const TutorPortalBookings = () => {
    const [bookings, setBookings] = useState<BookingResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending_tutor');
    const [declineModalVisible, setDeclineModalVisible] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [declineReason, setDeclineReason] = useState('');
    const navigate = useNavigate();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getTutorBookings({ status: activeTab });

            // API trả về payload dạng { items: [...], totalCount: ... }
            const payload = response.content;
            let items: BookingResponseDTO[] = [];

            if (Array.isArray(payload)) {
                items = payload;
            } else if (payload && Array.isArray((payload as any).items)) {
                items = (payload as any).items;
            } else if (payload && Array.isArray((payload as any).content)) {
                items = (payload as any).content;
            }

            setBookings(items);
        } catch (error: any) {
            console.error('Fetch bookings error:', error);
            if (error.response?.status === 403) {
                antMessage.error('Bạn không có quyền truy cập (Lỗi 403). Vui lòng kiểm tra lại tài khoản hoặc quyền Tutor.');
            } else {
                antMessage.error('Không thể tải danh sách yêu cầu đặt lịch: ' + (error.message || 'Lỗi không xác định'));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [activeTab]);

    const handleAccept = async (id: number) => {
        try {
            await acceptBooking(id);
            antMessage.success('Đã chấp nhận yêu cầu!');
            fetchBookings();
        } catch (error) {
            antMessage.error('Có lỗi xảy ra khi chấp nhận yêu cầu.');
        }
    };

    const handleDecline = (id: number) => {
        setSelectedBookingId(id);
        setDeclineModalVisible(true);
    };

    const confirmDecline = async () => {
        if (!selectedBookingId) return;
        try {
            await declineBooking(selectedBookingId, declineReason);
            antMessage.success('Đã từ chối yêu cầu.');
            setDeclineModalVisible(false);
            setDeclineReason('');
            fetchBookings();
        } catch (error) {
            antMessage.error('Có lỗi xảy ra khi từ chối yêu cầu.');
        }
    };

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Quản lý Yêu cầu Đặt lịch</h1>
                    <p>Theo dõi và phản hồi các yêu cầu từ phụ huynh</p>
                </div>
            </header>

            <div className={styles.content}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className={styles.tabs}
                    items={[
                        { key: 'pending_tutor', label: 'Chờ xác nhận' },
                        { key: 'accepted', label: 'Đã chấp nhận' },
                        { key: 'paid', label: 'Đã thanh toán' },
                        { key: 'cancelled', label: 'Đã hủy/từ chối' },
                    ]}
                />

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Search size={48} />
                        <h3>Không tìm thấy yêu cầu nào</h3>
                        <p>Các yêu cầu đặt lịch mới sẽ hiển thị tại đây.</p>
                    </div>
                ) : (
                    <div className={styles.bookingList}>
                        {bookings.map((booking) => (
                            <div key={booking.bookingId} className={styles.bookingCard}>
                                <div className={styles.cardMain}>
                                    <div className={styles.studentInfo}>
                                        <div className={styles.avatar}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4>{booking.student.fullName}</h4>
                                            <span>{booking.student.gradeLevel}</span>
                                        </div>
                                    </div>

                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailItem}>
                                            <BookOpen size={16} />
                                            <span>{booking.subject.subjectName}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Clock size={16} />
                                            <span>{booking.sessionCount} buổi</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Calendar size={16} />
                                            <div className={styles.scheduleTags}>
                                                {booking.schedule.map((s, i) => (
                                                    <span key={i} className={styles.scheduleTag}>
                                                        {DAY_NAMES[s.dayOfWeek]} {s.startTime}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.priceInfo}>
                                        <span className={styles.label}>Tổng phí nhận:</span>
                                        <span className={styles.totalPrice}>{formatPrice(booking.finalPrice * 0.95)}</span>
                                        <span className={styles.feeNote}>(Sau phí hệ thống 5%)</span>
                                    </div>

                                    <div className={styles.actions}>
                                        {booking.status === 'pending_tutor' && (
                                            <>
                                                <button
                                                    className={styles.acceptBtn}
                                                    onClick={() => handleAccept(booking.bookingId)}
                                                >
                                                    <Check size={16} /> Chấp nhận
                                                </button>
                                                <button
                                                    className={styles.declineBtn}
                                                    onClick={() => handleDecline(booking.bookingId)}
                                                >
                                                    <X size={16} /> Từ chối
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className={styles.chatBtn}
                                            onClick={() => navigate('/tutor-portal/messages')}
                                        >
                                            Liên hệ phụ huynh <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                title="Từ chối yêu cầu đặt lịch"
                open={declineModalVisible}
                onOk={confirmDecline}
                onCancel={() => setDeclineModalVisible(false)}
                okText="Xác nhận từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <div style={{ padding: '16px 0' }}>
                    <p style={{ marginBottom: 8 }}>Vui lòng nhập lý do từ chối (tùy chọn):</p>
                    <Input.TextArea
                        rows={4}
                        placeholder="Ví dụ: Tôi hiện không còn lịch trống vào khung giờ này..."
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default TutorPortalBookings;
