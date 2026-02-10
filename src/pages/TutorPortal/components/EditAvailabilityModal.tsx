import { FunctionComponent, useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './AddAvailabilityModal.module.css';
import { updateAvailability, DAY_OF_WEEK_MAP } from '../../../services/availability.service';

interface EditAvailabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    availabilityData: {
        id: number;
        dayOfWeek: number;  // API format: 0-6 (0=Sunday, 6=Saturday)
        startTime: string;
        endTime: string;
    } | null;
}

const EditAvailabilityModal: FunctionComponent<EditAvailabilityModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    availabilityData,
}) => {
    const [dayOfWeek, setDayOfWeek] = useState<number>(1);  // Default: Monday=1
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Update form when availabilityData changes
    useEffect(() => {
        if (availabilityData) {
            setDayOfWeek(availabilityData.dayOfWeek);
            setFromTime(availabilityData.startTime);
            setToTime(availabilityData.endTime);
        }
    }, [availabilityData]);

    if (!isOpen || !availabilityData) return null;

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
            await updateAvailability(availabilityData.id, {
                dayofweek: dayOfWeek,
                starttime: fromTime,
                endtime: toTime,
            });

            toast.success('Cập nhật lịch rảnh thành công!');

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            onClose();
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            const errorMessage = axiosError.response?.data?.message || 'Không thể cập nhật lịch rảnh. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
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
                    <h2 className={styles.title}>Chỉnh sửa lịch rảnh</h2>
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
                                {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
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

export default EditAvailabilityModal;
