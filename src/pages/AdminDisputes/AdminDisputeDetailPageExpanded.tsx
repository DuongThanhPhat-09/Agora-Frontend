import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import IssueWarningModal from './components/IssueWarningModal';
import SuspendTutorModal from './components/SuspendTutorModal';
import LockAccountConfirmDialog from './components/LockAccountConfirmDialog';
import {
    mockGetDisputeDetail,
    mockResolveDispute,
    mockIssueWarning,
    mockSuspendTutor,
    mockLockAccount,
} from './mockData';
import type { DisputeDetail } from '../../types/admin.types';
import { formatCurrency, formatDateTime, formatRelativeTime, formatDisputeType } from '../../utils/formatters';

import '../../styles/pages/admin-dashboard.css';
import '../../styles/pages/admin-dispute-detail.css';

const AdminDisputeDetailPageExpanded = () => {
    const { disputeId } = useParams<{ disputeId: string }>();

    // State management
    const [disputeDetail, setDisputeDetail] = useState<DisputeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Tab states
    const [activeTab, setActiveTab] = useState('evidence');
    const [verdict, setVerdict] = useState('refund_100');
    const [adminNotes, setAdminNotes] = useState('');

    // Modal states
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);

    // Submitting state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch dispute detail
    useEffect(() => {
        if (disputeId) {
            fetchDisputeDetail(disputeId);
        }
    }, [disputeId]);

    const fetchDisputeDetail = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await mockGetDisputeDetail(id);
            setDisputeDetail(data);
        } catch (err) {
            console.error('Error fetching dispute detail:', err);
            setError('Không thể tải chi tiết khiếu nại');
        } finally {
            setLoading(false);
        }
    };

    const handleResolveDispute = async () => {
        if (!disputeDetail) return;

        if (adminNotes.trim().length < 20) {
            toast.error('Ghi chú phải có ít nhất 20 ký tự');
            return;
        }

        try {
            setIsSubmitting(true);
            await mockResolveDispute(disputeDetail.disputeid, verdict, adminNotes);
            toast.success('Đã giải quyết khiếu nại thành công!');
            // Refresh data
            await fetchDisputeDetail(disputeDetail.disputeid);
        } catch (err) {
            console.error('Error resolving dispute:', err);
            toast.error('Không thể giải quyết khiếu nại');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Parse evidence files
    const parseEvidenceFiles = (jsonString: string | null) => {
        if (!jsonString) return [];
        try {
            return JSON.parse(jsonString);
        } catch {
            return [];
        }
    };

    const parseScreenshots = (jsonString: string | null): string[] => {
        if (!jsonString) return [];
        try {
            return JSON.parse(jsonString);
        } catch {
            return [];
        }
    };

    if (loading) {
        return (
            <main className="admin-main">
                <div className="dispute-detail-content">
                    <p>Đang tải chi tiết khiếu nại...</p>
                </div>
            </main>
        );
    }

    if (error || !disputeDetail) {
        return (
            <main className="admin-main">
                <div className="dispute-detail-content">
                    <p style={{ color: '#dc2626' }}>{error || 'Không tìm thấy khiếu nại'}</p>
                </div>
            </main>
        );
    }

    const evidenceFiles = parseEvidenceFiles(disputeDetail.evidencefiles);
    const screenshots = parseScreenshots(disputeDetail.screenshots);
    const booking = disputeDetail.bookingcontext;
    const lesson = disputeDetail.lessoncontext;
    const warnings = disputeDetail.tutorwarnings || [];

    return (
        <>
            <main className="admin-main">
                {/* Header */}
                <header className="dispute-detail-header">
                    <div className="dispute-detail-header-inner">
                        <div className="dispute-detail-top-row">
                            <div className="dispute-header-content">
                                <div className="dispute-breadcrumbs">
                                    <span className="dispute-breadcrumb-item">Giải quyết khiếu nại</span>
                                    <span style={{ color: '#81786a' }}>•</span>
                                    <span className="dispute-breadcrumb-item">Hồ sơ #{disputeDetail.disputeid}</span>
                                </div>
                                <h1 className="dispute-detail-title">
                                    Hồ sơ #{disputeDetail.disputeid}: {formatDisputeType(disputeDetail.disputetype)}
                                </h1>
                                <div className="dispute-detail-meta">
                                    <span>Tạo {formatRelativeTime(disputeDetail.createdat)}</span>
                                    <span>•</span>
                                    <span>Ưu tiên {disputeDetail.priority === 'high' ? 'cao' : disputeDetail.priority === 'medium' ? 'trung bình' : 'thấp'}</span>
                                    <span>•</span>
                                    <span className="dispute-action-required">
                                        {disputeDetail.status === 'pending' ? 'Cần xử lý' : disputeDetail.status === 'investigating' ? 'Đang điều tra' : 'Đã giải quyết'}
                                    </span>
                                </div>
                            </div>
                            <div className="dispute-detail-actions">
                                <div className="dispute-live-status">
                                    <div className="dispute-pulse-dot"></div>
                                    Đang xem xét trực tiếp
                                </div>
                                <div className="dispute-escrow-badge">
                                    Tiền giữ: {formatCurrency(disputeDetail.escrowamount)}
                                </div>
                            </div>
                        </div>

                        {/* Admin Action Buttons */}
                        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                            <button
                                className="vetting-btn vetting-btn-secondary"
                                onClick={() => setIsWarningModalOpen(true)}
                                style={{ fontSize: '13px', padding: '8px 16px' }}
                            >
                                ⚠️ Gửi cảnh báo
                            </button>
                            <button
                                className="vetting-btn vetting-btn-secondary"
                                onClick={() => setIsSuspendModalOpen(true)}
                                style={{ fontSize: '13px', padding: '8px 16px' }}
                            >
                                🚫 Đình chỉ hồ sơ
                            </button>
                            <button
                                className="vetting-btn vetting-btn-danger"
                                onClick={() => setIsLockModalOpen(true)}
                                style={{ fontSize: '13px', padding: '8px 16px' }}
                            >
                                🔒 Khóa tài khoản
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="dispute-detail-content">
                    <div className="dispute-detail-container">
                        <div className="dispute-grid">
                            {/* LEFT COLUMN: Parties + Booking + Lesson + Warnings */}
                            <div className="dispute-col-left">
                                {/* Plaintiff Card */}
                                <div className="dispute-party-card">
                                    <div className="dispute-border-indicator dispute-indicator-blue"></div>
                                    <div className="dispute-party-header">
                                        <span className="dispute-role-badge dispute-role-plaintiff">Nguyên đơn</span>
                                        <span className="material-symbols-outlined dispute-party-icon dispute-icon-blue">person</span>
                                    </div>
                                    <div className="dispute-party-info">
                                        <div
                                            className="dispute-party-avatar"
                                            style={{ backgroundImage: `url('${booking.studentavatar}')` }}
                                        ></div>
                                        <div>
                                            <h3 className="dispute-party-name">{booking.studentname}</h3>
                                            <p className="dispute-party-id">ID: {booking.studentid}</p>
                                        </div>
                                    </div>
                                    <div className="dispute-party-stats" style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
                                        Tham gia: {formatDateTime(booking.studentjoinedat)}
                                    </div>
                                </div>

                                {/* Arrow Connector */}
                                <div className="dispute-connector">
                                    <span className="material-symbols-outlined dispute-connector-icon">arrow_downward</span>
                                </div>

                                {/* Defendant Card */}
                                <div className="dispute-party-card">
                                    <div className="dispute-border-indicator dispute-indicator-orange"></div>
                                    <div className="dispute-party-header">
                                        <span className="dispute-role-badge dispute-role-defendant">Bị đơn</span>
                                        <span className="material-symbols-outlined dispute-party-icon dispute-icon-orange">school</span>
                                    </div>
                                    <div className="dispute-party-info">
                                        <div
                                            className="dispute-party-avatar"
                                            style={{ backgroundImage: `url('${booking.tutoravatar}')` }}
                                        ></div>
                                        <div>
                                            <h3 className="dispute-party-name">{booking.tutorname}</h3>
                                            <p className="dispute-party-id">ID: {booking.tutorid}</p>
                                        </div>
                                    </div>
                                    <div className="dispute-party-details">
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Môn học</span>
                                            <span className="dispute-stat-bold">{booking.subjectname} - {booking.gradelevel}</span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Đánh giá</span>
                                            <span className="dispute-stat-green">⭐ {booking.tutorrating} ({booking.tutortotalclasses} buổi)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Info Section */}
                                <div className="dispute-party-card" style={{ marginTop: '24px' }}>
                                    <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
                                        📅 Thông tin đặt buổi học
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Mã đặt buổi</span>
                                            <span className="dispute-stat-bold">{booking.bookingid}</span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Ngày học</span>
                                            <span className="dispute-stat-bold">{formatDateTime(booking.scheduleddate)}</span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Thời lượng</span>
                                            <span className="dispute-stat-bold">{booking.durationminutes} phút</span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Tổng tiền</span>
                                            <span className="dispute-stat-bold" style={{ color: 'var(--color-gold)' }}>
                                                {formatCurrency(booking.totalprice)}
                                            </span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Trạng thái</span>
                                            <span className="vetting-badge pending">{booking.bookingstatus}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lesson Info Section */}
                                <div className="dispute-party-card">
                                    <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
                                        🎓 Thông tin buổi học
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Mã buổi học</span>
                                            <span className="dispute-stat-bold">{lesson.lessonid}</span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Thời gian dự kiến</span>
                                            <span className="dispute-stat-bold" style={{ fontSize: '13px' }}>
                                                {formatDateTime(lesson.scheduledstarttime)} - {formatDateTime(lesson.scheduledendtime)}
                                            </span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Thời gian thực tế</span>
                                            <span className="dispute-stat-bold">
                                                {lesson.actualstarttime ? formatDateTime(lesson.actualstarttime) : 'Không bắt đầu'}
                                            </span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Điểm danh gia sư</span>
                                            <span className={lesson.tutorarrived ? 'dispute-stat-green' : 'dispute-stat-bold'} style={{ color: lesson.tutorarrived ? '#166534' : '#dc2626' }}>
                                                {lesson.tutorarrived ? '✓ Có mặt' : '✗ Vắng mặt'}
                                            </span>
                                        </div>
                                        <div className="dispute-stat-row">
                                            <span style={{ color: '#81786a' }}>Điểm danh học viên</span>
                                            <span className={lesson.studentarrived ? 'dispute-stat-green' : 'dispute-stat-bold'} style={{ color: lesson.studentarrived ? '#166534' : '#dc2626' }}>
                                                {lesson.studentarrived ? '✓ Có mặt' : '✗ Vắng mặt'}
                                            </span>
                                        </div>
                                        {lesson.studentwaitedminutes !== undefined && lesson.studentwaitedminutes > 0 && (
                                            <div className="dispute-stat-row">
                                                <span style={{ color: '#81786a' }}>Thời gian chờ</span>
                                                <span className="dispute-stat-bold" style={{ color: '#ea580c' }}>
                                                    {lesson.studentwaitedminutes} phút
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tutor Warnings History */}
                                {warnings.length > 0 && (
                                    <div className="dispute-party-card">
                                        <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>
                                            ⚠️ Lịch sử cảnh báo ({warnings.length})
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {warnings.map((warning) => (
                                                <div
                                                    key={warning.warningid}
                                                    style={{
                                                        padding: '12px',
                                                        background: warning.severity === 'high' ? '#fee2e2' : warning.severity === 'medium' ? '#fef3c7' : '#f1f5f9',
                                                        borderRadius: '8px',
                                                        fontSize: '13px',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span style={{ fontWeight: 700, color: warning.severity === 'high' ? '#991b1b' : warning.severity === 'medium' ? '#92400e' : '#475569' }}>
                                                            {warning.severity === 'high' ? '🔴 Cao' : warning.severity === 'medium' ? '🟡 Trung bình' : '🟢 Thấp'}
                                                        </span>
                                                        <span style={{ color: '#64748b' }}>{formatRelativeTime(warning.issuedat)}</span>
                                                    </div>
                                                    <p style={{ margin: '0 0 6px', color: '#1e293b' }}>{warning.reason}</p>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                        Bởi: {warning.issuedby}
                                                        {warning.relatedbookingid && ` • Booking: ${warning.relatedbookingid}`}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Claim Summary */}
                                <div className="dispute-claim-summary">
                                    <h4 className="dispute-claim-label">Nội dung khiếu nại</h4>
                                    <p className="dispute-claim-text">"{disputeDetail.description}"</p>
                                </div>
                            </div>

                            {/* CENTER COLUMN: Evidence */}
                            <div className="dispute-col-center">
                                {/* Tabs */}
                                <div className="dispute-evidence-tabs">
                                    <button
                                        className={`dispute-evidence-tab ${activeTab === 'evidence' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('evidence')}
                                    >
                                        <span className="material-symbols-outlined dispute-evidence-tab-icon">folder</span>
                                        Bằng chứng ({evidenceFiles.length + screenshots.length})
                                    </button>
                                    <button
                                        className={`dispute-evidence-tab ${activeTab === 'chat' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('chat')}
                                    >
                                        <span className="material-symbols-outlined dispute-evidence-tab-icon">chat</span>
                                        Nhật ký chat
                                    </button>
                                </div>

                                {/* Evidence Gallery */}
                                {activeTab === 'evidence' && (
                                    <div className="dispute-chat-area">
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 20px' }}>
                                            📂 Tài liệu bằng chứng
                                        </h3>

                                        {/* Screenshots */}
                                        {screenshots.length > 0 && (
                                            <div style={{ marginBottom: '24px' }}>
                                                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>
                                                    Ảnh chụp màn hình ({screenshots.length})
                                                </h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                                    {screenshots.map((url, idx) => (
                                                        <div key={idx} style={{ position: 'relative', paddingBottom: '75%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                                                            <img
                                                                src={url}
                                                                alt={`Screenshot ${idx + 1}`}
                                                                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                                onClick={() => window.open(url, '_blank')}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Evidence Files */}
                                        {evidenceFiles.length > 0 && (
                                            <div>
                                                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>
                                                    Tệp tin đính kèm ({evidenceFiles.length})
                                                </h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {evidenceFiles.map((file: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                padding: '16px',
                                                                background: '#f8fafc',
                                                                borderRadius: '8px',
                                                                border: '1px solid #e2e8f0',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '12px',
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748b' }}>
                                                                {file.filetype.startsWith('image/') ? 'image' : 'description'}
                                                            </span>
                                                            <div style={{ flex: 1 }}>
                                                                <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--color-navy)' }}>{file.filename}</p>
                                                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                                                                    {(file.filesize / 1024).toFixed(1)} KB • {formatDateTime(file.uploadedat)}
                                                                </p>
                                                            </div>
                                                            <a
                                                                href={file.fileurl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    background: 'var(--color-gold)',
                                                                    color: 'var(--color-navy)',
                                                                    borderRadius: '6px',
                                                                    textDecoration: 'none',
                                                                    fontSize: '13px',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                Xem
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {evidenceFiles.length === 0 && screenshots.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}>
                                                    folder_off
                                                </span>
                                                <p>Không có bằng chứng nào được gửi</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Chat Log (existing) */}
                                {activeTab === 'chat' && (
                                    <div className="dispute-chat-area">
                                        <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                            Tính năng nhật ký chat sẽ được tích hợp sau
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Verdict */}
                            <div className="dispute-col-right">
                                <div className="dispute-verdict-card">
                                    <div className="dispute-verdict-header">
                                        <h2 className="dispute-verdict-title">
                                            <span className="material-symbols-outlined">gavel</span>
                                            Phán quyết của Quản trị viên
                                        </h2>
                                        <p className="dispute-verdict-subtitle">Xem xét bằng chứng và đưa ra quyết định cuối cùng.</p>
                                    </div>

                                    <div className="dispute-verdict-form">
                                        <div className="dispute-options-group">
                                            {/* 5 Resolution Options */}
                                            <label className="dispute-radio-label">
                                                <input
                                                    type="radio"
                                                    name="verdict"
                                                    className="dispute-radio-input"
                                                    checked={verdict === 'refund_100'}
                                                    onChange={() => setVerdict('refund_100')}
                                                />
                                                <div className="dispute-radio-content">
                                                    <span className="dispute-radio-title">Hoàn tiền 100% cho Học viên</span>
                                                    <span className="dispute-radio-desc">Hoàn lại {formatCurrency(disputeDetail.escrowamount)} về nguồn</span>
                                                </div>
                                            </label>

                                            <label className="dispute-radio-label">
                                                <input
                                                    type="radio"
                                                    name="verdict"
                                                    className="dispute-radio-input"
                                                    checked={verdict === 'refund_50'}
                                                    onChange={() => setVerdict('refund_50')}
                                                />
                                                <div className="dispute-radio-content">
                                                    <span className="dispute-radio-title">Hoàn tiền 50% cho Học viên</span>
                                                    <span className="dispute-radio-desc">Hoàn {formatCurrency(disputeDetail.escrowamount / 2)}</span>
                                                </div>
                                            </label>

                                            <label className="dispute-radio-label">
                                                <input
                                                    type="radio"
                                                    name="verdict"
                                                    className="dispute-radio-input"
                                                    checked={verdict === 'release'}
                                                    onChange={() => setVerdict('release')}
                                                />
                                                <div className="dispute-radio-content">
                                                    <span className="dispute-radio-title">Chuyển tiền cho Gia sư</span>
                                                    <span className="dispute-radio-desc">Chuyển {formatCurrency(disputeDetail.escrowamount)} cho {booking.tutorname}</span>
                                                </div>
                                            </label>

                                            <label className="dispute-radio-label">
                                                <input
                                                    type="radio"
                                                    name="verdict"
                                                    className="dispute-radio-input"
                                                    checked={verdict === 'free_credit'}
                                                    onChange={() => setVerdict('free_credit')}
                                                />
                                                <div className="dispute-radio-content">
                                                    <span className="dispute-radio-title">Tặng Buổi học Miễn phí</span>
                                                    <span className="dispute-radio-desc">Học viên nhận credit miễn phí</span>
                                                </div>
                                            </label>

                                            <label className="dispute-radio-label">
                                                <input
                                                    type="radio"
                                                    name="verdict"
                                                    className="dispute-radio-input"
                                                    checked={verdict === 'makeup'}
                                                    onChange={() => setVerdict('makeup')}
                                                />
                                                <div className="dispute-radio-content">
                                                    <span className="dispute-radio-title">Sắp xếp Buổi học Bù</span>
                                                    <span className="dispute-radio-desc">Gia sư phải tổ chức buổi học bù</span>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="dispute-reasoning-group">
                                            <span className="dispute-label">Ghi chú của Admin (tối thiểu 20 ký tự)</span>
                                            <textarea
                                                className="dispute-textarea"
                                                placeholder="Vui lòng trích dẫn bằng chứng cụ thể và giải thích quyết định..."
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                rows={5}
                                            ></textarea>
                                        </div>

                                        <button
                                            className="dispute-submit-btn"
                                            onClick={handleResolveDispute}
                                            disabled={isSubmitting || adminNotes.trim().length < 20}
                                            style={{ opacity: adminNotes.trim().length < 20 ? 0.5 : 1 }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>check_circle</span>
                                            {isSubmitting ? 'Đang xử lý...' : 'Thực thi quyết định'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Admin Action Modals */}
            <IssueWarningModal
                isOpen={isWarningModalOpen}
                onClose={() => setIsWarningModalOpen(false)}
                tutorId={booking.tutorid}
                tutorName={booking.tutorname}
                disputeId={disputeDetail.disputeid}
                onIssueWarning={mockIssueWarning}
            />

            <SuspendTutorModal
                isOpen={isSuspendModalOpen}
                onClose={() => setIsSuspendModalOpen(false)}
                tutorId={booking.tutorid}
                tutorName={booking.tutorname}
                onSuspend={mockSuspendTutor}
            />

            <LockAccountConfirmDialog
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                userId={booking.tutorid}
                userName={booking.tutorname}
                onLockAccount={mockLockAccount}
            />
        </>
    );
};

export default AdminDisputeDetailPageExpanded;
