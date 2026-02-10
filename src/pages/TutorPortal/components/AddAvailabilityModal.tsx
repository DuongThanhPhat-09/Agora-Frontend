import { FunctionComponent, useState } from 'react';
import { X, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './AddAvailabilityModal.module.css';
import { createAvailability, DAY_OF_WEEK_MAP } from '../../../services/availability.service';

interface AddAvailabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;  // Callback when availability is created successfully
}

const AddAvailabilityModal: FunctionComponent<AddAvailabilityModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [dayOfWeek, setDayOfWeek] = useState<number>(1);  // Default: Thứ 2 (Monday=1)
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!fromTime || !toTime) {
            toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc');
            return;
        }

        if (fromTime >= toTime) {
            toast.error('Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        setIsLoading(true);

        try {
            await createAvailability({
                dayofweek: dayOfWeek,
                starttime: fromTime,
                endtime: toTime,
            });

            toast.success('Thêm lịch rảnh thành công!');

            // Reset form
            setDayOfWeek(1);  // Monday=1
            setFromTime('');
            setToTime('');

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            onClose();
        } catch (error: any) {
            console.error('Error creating availability:', error);
            const errorMessage = error.response?.data?.message || 'Không thể thêm lịch rảnh. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form
        setDayOfWeek(1);  // Monday=1
        setFromTime('');
        setToTime('');
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`}
                onClick={handleOverlayClick}
            />

            {/* Sidebar Modal */}
            <div className={`${styles.sidebarModal} ${isOpen ? styles.open : ''}`}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Thêm lịch rảnh</h2>
                    <button className={styles.closeBtn} onClick={handleCancel} type="button">
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                {/* Form Content */}
                <div className={styles.content}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formFields}>
                            {/* Day of Week Field */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Ngày trong tuần</label>
                                <div className={styles.inputWrapper}>
                                    <select
                                        className={styles.select}
                                        value={dayOfWeek}
                                        onChange={(e) => setDayOfWeek(Number(e.target.value))}
                                        required
                                    >
                                        {Object.entries(DAY_OF_WEEK_MAP).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Time Range Fields */}
                            <div className={styles.timeRangeGroup}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Từ</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <Clock size={14} strokeWidth={2} />
                                        </div>
                                        <input
                                            type="time"
                                            className={styles.input}
                                            value={fromTime}
                                            onChange={(e) => setFromTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Đến</label>
                                    <div className={styles.inputWrapper}>
                                        <div className={styles.inputIcon}>
                                            <Clock size={14} strokeWidth={2} />
                                        </div>
                                        <input
                                            type="time"
                                            className={styles.input}
                                            value={toTime}
                                            onChange={(e) => setToTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.actions}>
                            <button
                                type="submit"
                                className={styles.primaryBtn}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Thêm lịch'}
                            </button>
                            <button
                                type="button"
                                className={styles.secondaryBtn}
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddAvailabilityModal;
