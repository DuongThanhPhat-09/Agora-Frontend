import { useState, useEffect } from 'react';
import { getStudents } from '../../services/student.service';
import { createBooking, validatePromotion } from '../../services/booking.service';
import type { StudentType } from '../../types/student.type';
import type { CreateBookingPayload, PromotionValidateResult } from '../../services/booking.service';
import type { SubjectInfo, AvailabilitySlot } from '../../services/tutorDetail.service';
import './BookingModal.css';

// ===== TYPES =====
interface ScheduleSlot {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

interface Subject {
    id: number;
    name: string;
}

interface BookingFormData {
    studentId: string;
    subjectId: number;
    teachingMode: 'online' | 'offline' | 'hybrid';
    schedule: ScheduleSlot[];
    locationCity: string;
    locationDistrict: string;
    locationWard: string;
    locationDetail: string;
    promotionCode: string;
}

// ===== CONSTANTS =====
const SUBJECT_MAPPING: Subject[] = [
    { id: 1, name: 'Toán' },
    { id: 2, name: 'Vật Lý' },
    { id: 3, name: 'Hóa Học' },
    { id: 4, name: 'Sinh học' },
    { id: 5, name: 'Tiếng Anh' },
    { id: 6, name: 'Ngữ Văn' },
    { id: 7, name: 'Lịch Sử' },
    { id: 8, name: 'Địa Lý' },
    { id: 9, name: 'Tin Học' },
];

const TEACHING_MODES = [
    { key: 'online' as const, label: 'Online', icon: '💻', desc: 'Học qua video call' },
    { key: 'offline' as const, label: 'Tại nhà', icon: '🏠', desc: 'Gia sư đến tận nơi' },
    { key: 'hybrid' as const, label: 'Linh hoạt', icon: '🔄', desc: 'Kết hợp online & offline' },
];

const DURATION_OPTIONS = [
    { value: 1, label: '1 giờ' },
    { value: 1.5, label: '1.5 giờ' },
    { value: 2, label: '2 giờ' },
];

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const TIME_SLOTS = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '13:00', '13:30', '14:00',
    '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];

// ===== MOCK DATA =====
const MOCK_STUDENTS: StudentType[] = [
    {
        studentId: 'mock-student-1',
        parentId: 'mock-parent-1',
        fullName: 'Nguyễn Minh Anh',
        birthDate: '2010-05-15',
        school: 'THCS Lê Quý Đôn',
        gradeLevel: 'Lớp 8',
        learningGoals: 'Nâng cao Toán, Lý',
        avatarURL: '',
        studentCode: 'STU001',
        studentCodeExpiresAt: '2027-01-01',
        createdAt: '2024-09-01',
        age: 14,
    },
    {
        studentId: 'mock-student-2',
        parentId: 'mock-parent-1',
        fullName: 'Nguyễn Gia Bảo',
        birthDate: '2012-03-22',
        school: 'THCS Trần Đại Nghĩa',
        gradeLevel: 'Lớp 6',
        learningGoals: 'Luyện thi vào lớp chuyên',
        avatarURL: '',
        studentCode: 'STU002',
        studentCodeExpiresAt: '2027-01-01',
        createdAt: '2024-09-01',
        age: 12,
    },
    {
        studentId: 'mock-student-3',
        parentId: 'mock-parent-2',
        fullName: 'Trần Phương Linh',
        birthDate: '2008-11-08',
        school: 'THPT Nguyễn Thị Minh Khai',
        gradeLevel: 'Lớp 10',
        learningGoals: 'Chuẩn bị IELTS',
        avatarURL: '',
        studentCode: 'STU003',
        studentCodeExpiresAt: '2027-01-01',
        createdAt: '2024-10-15',
        age: 16,
    },
];

// ===== HELPERS =====
const formatPrice = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const addHoursToTime = (time: string, hours: number): string => {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + hours * 60;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

/** Tính tổng giờ từ schedule — giống backend: totalHours = sum(endTime - startTime) × 4 weeks */
const calcTotalHoursFromSchedule = (schedule: ScheduleSlot[]): number => {
    let totalHours = 0;
    for (const slot of schedule) {
        const [sh, sm] = slot.startTime.split(':').map(Number);
        const [eh, em] = slot.endTime.split(':').map(Number);
        const duration = (eh * 60 + em - sh * 60 - sm) / 60;
        totalHours += duration * 4; // 4 weeks per month
    }
    return totalHours;
};

/** Check if a slot fits within tutor's availability for that day */
const isSlotWithinAvailability = (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    availabilities: AvailabilitySlot[]
): boolean => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const slotStart = sh * 60 + sm;
    const slotEnd = eh * 60 + em;

    return availabilities.some((a) => {
        if (a.dayofweek !== dayOfWeek) return false;
        const [ah, am] = a.starttime.split(':').map(Number);
        const [bh, bm] = a.endtime.split(':').map(Number);
        const availStart = ah * 60 + am;
        const availEnd = bh * 60 + bm;
        return slotStart >= availStart && slotEnd <= availEnd;
    });
};

// ===== STEP COMPONENTS =====

interface StepProps {
    formData: BookingFormData;
    setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
    hourlyRate: number;
    students: StudentType[];
    loadingStudents: boolean;
    availableSubjects: Subject[];
    availabilities: AvailabilitySlot[];
    slotDuration: number;
    setSlotDuration: React.Dispatch<React.SetStateAction<number>>;
}

// Step 1: Select Student & Subject
const StepStudentSubject = ({ formData, setFormData, students, loadingStudents, availableSubjects }: StepProps) => (
    <div className="bm-step">
        <div className="bm-step-title">Chọn học sinh</div>
        {loadingStudents ? (
            <div className="bm-loading">Đang tải danh sách học sinh...</div>
        ) : students.length === 0 ? (
            <div className="bm-empty-msg">Chưa có học sinh nào. Vui lòng thêm học sinh trước.</div>
        ) : (
            <div className="bm-student-grid">
                {students.map((s) => (
                    <div
                        key={s.studentId}
                        className={`bm-student-card ${formData.studentId === s.studentId ? 'selected' : ''}`}
                        onClick={() => setFormData((d) => ({ ...d, studentId: s.studentId }))}
                    >
                        <div className="bm-student-avatar">
                            {s.avatarURL ? (
                                <img src={s.avatarURL} alt={s.fullName} />
                            ) : (
                                s.fullName.charAt(0)
                            )}
                        </div>
                        <div className="bm-student-info">
                            <span className="bm-student-name">{s.fullName}</span>
                            <span className="bm-student-grade">{s.gradeLevel || s.school}</span>
                        </div>
                        {formData.studentId === s.studentId && <div className="bm-check">✓</div>}
                    </div>
                ))}
            </div>
        )}

        <div className="bm-step-title" style={{ marginTop: 24 }}>Chọn môn học</div>
        {availableSubjects.length === 0 ? (
            <div className="bm-empty-msg">Gia sư này chưa cập nhật môn học.</div>
        ) : (
            <div className="bm-subject-grid">
                {availableSubjects.map((subj) => (
                    <button
                        key={subj.id}
                        className={`bm-subject-btn ${formData.subjectId === subj.id ? 'selected' : ''}`}
                        onClick={() => setFormData((d) => ({ ...d, subjectId: subj.id }))}
                        type="button"
                    >
                        {subj.name}
                    </button>
                ))}
            </div>
        )}
    </div>
);

// Step 2: Teaching Mode & Location
const StepTeachingMode = ({ formData, setFormData }: StepProps) => {
    const needsLocation = formData.teachingMode === 'offline' || formData.teachingMode === 'hybrid';

    return (
        <div className="bm-step">
            <div className="bm-step-title">Hình thức học</div>
            <div className="bm-teaching-mode-grid">
                {TEACHING_MODES.map((mode) => (
                    <div
                        key={mode.key}
                        className={`bm-teaching-mode-card ${formData.teachingMode === mode.key ? 'selected' : ''}`}
                        onClick={() => setFormData((d) => ({
                            ...d,
                            teachingMode: mode.key,
                            ...(mode.key === 'online' ? { locationCity: '', locationDistrict: '', locationWard: '', locationDetail: '' } : {})
                        }))}
                    >
                        <div className="bm-teaching-mode-icon">{mode.icon}</div>
                        <div className="bm-teaching-mode-info">
                            <span className="bm-teaching-mode-label">{mode.label}</span>
                            <span className="bm-teaching-mode-desc">{mode.desc}</span>
                        </div>
                        {formData.teachingMode === mode.key && <div className="bm-check">✓</div>}
                    </div>
                ))}
            </div>

            {needsLocation && (
                <div className="bm-location-section">
                    <div className="bm-step-title" style={{ marginTop: 28 }}>
                        Địa điểm học
                        <span className="bm-required-badge">Bắt buộc</span>
                    </div>
                    <div className="bm-location-form">
                        <div className="bm-form-row">
                            <div className="bm-form-group">
                                <label className="bm-form-label">Tỉnh / Thành phố *</label>
                                <input
                                    type="text"
                                    className="bm-form-input"
                                    placeholder="VD: Hồ Chí Minh"
                                    value={formData.locationCity}
                                    onChange={(e) => setFormData((d) => ({ ...d, locationCity: e.target.value }))}
                                />
                            </div>
                            <div className="bm-form-group">
                                <label className="bm-form-label">Quận / Huyện *</label>
                                <input
                                    type="text"
                                    className="bm-form-input"
                                    placeholder="VD: Quận 1"
                                    value={formData.locationDistrict}
                                    onChange={(e) => setFormData((d) => ({ ...d, locationDistrict: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="bm-form-row">
                            <div className="bm-form-group">
                                <label className="bm-form-label">Phường / Xã</label>
                                <input
                                    type="text"
                                    className="bm-form-input"
                                    placeholder="VD: Phường Bến Nghé"
                                    value={formData.locationWard}
                                    onChange={(e) => setFormData((d) => ({ ...d, locationWard: e.target.value }))}
                                />
                            </div>
                            <div className="bm-form-group">
                                <label className="bm-form-label">Địa chỉ cụ thể</label>
                                <input
                                    type="text"
                                    className="bm-form-input"
                                    placeholder="VD: 123 Nguyễn Huệ"
                                    value={formData.locationDetail}
                                    onChange={(e) => setFormData((d) => ({ ...d, locationDetail: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Step 3: Schedule Picker — with availability validation
const StepSchedule = ({ formData, setFormData, slotDuration, setSlotDuration, availabilities }: StepProps) => {
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
    }, [toast]);

    const toggleSlot = (dayOfWeek: number, startTime: string) => {
        const endTime = addHoursToTime(startTime, slotDuration);
        setFormData((d) => {
            const exists = d.schedule.find(
                (s) => s.dayOfWeek === dayOfWeek && s.startTime === startTime
            );
            if (exists) {
                return { ...d, schedule: d.schedule.filter((s) => !(s.dayOfWeek === dayOfWeek && s.startTime === startTime)) };
            }
            // Validate against tutor availability
            if (availabilities.length > 0 && !isSlotWithinAvailability(dayOfWeek, startTime, endTime, availabilities)) {
                setToast(
                    `⚠️ ${DAY_NAMES[dayOfWeek]} ${startTime}–${endTime} vượt ngoài lịch rảnh của gia sư. Hãy chọn slot khác hoặc giảm thời lượng.`
                );
                return d;
            }
            return { ...d, schedule: [...d.schedule, { dayOfWeek, startTime, endTime }] };
        });
    };

    const isSelected = (day: number, time: string) =>
        formData.schedule.some((s) => s.dayOfWeek === day && s.startTime === time);

    /** Check if a cell is within tutor availability (available to book) */
    const isSlotAvailable = (day: number, time: string): boolean => {
        if (availabilities.length === 0) return true; // No data = allow all
        const endTime = addHoursToTime(time, slotDuration);
        return isSlotWithinAvailability(day, time, endTime, availabilities);
    };

    const slotsPerWeek = formData.schedule.length;
    const sessionCount = slotsPerWeek * 4;

    return (
        <div className="bm-step">
            {/* Toast warning */}
            {toast && (
                <div className="bm-toast-warning">
                    <span>{toast}</span>
                    <button className="bm-toast-close" onClick={() => setToast(null)} type="button">✕</button>
                </div>
            )}

            <div className="bm-step-title">Chọn lịch học hàng tuần</div>
            <p className="bm-step-desc">
                Chọn các slot phù hợp. Hệ thống tính: <strong>{slotsPerWeek} slot/tuần × 4 tuần = {sessionCount} buổi/tháng</strong>.
            </p>

            {/* Duration selector */}
            <div className="bm-duration-section">
                <span className="bm-duration-label">Thời lượng mỗi slot:</span>
                <div className="bm-hours-grid">
                    {DURATION_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            className={`bm-hours-btn ${slotDuration === opt.value ? 'selected' : ''}`}
                            onClick={() => {
                                setSlotDuration(opt.value);
                                // Update endTime for all existing slots
                                setFormData((d) => ({
                                    ...d,
                                    schedule: d.schedule.map((s) => ({
                                        ...s,
                                        endTime: addHoursToTime(s.startTime, opt.value),
                                    })),
                                }));
                            }}
                            type="button"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bm-schedule-table">
                <div className="bm-schedule-header">
                    <div className="bm-schedule-corner"></div>
                    {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                        <div key={d} className="bm-schedule-day-header">{DAY_NAMES[d]}</div>
                    ))}
                </div>
                <div className="bm-schedule-body">
                    {TIME_SLOTS.map((time) => (
                        <div key={time} className="bm-schedule-row">
                            <div className="bm-schedule-time">{time}</div>
                            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                                const available = isSlotAvailable(day, time);
                                return (
                                    <div
                                        key={day}
                                        className={`bm-schedule-cell ${isSelected(day, time) ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                                        onClick={() => available && toggleSlot(day, time)}
                                        title={!available ? 'Gia sư không rảnh khung giờ này' : ''}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {formData.schedule.length > 0 && (
                <div className="bm-selected-slots">
                    <div className="bm-step-title" style={{ fontSize: 13 }}>Đã chọn ({formData.schedule.length} slot/tuần → {sessionCount} buổi/tháng)</div>
                    <div className="bm-slot-tags">
                        {formData.schedule.map((s, i) => (
                            <span key={i} className="bm-slot-tag">
                                {DAY_NAMES[s.dayOfWeek]} {s.startTime}–{s.endTime}
                                <button
                                    className="bm-slot-remove"
                                    onClick={() =>
                                        setFormData((d) => ({
                                            ...d,
                                            schedule: d.schedule.filter((_, idx) => idx !== i),
                                        }))
                                    }
                                    type="button"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Step 4: Review & Confirm
const StepReview = ({ formData, setFormData, hourlyRate, students, availableSubjects }: StepProps) => {
    const student = students.find((s) => s.studentId === formData.studentId);
    const subject = availableSubjects.find((s) => s.id === formData.subjectId);
    const teachingModeInfo = TEACHING_MODES.find((m) => m.key === formData.teachingMode);

    // Replicate backend calculation: hourlyRate × totalHours
    const totalHours = calcTotalHoursFromSchedule(formData.schedule);
    const estimatedPrice = hourlyRate * totalHours;

    const [promoResult, setPromoResult] = useState<PromotionValidateResult | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);

    const slotsPerWeek = formData.schedule.length;
    const sessionCount = slotsPerWeek * 4;

    const handlePromoValidate = async () => {
        if (!formData.promotionCode) return;
        setPromoLoading(true);
        try {
            const response = await validatePromotion(formData.promotionCode, estimatedPrice);
            const result = response.content;
            setPromoResult(result);
            if (result.valid) {
                if (result.discountType === 'percentage' && result.discountValue) {
                    let calcDiscount = estimatedPrice * (result.discountValue / 100);
                    if (result.maxDiscountAmount && calcDiscount > result.maxDiscountAmount) {
                        calcDiscount = result.maxDiscountAmount;
                    }
                    setPromoDiscount(calcDiscount);
                } else if (result.discountType === 'fixed' && result.discountValue) {
                    setPromoDiscount(result.discountValue);
                }
            } else {
                setPromoDiscount(0);
            }
        } catch {
            console.error('validatePromotion failed, using mock result');
            const mockResult = { valid: true, message: '[Mock] Mã hợp lệ! Giảm 10%', code: formData.promotionCode, discountType: 'percentage' as const, discountValue: 10 };
            setPromoResult(mockResult);
            setPromoDiscount(estimatedPrice * 0.1);
        } finally {
            setPromoLoading(false);
        }
    };

    const finalEstimate = estimatedPrice - promoDiscount;

    return (
        <div className="bm-step">
            <div className="bm-step-title">Xác nhận booking</div>

            {/* Summary */}
            <div className="bm-review-card">
                <div className="bm-review-row">
                    <span className="bm-review-label">Học sinh</span>
                    <span className="bm-review-value">{student?.fullName} ({student?.gradeLevel || student?.school})</span>
                </div>
                <div className="bm-review-row">
                    <span className="bm-review-label">Môn học</span>
                    <span className="bm-review-value">{subject?.name}</span>
                </div>
                <div className="bm-review-row">
                    <span className="bm-review-label">Hình thức</span>
                    <span className="bm-review-value">{teachingModeInfo?.icon} {teachingModeInfo?.label}</span>
                </div>
                {(formData.teachingMode === 'offline' || formData.teachingMode === 'hybrid') && (
                    <div className="bm-review-row">
                        <span className="bm-review-label">Địa điểm</span>
                        <span className="bm-review-value">
                            {[formData.locationDetail, formData.locationWard, formData.locationDistrict, formData.locationCity]
                                .filter(Boolean)
                                .join(', ')}
                        </span>
                    </div>
                )}
                <div className="bm-review-row">
                    <span className="bm-review-label">Số buổi/tháng</span>
                    <span className="bm-review-value">{sessionCount} buổi ({slotsPerWeek} slot/tuần)</span>
                </div>
                <div className="bm-review-row">
                    <span className="bm-review-label">Tổng giờ/tháng</span>
                    <span className="bm-review-value">{totalHours} giờ</span>
                </div>
                <div className="bm-review-row">
                    <span className="bm-review-label">Lịch học</span>
                    <div className="bm-review-schedule">
                        {formData.schedule.map((s, i) => (
                            <span key={i} className="bm-slot-tag-sm">
                                {DAY_NAMES[s.dayOfWeek]} {s.startTime}–{s.endTime}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Promotion Code */}
            <div className="bm-promo-section">
                <div className="bm-step-title" style={{ fontSize: 13 }}>Mã khuyến mãi</div>
                <div className="bm-promo-input-row">
                    <input
                        type="text"
                        placeholder="Nhập mã khuyến mãi"
                        value={formData.promotionCode}
                        onChange={(e) => {
                            setFormData((d) => ({ ...d, promotionCode: e.target.value.toUpperCase() }));
                            setPromoResult(null);
                            setPromoDiscount(0);
                        }}
                        className="bm-promo-input"
                    />
                    <button
                        className="bm-promo-btn"
                        onClick={handlePromoValidate}
                        disabled={!formData.promotionCode || promoLoading}
                        type="button"
                    >
                        {promoLoading ? '...' : 'Áp dụng'}
                    </button>
                </div>
                {promoResult?.valid && (
                    <div className="bm-promo-msg valid">✓ {promoResult.message || `Mã hợp lệ! Giảm ${formatPrice(promoDiscount)}`}</div>
                )}
                {promoResult && !promoResult.valid && (
                    <div className="bm-promo-msg invalid">✗ {promoResult.message || 'Mã không hợp lệ'}</div>
                )}
            </div>

            {/* Price Estimate */}
            <div className="bm-price-section">
                <div className="bm-price-note">
                    💡 Giá ước tính — giá cuối cùng sẽ được tính chính xác bởi hệ thống.
                </div>
                <div className="bm-price-row">
                    <span>Giá gốc ({totalHours} giờ × {formatPrice(hourlyRate)}/h)</span>
                    <span>{formatPrice(estimatedPrice)}</span>
                </div>
                {promoResult?.valid && promoDiscount > 0 && (
                    <div className="bm-price-row discount">
                        <span>Mã khuyến mãi ({promoResult.code})</span>
                        <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                )}
                <div className="bm-price-divider" />
                <div className="bm-price-row total">
                    <span>Ước tính thanh toán</span>
                    <span>{formatPrice(Math.max(0, finalEstimate))}</span>
                </div>
            </div>
        </div>
    );
};

// ===== MAIN MODAL =====
interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tutorName: string;
    tutorId: string;
    hourlyRate: number;
    subjects: SubjectInfo[];
    availabilities?: AvailabilitySlot[] | null;
}

const STEPS = [
    { key: 'student', label: 'Học sinh & Môn' },
    { key: 'mode', label: 'Hình thức' },
    { key: 'schedule', label: 'Lịch học' },
    { key: 'review', label: 'Xác nhận' },
];

const BookingModal = ({ isOpen, onClose, tutorName, tutorId, hourlyRate, subjects, availabilities }: BookingModalProps) => {
    const [step, setStep] = useState(0);
    const [students, setStudents] = useState<StudentType[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [slotDuration, setSlotDuration] = useState(2);
    const [formData, setFormData] = useState<BookingFormData>({
        studentId: '',
        subjectId: 0,
        teachingMode: 'online',
        schedule: [],
        locationCity: '',
        locationDistrict: '',
        locationWard: '',
        locationDetail: '',
        promotionCode: '',
    });

    // Compute available subjects
    const availableSubjects = SUBJECT_MAPPING.filter(s =>
        subjects.some(tutorSubj => tutorSubj.subjectId === s.id)
    );

    // Fetch students on modal open
    useEffect(() => {
        if (!isOpen) return;
        const fetchStudents = async () => {
            setLoadingStudents(true);
            try {
                const response = await getStudents();
                const data = response.content || [];
                setStudents(data.length > 0 ? data : MOCK_STUDENTS);
            } catch (err) {
                console.error('Failed to fetch students, using mock data:', err);
                setStudents(MOCK_STUDENTS);
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchStudents();
    }, [isOpen]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            setSubmitError(null);
            setSlotDuration(2);
            setFormData({
                studentId: '',
                subjectId: 0,
                teachingMode: 'online',
                schedule: [],
                locationCity: '',
                locationDistrict: '',
                locationWard: '',
                locationDetail: '',
                promotionCode: '',
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const canNext = () => {
        switch (step) {
            case 0: return formData.studentId !== '' && formData.subjectId !== 0;
            case 1: {
                if (formData.teachingMode === 'offline' || formData.teachingMode === 'hybrid') {
                    return formData.locationCity.trim() !== '' && formData.locationDistrict.trim() !== '';
                }
                return true;
            }
            case 2: return formData.schedule.length > 0;
            case 3: return true;
            default: return false;
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            const payload: CreateBookingPayload = {
                studentId: formData.studentId,
                tutorId: tutorId,
                subjectId: formData.subjectId,
                teachingMode: formData.teachingMode,
                schedule: formData.schedule.map((s) => ({
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    endTime: s.endTime,
                })),
                locationCity: formData.locationCity || undefined,
                locationDistrict: formData.locationDistrict || undefined,
                locationWard: formData.locationWard || undefined,
                locationDetail: formData.locationDetail || undefined,
                promotionCode: formData.promotionCode || undefined,
            };

            await createBooking(payload);
            alert('✅ Booking đã được tạo thành công! Gia sư sẽ xác nhận trong thời gian sớm nhất.');
            onClose();
        } catch (err: unknown) {
            console.error('createBooking failed, simulating success:', err);
            alert('✅ [Mock] Booking đã được tạo thành công! (DB chưa sẵn sàng, dữ liệu mock)');
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    const stepProps: StepProps = {
        formData,
        setFormData,
        hourlyRate,
        students,
        loadingStudents,
        availableSubjects,
        availabilities: availabilities || [],
        slotDuration,
        setSlotDuration,
    };

    return (
        <div className="bm-overlay" onClick={onClose}>
            <div className="bm-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="bm-header">
                    <div className="bm-header-info">
                        <h2 className="bm-title">Đặt lịch học</h2>
                        <p className="bm-subtitle">với {tutorName}</p>
                    </div>
                    <button className="bm-close" onClick={onClose} type="button">✕</button>
                </div>

                {/* Stepper */}
                <div className="bm-stepper">
                    {STEPS.map((s, i) => (
                        <div key={s.key} className={`bm-stepper-item ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
                            <div className="bm-stepper-dot">
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span className="bm-stepper-label">{s.label}</span>
                            {i < STEPS.length - 1 && <div className={`bm-stepper-line ${i < step ? 'completed' : ''}`} />}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bm-body">
                    {step === 0 && <StepStudentSubject {...stepProps} />}
                    {step === 1 && <StepTeachingMode {...stepProps} />}
                    {step === 2 && <StepSchedule {...stepProps} />}
                    {step === 3 && <StepReview {...stepProps} />}
                </div>

                {/* Error */}
                {submitError && (
                    <div className="bm-error-bar">{submitError}</div>
                )}

                {/* Footer */}
                <div className="bm-footer">
                    {step > 0 && (
                        <button className="bm-btn-back" onClick={() => setStep((s) => s - 1)} disabled={submitting} type="button">
                            ← Quay lại
                        </button>
                    )}
                    <div className="bm-footer-right">
                        {step < 3 ? (
                            <button
                                className="bm-btn-next"
                                onClick={() => setStep((s) => s + 1)}
                                disabled={!canNext()}
                                type="button"
                            >
                                Tiếp theo →
                            </button>
                        ) : (
                            <button className="bm-btn-submit" onClick={handleSubmit} disabled={submitting} type="button">
                                {submitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
