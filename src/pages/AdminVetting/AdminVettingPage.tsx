import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Spin } from 'antd';
import { getPendingTutors, updateTutorApproval } from '../../services/admin.service';
import TutorDetailModal from './components/TutorDetailModal';
import type { PendingTutorFromAPI } from '../../types/admin.types';
import '../../styles/pages/admin-dashboard.css';
import '../../styles/pages/admin-vetting.css';

const AdminVettingPage = () => {
    // State management
    const [tutors, setTutors] = useState<PendingTutorFromAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTutor, setSelectedTutor] = useState<PendingTutorFromAPI | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

    // Fetch pending tutors on mount
    useEffect(() => {
        fetchPendingTutors();
    }, []);

    const fetchPendingTutors = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPendingTutors(1, 50);
            setTutors(response.content || []);
        } catch (err: any) {
            console.error('Error fetching pending tutors:', err);

            // Phân biệt loại lỗi để hiển thị message rõ ràng
            if (err?.response?.status === 401) {
                setError('⚠️ Bạn cần đăng nhập với quyền Admin để xem danh sách này.');
            } else if (err?.response?.status === 403) {
                setError('🚫 Bạn không có quyền truy cập trang này.');
            } else if (err?.response?.status === 404) {
                // 404 = endpoint không tồn tại hoặc không có data
                setError(null); // Không hiển thị lỗi, để empty state xử lý
                setTutors([]);
            } else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
                setError('⏱️ Yêu cầu quá lâu. Vui lòng kiểm tra kết nối mạng.');
            } else if (err?.code === 'ERR_NETWORK') {
                setError('📡 Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
            } else {
                setError('❌ Không thể tải danh sách gia sư. Vui lòng thử lại sau.');
            }

            setTutors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (tutorId: string) => {
        try {
            setActionLoading(tutorId);
            await updateTutorApproval(tutorId, true);
            toast.success('Phê duyệt gia sư thành công!');
            setSelectedTutor(null);
            await fetchPendingTutors();
        } catch (err) {
            console.error('Error approving tutor:', err);
            toast.error('Không thể phê duyệt gia sư. Vui lòng thử lại.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleOpenRejectModal = (tutorId: string) => {
        setShowRejectModal(tutorId);
        setRejectionNote('');
    };

    const handleReject = async () => {
        if (!showRejectModal) return;
        if (rejectionNote.trim().length < 20) {
            toast.error('Lý do từ chối phải có ít nhất 20 ký tự.');
            return;
        }

        try {
            setActionLoading(showRejectModal);
            await updateTutorApproval(showRejectModal, false, rejectionNote);
            toast.success('Đã từ chối hồ sơ gia sư.');
            setShowRejectModal(null);
            setRejectionNote('');
            setSelectedTutor(null);
            await fetchPendingTutors();
        } catch (err) {
            console.error('Error rejecting tutor:', err);
            toast.error('Không thể từ chối hồ sơ. Vui lòng thử lại.');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) {
            return 'Vừa xong';
        } else if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        } else if (diffDays < 7) {
            return `${diffDays} ngày trước`;
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    };

    const formatCurrency = (amount: number | null): string => {
        if (!amount) return '—';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <div className="admin-vetting-page">
            {/* Main Content */}
            <main className="admin-main">
                {/* Header */}
                <header className="vetting-header">
                    <div className="vetting-breadcrumb">
                        <nav className="vetting-breadcrumb-nav">
                            <a href="#" className="vetting-breadcrumb-link">Trang chủ</a>
                            <span className="material-symbols-outlined vetting-breadcrumb-icon">chevron_right</span>
                            <span className="vetting-breadcrumb-current">Yêu cầu kiểm duyệt</span>
                        </nav>
                    </div>

                    <div className="vetting-header-actions">
                        {/* Search Bar */}
                        <div className="vetting-search-wrapper">
                            <span className="material-symbols-outlined vetting-search-icon">search</span>
                            <input
                                type="text"
                                className="vetting-search-input"
                                placeholder="Tìm kiếm yêu cầu..."
                            />
                        </div>

                        {/* User Section */}
                        <div className="vetting-header-user-section">
                            <button className="vetting-notification-btn">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="vetting-notification-badge"></span>
                            </button>

                            <div className="vetting-user-info-section">
                                <div className="vetting-user-text">
                                    <p className="vetting-user-name">Người quản trị</p>
                                    <p className="vetting-user-role">Quản trị viên cấp cao</p>
                                </div>
                                <div
                                    className="vetting-user-avatar"
                                    style={{
                                        backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuC-1RYfhalme733ZIn0tVRsiVY1817QURk7Tim5L85zB5bjBlGJ21emi8NFsm-9l5Z6hqh3440-iC35rtBZWIzcZk7DTLRCaKUCWi7ViBxoyoF8_YRUuYEjxWKsiO4PADl1W2NYdGrvOD3oenvyOVGW-TwbGB_PMvjYXpY09T7qT8OjD7ho64QWEwK79AphbmemPpZ9u6L_TTz0MZC2il-73WMLGSYRA0L6hyWJSFgdBpSNEfKEaMX1GqP4fUC4IDs1RvA88u462hw)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="vetting-content">
                    <div className="vetting-content-inner">
                        {/* Page Header */}
                        <div className="vetting-page-header">
                            <div className="vetting-page-title-section">
                                <h2 className="vetting-page-title">Hàng đợi xác minh gia sư</h2>
                                <p className="vetting-page-subtitle">Xem xét và quản lý các đơn đăng ký gia sư.</p>
                            </div>

                            <div className="vetting-actions">
                                <button className="vetting-btn vetting-btn-outline" onClick={fetchPendingTutors}>
                                    <span className="material-symbols-outlined vetting-btn-icon">refresh</span>
                                    Làm mới
                                </button>
                                <button className="vetting-btn vetting-btn-primary">
                                    <span className="material-symbols-outlined vetting-btn-icon">download</span>
                                    Xuất CSV
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="vetting-tabs">
                            <div className="vetting-tabs-nav">
                                <button className="vetting-tab vetting-tab-active">
                                    Đang chờ
                                    <span className="vetting-tab-count">{tutors.length}</span>
                                </button>
                                <button className="vetting-tab">
                                    Đã duyệt
                                </button>
                                <button className="vetting-tab">
                                    Đã từ chối
                                </button>
                            </div>
                        </div>

                        {/* Table Card */}
                        <div className="vetting-table-card">
                            {/* Loading State */}
                            {loading && (
                                <div className="vetting-loading-state">
                                    <Spin size="large" tip="Đang tải danh sách gia sư...">
                                        <div style={{ padding: '50px' }} />
                                    </Spin>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="vetting-error-state">
                                    <span className="material-symbols-outlined vetting-state-icon">error</span>
                                    <p>{error}</p>
                                    <button className="vetting-btn vetting-btn-primary" onClick={fetchPendingTutors}>
                                        Thử lại
                                    </button>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && tutors.length === 0 && (
                                <div className="vetting-empty-state">
                                    <span className="material-symbols-outlined vetting-state-icon">check_circle</span>
                                    <p>Không có gia sư nào đang chờ duyệt</p>
                                </div>
                            )}

                            {/* Table with Data */}
                            {!loading && !error && tutors.length > 0 && (
                                <div className="vetting-table-wrapper">
                                    <table className="vetting-table">
                                        <thead className="vetting-table-head">
                                            <tr>
                                                <th className="vetting-table-th">Thông tin gia sư</th>
                                                <th className="vetting-table-th">Tiêu đề</th>
                                                <th className="vetting-table-th">Giá/giờ</th>
                                                <th className="vetting-table-th">Đã nộp</th>
                                                <th className="vetting-table-th">Trạng thái</th>
                                                <th className="vetting-table-th">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="vetting-table-body">
                                            {tutors.map((tutor) => (
                                                <tr key={tutor.userid} className="vetting-table-row">
                                                    <td className="vetting-table-td">
                                                        <div className="vetting-tutor-info">
                                                            <div
                                                                className="vetting-tutor-avatar"
                                                                style={{ backgroundImage: `url(${tutor.avatarurl || 'https://via.placeholder.com/40'})` }}
                                                            ></div>
                                                            <div className="vetting-tutor-details">
                                                                <div className="vetting-tutor-name">{tutor.fullname}</div>
                                                                <div className="vetting-tutor-email">{tutor.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="vetting-table-td">
                                                        <div className="vetting-headline">
                                                            {tutor.sections?.basicInfo?.headline || 'Chưa cập nhật'}
                                                        </div>
                                                    </td>
                                                    <td className="vetting-table-td">
                                                        <span className="vetting-price-cell">
                                                            {formatCurrency(tutor.sections?.pricing?.hourlyRate ?? null)}
                                                        </span>
                                                    </td>
                                                    <td className="vetting-table-td vetting-date">
                                                        {formatDate(tutor.profileCreatedAt)}
                                                    </td>
                                                    <td className="vetting-table-td">
                                                        <span className="vetting-status-badge">
                                                            <span className="vetting-status-dot"></span>
                                                            Chờ xem xét
                                                        </span>
                                                    </td>
                                                    <td className="vetting-table-td">
                                                        <div className="vetting-row-actions">
                                                            <button
                                                                className="vetting-quick-btn vetting-quick-approve"
                                                                title="Phê duyệt"
                                                                onClick={() => handleApprove(tutor.userid)}
                                                                disabled={actionLoading === tutor.userid}
                                                            >
                                                                <span className="material-symbols-outlined">check</span>
                                                            </button>
                                                            <button
                                                                className="vetting-quick-btn vetting-quick-reject"
                                                                title="Từ chối"
                                                                onClick={() => handleOpenRejectModal(tutor.userid)}
                                                                disabled={actionLoading === tutor.userid}
                                                            >
                                                                <span className="material-symbols-outlined">close</span>
                                                            </button>
                                                            <button
                                                                className="vetting-action-btn"
                                                                onClick={() => setSelectedTutor(tutor)}
                                                            >
                                                                Xem chi tiết
                                                                <span className="material-symbols-outlined" style={{ fontSize: 18, marginLeft: 4 }}>
                                                                    open_in_new
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {!loading && !error && tutors.length > 0 && (
                                <div className="vetting-pagination">
                                    <p className="vetting-pagination-info">
                                        Hiển thị {tutors.length} yêu cầu đang chờ duyệt
                                    </p>
                                    <div className="vetting-pagination-controls">
                                        <button className="vetting-pagination-btn" disabled>
                                            <span className="material-symbols-outlined vetting-pagination-icon">arrow_back</span>
                                        </button>
                                        <button className="vetting-pagination-btn" disabled>
                                            <span className="material-symbols-outlined vetting-pagination-icon">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Tutor Detail Modal */}
            <TutorDetailModal
                tutor={selectedTutor}
                isOpen={selectedTutor !== null}
                onClose={() => setSelectedTutor(null)}
                onApprove={handleApprove}
                onOpenReject={handleOpenRejectModal}
                actionLoading={actionLoading}
            />

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="vetting-modal-overlay" onClick={() => setShowRejectModal(null)}>
                    <div className="vetting-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="vetting-modal-header">
                            <h3>Từ chối hồ sơ gia sư</h3>
                            <button
                                className="vetting-modal-close"
                                onClick={() => setShowRejectModal(null)}
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="vetting-modal-body">
                            <p className="vetting-modal-description">
                                Vui lòng nhập lý do từ chối hồ sơ. Lý do này sẽ được gửi đến gia sư để họ có thể cải thiện hồ sơ.
                            </p>
                            <textarea
                                className="vetting-rejection-textarea"
                                placeholder="Nhập lý do từ chối (ít nhất 20 ký tự)..."
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                rows={4}
                            />
                            <p className="vetting-char-count">
                                {rejectionNote.length}/20 ký tự tối thiểu
                            </p>
                        </div>
                        <div className="vetting-modal-footer">
                            <button
                                className="vetting-btn vetting-btn-outline"
                                onClick={() => setShowRejectModal(null)}
                            >
                                Hủy
                            </button>
                            <button
                                className="vetting-btn vetting-btn-reject"
                                onClick={handleReject}
                                disabled={rejectionNote.trim().length < 20 || actionLoading !== null}
                            >
                                {actionLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVettingPage;
