import React from 'react';
import { Modal } from 'antd';
import styles from './BookingModal.module.css';

interface AvailabilitySlot {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    availability: AvailabilitySlot[];
    hourlyRate: number;
    trialLessonPrice: number | null;
    onNavigateToSchedule: () => void;
}

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    availability,
    hourlyRate,
    trialLessonPrice,
    onNavigateToSchedule
}) => {
    const hasSchedule = availability && availability.length > 0;

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Group availability by day
    const groupedAvailability = availability.reduce((acc, slot) => {
        const day = slot.dayOfWeek;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(slot);
        return acc;
    }, {} as Record<number, AvailabilitySlot[]>);

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={480}
            centered
            className={styles.bookingModal}
            title={null}
            closable={true}
        >
            <div className={styles.modalContent}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Đặt buổi học thử</h2>
                    {trialLessonPrice && (
                        <div className={styles.priceTag}>
                            <span className={styles.priceAmount}>{formatPrice(trialLessonPrice)}</span>
                            <span className={styles.priceUnit}>VND</span>
                        </div>
                    )}
                </div>

                {hasSchedule ? (
                    <>
                        {/* Schedule Display */}
                        <div className={styles.scheduleSection}>
                            <h3 className={styles.sectionTitle}>Lịch rảnh của gia sư</h3>
                            <div className={styles.scheduleGrid}>
                                {Object.entries(groupedAvailability).map(([day, slots]) => (
                                    <div key={day} className={styles.dayGroup}>
                                        <div className={styles.dayLabel}>
                                            {DAY_LABELS[parseInt(day)]}
                                        </div>
                                        <div className={styles.timeSlots}>
                                            {slots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    className={styles.timeSlot}
                                                    onClick={() => {
                                                        // In preview mode, just show - no real booking action
                                                    }}
                                                >
                                                    {slot.startTime}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className={styles.infoNote}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="8" cy="11" r="0.75" fill="currentColor" />
                            </svg>
                            <span>Đây là bản xem trước. Học sinh sẽ thấy giao diện này khi đặt lịch.</span>
                        </div>
                    </>
                ) : (
                    /* No Schedule State */
                    <div className={styles.noSchedule}>
                        <div className={styles.noScheduleIcon}>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="6" y="10" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M6 18H42" stroke="currentColor" strokeWidth="2" />
                                <path d="M16 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M32 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M18 28L30 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M24 22L24 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3 className={styles.noScheduleTitle}>Chưa có lịch</h3>
                        <p className={styles.noScheduleText}>
                            Bạn chưa cập nhật lịch rảnh. Hãy thêm lịch để học sinh có thể đặt buổi học thử.
                        </p>
                        <button
                            className={styles.updateScheduleBtn}
                            onClick={onNavigateToSchedule}
                        >
                            Cập nhật lịch ngay
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default BookingModal;
