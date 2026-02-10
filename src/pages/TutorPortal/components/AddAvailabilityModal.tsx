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

// Interface for API validation errors
interface FieldErrors {
    startTime?: string;
    endTime?: string;
    dayOfWeek?: string;
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
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    if (!isOpen) return null;

    // Parse API validation errors to field errors
    const parseApiErrors = (apiErrors: Record<string, string[]>): FieldErrors => {
        const errors: FieldErrors = {};

        // Map API field names to local field names (case-insensitive)
        Object.entries(apiErrors).forEach(([key, messages]) => {
            const lowerKey = key.toLowerCase();
            const errorMessage = messages[0]; // Get first error message

            if (lowerKey === 'starttime') {
                errors.startTime = errorMessage;
            } else if (lowerKey === 'endtime') {
                errors.endTime = errorMessage;
            } else if (lowerKey === 'dayofweek') {
                errors.dayOfWeek = errorMessage;
            }
        });

        return errors;
    };

    // Clear field error when user changes input
    const clearFieldError = (field: keyof FieldErrors) => {
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setFieldErrors({});

        // Frontend validation
        const errors: FieldErrors = {};

        if (!fromTime) {
            errors.startTime = 'Vui lòng chọn thời gian bắt đầu';
        }

        if (!toTime) {
            errors.endTime = 'Vui lòng chọn thời gian kết thúc';
        }

        if (fromTime && toTime && fromTime >= toTime) {
            errors.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
        }

        // If frontend validation fails, show errors and return
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
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
            setFieldErrors({});

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            onClose();
        } catch (error: any) {
            console.error('Error creating availability:', error);

            // Check if API returned validation errors
            const apiErrors = error.response?.data?.errors;
            if (apiErrors && typeof apiErrors === 'object') {
                const parsedErrors = parseApiErrors(apiErrors);
                setFieldErrors(parsedErrors);

                // Show toast with general message
                toast.error('Vui lòng kiểm tra lại thông tin nhập vào');
            } else {
                // Generic error message
                const errorMessage = error.response?.data?.message || error.response?.data?.title || 'Không thể thêm lịch rảnh. Vui lòng thử lại.';
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form
        setDayOfWeek(1);  // Monday=1
        setFromTime('');
        setToTime('');
        setFieldErrors({});
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
                                    <div className={`${styles.inputWrapper} ${fieldErrors.startTime ? styles.inputError : ''}`}>
                                        <div className={styles.inputIcon}>
                                            <Clock size={14} strokeWidth={2} />
                                        </div>
                                        <input
                                            type="time"
                                            className={styles.input}
                                            value={fromTime}
                                            onChange={(e) => {
                                                setFromTime(e.target.value);
                                                clearFieldError('startTime');
                                            }}
                                            required
                                        />
                                    </div>
                                    {fieldErrors.startTime && (
                                        <span className={styles.errorMessage}>{fieldErrors.startTime}</span>
                                    )}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Đến</label>
                                    <div className={`${styles.inputWrapper} ${fieldErrors.endTime ? styles.inputError : ''}`}>
                                        <div className={styles.inputIcon}>
                                            <Clock size={14} strokeWidth={2} />
                                        </div>
                                        <input
                                            type="time"
                                            className={styles.input}
                                            value={toTime}
                                            onChange={(e) => {
                                                setToTime(e.target.value);
                                                clearFieldError('endTime');
                                            }}
                                            required
                                        />
                                    </div>
                                    {fieldErrors.endTime && (
                                        <span className={styles.errorMessage}>{fieldErrors.endTime}</span>
                                    )}
                                </div>
                            </div>

                            {/* Time hint */}
                            <p className={styles.timeHint}>
                                Lưu ý: Thời gian phải nằm trong khoảng 07:00 - 21:00
                            </p>
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
