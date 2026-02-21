import { type FunctionComponent, useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './AddAvailabilityModal.module.css';
import { createAvailability, DAY_OF_WEEK_MAP } from '../../../services/availability.service';

// Hour options: 0 to 23 (temporarily expanded)
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return {
        value: hour.toString(),
        label: hour.toString().padStart(2, '0')
    };
});

// Minute options: 00, 15, 30, 45
const MINUTE_OPTIONS = [
    { value: '0', label: '00' },
    { value: '15', label: '15' },
    { value: '30', label: '30' },
    { value: '45', label: '45' }
];

// Helper to combine hour and minute to time string
const combineTime = (hour: string, minute: string): string => {
    if (!hour) return '';
    return `${hour.padStart(2, '0')}:${(minute || '0').padStart(2, '0')}`;
};

// Helper to compare times
const isTimeBefore = (h1: string, m1: string, h2: string, m2: string): boolean => {
    const time1 = parseInt(h1) * 60 + parseInt(m1 || '0');
    const time2 = parseInt(h2) * 60 + parseInt(m2 || '0');
    return time1 < time2;
};

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
    const [fromHour, setFromHour] = useState('');
    const [fromMinute, setFromMinute] = useState('0');
    const [toHour, setToHour] = useState('');
    const [toMinute, setToMinute] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [isVisible, setIsVisible] = useState(false);

    // Handle animation - delay visibility for smooth transition
    useEffect(() => {
        if (isOpen) {
            // Small delay to trigger CSS transition
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    // Get available end hours based on start time
    const getAvailableEndHours = () => {
        if (!fromHour) return HOUR_OPTIONS;
        const startHour = parseInt(fromHour);
        return HOUR_OPTIONS.filter(opt => parseInt(opt.value) >= startHour);
    };

    // Get available end minutes based on selected hours
    const getAvailableEndMinutes = () => {
        if (!fromHour || !toHour) return MINUTE_OPTIONS;
        if (parseInt(toHour) > parseInt(fromHour)) return MINUTE_OPTIONS;
        // Same hour - filter minutes greater than start minute
        return MINUTE_OPTIONS.filter(opt => parseInt(opt.value) > parseInt(fromMinute));
    };

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

        // Combine hour and minute
        const fromTime = combineTime(fromHour, fromMinute);
        const toTime = combineTime(toHour, toMinute);

        // Frontend validation
        const errors: FieldErrors = {};

        if (!fromHour) {
            errors.startTime = 'Vui lòng chọn giờ bắt đầu';
        }

        if (!toHour) {
            errors.endTime = 'Vui lòng chọn giờ kết thúc';
        }

        if (fromHour && toHour && !isTimeBefore(fromHour, fromMinute, toHour, toMinute)) {
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
            setFromHour('');
            setFromMinute('0');
            setToHour('');
            setToMinute('0');
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
        setFromHour('');
        setFromMinute('0');
        setToHour('');
        setToMinute('0');
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
                className={`${styles.modalOverlay} ${isVisible ? styles.open : ''}`}
                onClick={handleOverlayClick}
            />

            {/* Sidebar Modal */}
            <div className={`${styles.sidebarModal} ${isVisible ? styles.open : ''}`}>
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
                                    <div className={`${styles.timePickerRow} ${fieldErrors.startTime ? styles.inputError : ''}`}>
                                        <div className={styles.inputIcon}>
                                            <Clock size={14} strokeWidth={2} />
                                        </div>
                                        <select
                                            className={styles.timeSelect}
                                            value={fromHour}
                                            onChange={(e) => {
                                                setFromHour(e.target.value);
                                                clearFieldError('startTime');
                                                // Reset end time if it's now invalid
                                                if (toHour && !isTimeBefore(e.target.value, fromMinute, toHour, toMinute)) {
                                                    setToHour('');
                                                    setToMinute('0');
                                                }
                                            }}
                                            required
                                        >
                                            <option value="">Giờ</option>
                                            {HOUR_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className={styles.timeSeparator}>:</span>
                                        <select
                                            className={styles.timeSelect}
                                            value={fromMinute}
                                            onChange={(e) => {
                                                setFromMinute(e.target.value);
                                                // Reset end time if it's now invalid
                                                if (toHour && !isTimeBefore(fromHour, e.target.value, toHour, toMinute)) {
                                                    setToMinute('0');
                                                }
                                            }}
                                            disabled={!fromHour}
                                        >
                                            {MINUTE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {fieldErrors.startTime && (
                                        <span className={styles.errorMessage}>{fieldErrors.startTime}</span>
                                    )}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Đến</label>
                                    <div className={`${styles.timePickerRow} ${fieldErrors.endTime ? styles.inputError : ''}`}>
                                        <div className={styles.inputIcon}>
                                            <Clock size={14} strokeWidth={2} />
                                        </div>
                                        <select
                                            className={styles.timeSelect}
                                            value={toHour}
                                            onChange={(e) => {
                                                setToHour(e.target.value);
                                                clearFieldError('endTime');
                                                // Reset minute if hour changed and minute is now invalid
                                                if (e.target.value === fromHour && parseInt(toMinute) <= parseInt(fromMinute)) {
                                                    setToMinute('0');
                                                }
                                            }}
                                            required
                                            disabled={!fromHour}
                                        >
                                            <option value="">Giờ</option>
                                            {getAvailableEndHours().map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className={styles.timeSeparator}>:</span>
                                        <select
                                            className={styles.timeSelect}
                                            value={toMinute}
                                            onChange={(e) => {
                                                setToMinute(e.target.value);
                                                clearFieldError('endTime');
                                            }}
                                            disabled={!toHour}
                                        >
                                            {getAvailableEndMinutes().map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {fieldErrors.endTime && (
                                        <span className={styles.errorMessage}>{fieldErrors.endTime}</span>
                                    )}
                                </div>
                            </div>

                            {/* Time hint */}
                            {/* <p className={styles.timeHint}>
                                Lưu ý: Thời gian phải nằm trong khoảng 07:00 - 21:00
                            </p> */}
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
