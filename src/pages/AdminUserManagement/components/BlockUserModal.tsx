import { useState } from 'react';
import { toast } from 'react-toastify';
import type { FlatUserDetail } from '../mockData';

interface BlockUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: FlatUserDetail | null;
    onBlock: (userId: string, reason: string) => Promise<void>;
}

const BlockUserModal = ({ isOpen, onClose, user, onBlock }: BlockUserModalProps) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleBlock = async () => {
        if (!user) return;

        // Validation
        if (reason.trim().length < 20) {
            setError('Lý do chặn phải có ít nhất 20 ký tự');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await onBlock(user.userid, reason);
            toast.success(`Đã chặn tài khoản ${user.fullname}`);
            onClose();
            // Reset form
            setReason('');
        } catch (err) {
            console.error('Error blocking user:', err);
            toast.error('Không thể chặn tài khoản. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when modal closes
    const handleClose = () => {
        setReason('');
        setError('');
        onClose();
    };

    if (!isOpen || !user) return null;

    return (
        <div className="vetting-modal-overlay" onClick={handleClose}>
            <div
                className="vetting-rejection-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '550px' }}
            >
                <h3 style={{ color: '#991b1b' }}>🚫 Chặn tài khoản người dùng</h3>
                <p style={{ marginBottom: '20px', color: '#475569' }}>
                    Hành động này sẽ chặn toàn bộ quyền truy cập của người dùng vào nền tảng. Vui lòng cung cấp lý do
                    rõ ràng. Người dùng sẽ nhận được thông báo này.
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
                                {user.primaryrole === 'tutor' ? 'Gia sư' : 'Học viên'} • {user.email}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                        <div>
                            <p style={{ margin: '0 0 4px', color: '#64748b', fontWeight: 600 }}>Mã người dùng</p>
                            <p style={{ margin: 0, fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-navy)' }}>
                                {user.userid}
                            </p>
                        </div>
                        <div>
                            <p style={{ margin: '0 0 4px', color: '#64748b', fontWeight: 600 }}>Số cảnh cáo hiện tại</p>
                            <p style={{ margin: 0, fontWeight: 700, color: '#991b1b' }}>
                                {user.warningcount} cảnh cáo
                            </p>
                        </div>
                    </div>
                </div>

                {/* Warning Message */}
                <div
                    style={{
                        background: '#fef3c7',
                        border: '1px solid #fde68a',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '20px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                    }}
                >
                    <span className="material-symbols-outlined" style={{ color: '#92400e', fontSize: '20px' }}>
                        info
                    </span>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#92400e' }}>
                            Lưu ý quan trọng
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#854d0e' }}>
                            Người dùng bị chặn sẽ không thể đăng nhập, đặt lớp, hoặc nhận thanh toán. Hành động này có
                            thể được hoàn tác sau.
                        </p>
                    </div>
                </div>

                {/* Reason Input */}
                <div>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#64748b',
                            marginBottom: '8px',
                        }}
                    >
                        Lý do chặn (tối thiểu 20 ký tự) *
                    </label>
                    <textarea
                        className="vetting-rejection-textarea"
                        rows={5}
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError('');
                        }}
                        placeholder="Ví dụ: Vi phạm nghiêm trọng quy định nền tảng nhiều lần, không tuân thủ cảnh cáo. Đã có 3 khiếu nại từ học viên về thái độ và hủy buổi học đột ngột."
                        style={{ borderColor: error ? '#dc2626' : '#e2e8f0' }}
                    />
                    {error && <p className="vetting-error-message">{error}</p>}
                </div>

                {/* Common Reasons (Quick Select) */}
                <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                        Lý do phổ biến:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {[
                            'Vi phạm quy định nền tảng nhiều lần',
                            'Lừa đảo hoặc gian lận',
                            'Hành vi quấy rối hoặc lạm dụng',
                            'Tài khoản giả mạo hoặc spam',
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
                        onClick={handleBlock}
                        disabled={isSubmitting || reason.trim().length < 20}
                        style={{ opacity: reason.trim().length < 20 ? 0.5 : 1 }}
                    >
                        {isSubmitting ? 'Đang xử lý...' : '🚫 Xác nhận chặn'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockUserModal;
