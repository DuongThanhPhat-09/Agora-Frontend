import { useState } from 'react';
import { toast } from 'react-toastify';
import type { UserDetail } from '../../../types/admin.types';

interface SuspendUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserDetail | null;
    onSuspend: (userId: string, reason: string, durationDays: number) => Promise<void>;
}

const SuspendUserModal = ({ isOpen, onClose, user, onSuspend }: SuspendUserModalProps) => {
    const [reason, setReason] = useState('');
    const [durationDays, setDurationDays] = useState(7);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSuspend = async () => {
        if (!user) return;

        // Validation
        if (reason.trim().length < 15) {
            setError('Lý do tạm ngưng phải có ít nhất 15 ký tự');
            return;
        }

        if (durationDays < 1 || durationDays > 365) {
            setError('Thời gian tạm ngưng phải từ 1 đến 365 ngày');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await onSuspend(user.userid, reason, durationDays);
            toast.success(`Đã tạm ngưng hồ sơ ${user.fullname} trong ${durationDays} ngày`);
            onClose();
            // Reset form
            setReason('');
            setDurationDays(7);
        } catch (err) {
            console.error('Error suspending user:', err);
            toast.error('Không thể tạm ngưng hồ sơ. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when modal closes
    const handleClose = () => {
        setReason('');
        setDurationDays(7);
        setError('');
        onClose();
    };

    if (!isOpen || !user) return null;

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    return (
        <div className="vetting-modal-overlay" onClick={handleClose}>
            <div
                className="vetting-rejection-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '550px' }}
            >
                <h3 style={{ color: '#991b1b' }}>🚫 Tạm ngưng hồ sơ gia sư</h3>
                <p style={{ marginBottom: '20px', color: '#475569' }}>
                    Tạm ngưng sẽ không cho phép gia sư nhận buổi học mới. Các buổi học đã đặt vẫn được duy trì. Gia sư
                    sẽ nhận được thông báo với lý do cụ thể.
                </p>

                {/* User Summary */}
                <div
                    style={{
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundImage: `url('${user.avatarurl}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        ></div>
                        <div>
                            <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'var(--color-navy)' }}>
                                {user.fullname}
                            </p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                                Gia sư • {user.warningcount} cảnh cáo • {user.suspensioncount} lần tạm ngưng
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            background: '#fef3c7',
                            border: '1px solid #fde68a',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                                Ngày kết thúc tạm ngưng
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#78350f' }}>
                                {endDate.toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                                Thời gian
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#78350f' }}>
                                {durationDays} ngày
                            </p>
                        </div>
                    </div>
                </div>

                {/* Duration Picker */}
                <div style={{ marginBottom: '20px' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#64748b',
                            marginBottom: '8px',
                        }}
                    >
                        Thời gian tạm ngưng (ngày) *
                    </label>

                    {/* Quick Select Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        {[3, 7, 14, 30, 60, 90].map((days) => (
                            <button
                                key={days}
                                onClick={() => setDurationDays(days)}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    border: durationDays === days ? '2px solid #dc2626' : '2px solid #e2e8f0',
                                    borderRadius: '6px',
                                    background: durationDays === days ? '#fee2e2' : '#ffffff',
                                    color: durationDays === days ? '#991b1b' : '#64748b',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {days}d
                            </button>
                        ))}
                    </div>

                    {/* Custom Input */}
                    <input
                        type="number"
                        min="1"
                        max="365"
                        value={durationDays}
                        onChange={(e) => setDurationDays(parseInt(e.target.value) || 7)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px',
                        }}
                    />
                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>
                        Nhập số ngày từ 1 đến 365
                    </p>
                </div>

                {/* Reason Input */}
                <div style={{ marginBottom: '16px' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#64748b',
                            marginBottom: '8px',
                        }}
                    >
                        Lý do tạm ngưng (tối thiểu 15 ký tự) *
                    </label>
                    <textarea
                        className="vetting-rejection-textarea"
                        rows={5}
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError('');
                        }}
                        placeholder="Ví dụ: Vi phạm quy định nền tảng về hủy buổi học nhiều lần trong tháng. Đã có 2 cảnh cáo trước đó nhưng tình trạng vẫn tiếp diễn."
                        style={{ borderColor: error ? '#dc2626' : '#e2e8f0' }}
                    />
                    {error && <p className="vetting-error-message">{error}</p>}
                </div>

                {/* Common Reasons */}
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                        Lý do phổ biến:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {[
                            'Vi phạm quy định nền tảng nhiều lần',
                            'Cảnh cáo không hiệu quả, tiếp tục vi phạm',
                            'Khiếu nại từ nhiều học viên',
                            'Cần thời gian xem xét vụ việc',
                        ].map((commonReason) => (
                            <button
                                key={commonReason}
                                onClick={() => setReason(commonReason)}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    background: '#ffffff',
                                    color: '#475569',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#ffffff';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                            >
                                {commonReason}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Box */}
                <div
                    style={{
                        background: '#dbeafe',
                        border: '1px solid #93c5fd',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '20px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                    }}
                >
                    <span className="material-symbols-outlined" style={{ color: '#1e40af', fontSize: '20px' }}>
                        info
                    </span>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>
                            Lưu ý
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1e3a8a' }}>
                            Gia sư sẽ tự động được kích hoạt lại sau khi hết thời hạn tạm ngưng. Gia sư không thể rút
                            tiền trong thời gian bị tạm ngưng.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="vetting-rejection-footer">
                    <button
                        className="vetting-btn vetting-btn-secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        className="vetting-btn vetting-btn-danger"
                        onClick={handleSuspend}
                        disabled={isSubmitting || reason.trim().length < 15 || durationDays < 1}
                        style={{ opacity: reason.trim().length < 15 || durationDays < 1 ? 0.5 : 1 }}
                    >
                        {isSubmitting ? 'Đang xử lý...' : '🚫 Xác nhận tạm ngưng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuspendUserModal;
