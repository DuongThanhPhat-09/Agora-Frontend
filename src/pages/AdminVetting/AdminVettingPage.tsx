import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TutorDetailModal from './components/TutorDetailModal';
import {
    mockGetPendingTutors as getPendingTutors,
    mockGetTutorDetailForReview as getTutorDetailForReview,
    mockApproveTutor as approveTutor,
    mockRejectTutor as rejectTutor,
} from './mockData';
import type { TutorForReview, TutorDetailForReview } from '../../types/admin.types';
import '../../styles/pages/admin-dashboard.css';
import '../../styles/pages/admin-vetting.css';

const AdminVettingPage = () => {
    // State management
    const [tutors, setTutors] = useState<TutorForReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTutorDetail, setSelectedTutorDetail] = useState<TutorDetailForReview | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Fetch pending tutors on mount
    useEffect(() => {
        fetchPendingTutors();
    }, []);

    const fetchPendingTutors = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPendingTutors();
            setTutors(data);
        } catch (err) {
            console.error('Error fetching pending tutors:', err);
            setError('Không thể tải danh sách gia sư. Vui lòng thử lại.');
            setTutors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (tutorId: string) => {
        try {
            setLoadingDetail(true);
            const detail = await getTutorDetailForReview(tutorId);
            setSelectedTutorDetail(detail);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error fetching tutor detail:', err);
            toast.error('Không thể tải chi tiết gia sư. Vui lòng thử lại.');
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleApprove = async (tutorId: string) => {
        try {
            await approveTutor(tutorId);
            toast.success('Phê duyệt gia sư thành công!');
            // Refresh list
            await fetchPendingTutors();
        } catch (err) {
            console.error('Error approving tutor:', err);
            toast.error('Không thể phê duyệt gia sư. Vui lòng thử lại.');
            throw err; // Re-throw to let modal handle it
        }
    };

    const handleReject = async (tutorId: string, rejectionNote: string) => {
        try {
            await rejectTutor(tutorId, rejectionNote);
            toast.success('Đã từ chối hồ sơ gia sư.');
            // Refresh list
            await fetchPendingTutors();
        } catch (err) {
            console.error('Error rejecting tutor:', err);
            toast.error('Không thể từ chối hồ sơ. Vui lòng thử lại.');
            throw err; // Re-throw to let modal handle it
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

    return (
        <div className="admin-vetting-page">
            {/* Main Content */}

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
                                <button className="vetting-btn vetting-btn-outline">
                                    <span className="material-symbols-outlined vetting-btn-icon">filter_list</span>
                                    Bộ lọc
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
                                    <span className="vetting-tab-count">12</span>
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
                                    <p>Đang tải danh sách gia sư...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="vetting-error-state">
                                    <p>{error}</p>
                                    <button className="vetting-btn vetting-btn-primary" onClick={fetchPendingTutors}>
                                        Thử lại
                                    </button>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && tutors.length === 0 && (
                                <div className="vetting-empty-state">
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
                                                <th className="vetting-table-th">Môn học</th>
                                                <th className="vetting-table-th">Đã nộp</th>
                                                <th className="vetting-table-th">Trạng thái</th>
                                                <th className="vetting-table-th">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="vetting-table-body">
                                            {tutors.map((tutor) => (
                                                <tr key={tutor.tutorid} className="vetting-table-row">
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
                                                        <div className="vetting-subjects">
                                                            {tutor.subjects.map((subject, idx) => (
                                                                <span key={idx} className="vetting-subject-tag">
                                                                    {subject}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="vetting-table-td vetting-date">
                                                        {formatDate(tutor.createdat)}
                                                    </td>
                                                    <td className="vetting-table-td">
                                                        <span className="vetting-status-badge">
                                                            <span className="vetting-status-dot"></span>
                                                            Chờ xem xét
                                                        </span>
                                                    </td>
                                                    <td className="vetting-table-td">
                                                        <button
                                                            className="vetting-action-btn"
                                                            onClick={() => handleViewDetail(tutor.tutorid)}
                                                            disabled={loadingDetail}
                                                        >
                                                            {loadingDetail ? 'Đang tải...' : 'Xem chi tiết'}
                                                        </button>
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
                                        Hiển thị {tutors.length} trong {tutors.length} yêu cầu
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
                tutorDetail={selectedTutorDetail}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTutorDetail(null);
                }}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
};

export default AdminVettingPage;

