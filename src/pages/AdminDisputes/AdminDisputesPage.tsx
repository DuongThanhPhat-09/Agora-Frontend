import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockGetDisputes } from './mockData';
import type { DisputeForAdmin } from '../../types/admin.types';
import { formatCurrency, formatRelativeTime, formatDisputeType } from '../../utils/formatters';

import '../../styles/pages/admin-dashboard.css';

const AdminDisputesPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [disputes, setDisputes] = useState<DisputeForAdmin[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch disputes on mount
    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            setLoading(true);
            const data = await mockGetDisputes();
            setDisputes(data);
        } catch (err) {
            console.error('Error fetching disputes:', err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>

            <main className="admin-main">
                <div className="admin-content" style={{ paddingTop: '40px' }}>
                    <div className="admin-content-inner">
                        {/* Header */}
                        <header className="dispute-header">
                            <div className="dispute-title-section">
                                <h1 className="dispute-title">Trung tâm Giải quyết Khiếu nại</h1>
                                <p className="dispute-subtitle">Quản lý và giải quyết xung đột giữa học viên và gia sư một cách minh bạch.</p>
                            </div>
                            <div className="dispute-header-actions">
                                <button className="admin-action-btn admin-action-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>file_download</span>
                                    Xuất báo cáo
                                </button>
                                <button className="admin-action-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-medium)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                                    Tạo hồ sơ mới
                                </button>
                            </div>
                        </header>

                        {/* Stats Grid */}
                        <div className="dispute-stats-grid">
                            {/* Card 1 */}
                            <div className="dispute-stat-card">
                                <div className="dispute-stat-header">
                                    <div className="dispute-stat-icon-wrapper dispute-icon-navy">
                                        <span className="material-symbols-outlined">folder_open</span>
                                    </div>
                                    <span className="material-symbols-outlined dispute-more-icon">more_horiz</span>
                                </div>
                                <p className="dispute-stat-label">Hồ sơ đang hoạt động</p>
                                <p className="dispute-stat-value dispute-value-navy">15</p>
                                <div className="dispute-stat-meta dispute-meta-green">
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_down</span>
                                    -2 so với hôm qua
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="dispute-stat-card">
                                <div className="dispute-glow dispute-glow-gold"></div>
                                <div className="dispute-stat-header">
                                    <div className="dispute-stat-icon-wrapper dispute-icon-gold">
                                        <span className="material-symbols-outlined">account_balance_wallet</span>
                                    </div>
                                    <span className="material-symbols-outlined dispute-more-icon">more_horiz</span>
                                </div>
                                <p className="dispute-stat-label">Tiền đang giữ</p>
                                <p className="dispute-stat-value dispute-value-gold">$1,250.00</p>
                                <div className="dispute-stat-meta dispute-meta-gray">
                                    Trên 8 hồ sơ đang hoạt động
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="dispute-stat-card">
                                <div className="dispute-stat-header">
                                    <div className="dispute-stat-icon-wrapper dispute-icon-crimson">
                                        <span className="material-symbols-outlined">warning</span>
                                    </div>
                                    <span className="material-symbols-outlined dispute-more-icon">more_horiz</span>
                                </div>
                                <p className="dispute-stat-label">Khẩn cấp / Quá hạn</p>
                                <p className="dispute-stat-value dispute-value-crimson">3</p>
                                <div className="dispute-stat-meta dispute-meta-crimson">
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>priority_high</span>
                                    Cần hành động ngay
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="dispute-tabs-section">
                            <div className="dispute-tabs">
                                <button
                                    className={`dispute-tab ${activeTab === 'all' ? 'dispute-tab-active' : ''}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    <span className={`dispute-tab-label ${activeTab === 'all' ? 'dispute-tab-label-active' : ''}`}>Tất cả đang mở</span>
                                    <span className="dispute-tab-count dispute-count-navy">15</span>
                                </button>
                                <button
                                    className={`dispute-tab ${activeTab === 'urgent' ? 'dispute-tab-active' : ''}`}
                                    onClick={() => setActiveTab('urgent')}
                                >
                                    <span className={`dispute-tab-label ${activeTab === 'urgent' ? 'dispute-tab-label-active' : ''}`}>Khẩn cấp</span>
                                    <span className="dispute-tab-count dispute-count-crimson">3</span>
                                </button>
                                <button
                                    className={`dispute-tab ${activeTab === 'investigation' ? 'dispute-tab-active' : ''}`}
                                    onClick={() => setActiveTab('investigation')}
                                >
                                    <span className={`dispute-tab-label ${activeTab === 'investigation' ? 'dispute-tab-label-active' : ''}`}>Đang điều tra</span>
                                </button>
                                <button
                                    className={`dispute-tab ${activeTab === 'resolved' ? 'dispute-tab-active' : ''}`}
                                    onClick={() => setActiveTab('resolved')}
                                >
                                    <span className={`dispute-tab-label ${activeTab === 'resolved' ? 'dispute-tab-label-active' : ''}`}>Đã giải quyết</span>
                                </button>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="dispute-table-section">
                            {/* Controls */}
                            <div className="dispute-table-controls">
                                <div className="dispute-search-wrapper">
                                    <span className="material-symbols-outlined dispute-search-icon">search</span>
                                    <input
                                        className="dispute-search-input"
                                        placeholder="Tìm theo Mã hồ sơ hoặc Tên..."
                                        type="text"
                                    />
                                </div>
                                <div className="dispute-control-actions">
                                    <button className="dispute-control-btn" title="Filter">
                                        <span className="material-symbols-outlined">filter_list</span>
                                    </button>
                                    <button className="dispute-control-btn" title="Sort">
                                        <span className="material-symbols-outlined">sort</span>
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="dispute-table-container">
                                <table className="dispute-table">
                                    <thead className="dispute-thead">
                                        <tr>
                                            <th className="dispute-th" style={{ width: '120px' }}>Mã hồ sơ</th>
                                            <th className="dispute-th" style={{ minWidth: '220px' }}>Các bên liên quan</th>
                                            <th className="dispute-th" style={{ minWidth: '180px' }}>Lý do</th>
                                            <th className="dispute-th">Số tiền giữ</th>
                                            <th className="dispute-th">Thời gian còn lại</th>
                                            <th className="dispute-th">Độ ưu tiên</th>
                                            <th className="dispute-th dispute-th-right" style={{ width: '160px' }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                                    Đang tải danh sách khiếu nại...
                                                </td>
                                            </tr>
                                        ) : disputes.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                                    Không có khiếu nại nào
                                                </td>
                                            </tr>
                                        ) : (
                                            disputes.map((dispute) => {
                                                const isUrgent = dispute.priority === 'high';
                                                const timeRemaining = formatRelativeTime(dispute.deadlineat);

                                                return (
                                                    <tr key={dispute.disputeid} className="dispute-tr">
                                                        <td className="dispute-td dispute-td-id">
                                                            {isUrgent && <div className="dispute-priority-indicator"></div>}
                                                            #{dispute.disputeid}
                                                        </td>
                                                        <td className="dispute-td">
                                                            <div className="dispute-parties-wrapper">
                                                                <div className="dispute-avatars">
                                                                    <div className="dispute-avatar" style={{ backgroundImage: `url('${dispute.studentavatar}')` }}></div>
                                                                    <div className="dispute-avatar" style={{ backgroundImage: `url('${dispute.tutoravatar}')` }}></div>
                                                                </div>
                                                                <div className="dispute-parties-names">
                                                                    <span>{dispute.studentname}</span>
                                                                    <span className="dispute-vs">VS</span>
                                                                    <span>{dispute.tutorname}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="dispute-td">
                                                            <span className="dispute-reason-title">{formatDisputeType(dispute.disputetype)}</span>
                                                            <p className="dispute-reason-desc">Đã nộp {formatRelativeTime(dispute.createdat)}</p>
                                                        </td>
                                                        <td className="dispute-td">
                                                            <div className={`dispute-amount-badge ${dispute.escrowamount > 1000000 ? 'dispute-amount-gold' : 'dispute-amount-gray'}`}>
                                                                {formatCurrency(dispute.escrowamount)}
                                                            </div>
                                                        </td>
                                                        <td className="dispute-td">
                                                            <div className={`dispute-time ${isUrgent ? 'dispute-time-crimson' : 'dispute-time-gray'}`}>
                                                                <span className="material-symbols-outlined dispute-time-icon">
                                                                    {isUrgent ? 'timer' : 'calendar_clock'}
                                                                </span>
                                                                {timeRemaining}
                                                            </div>
                                                        </td>
                                                        <td className="dispute-td">
                                                            <span className={`dispute-priority-badge dispute-priority-${dispute.priority}`}>
                                                                {dispute.priority === 'high' ? 'Cao' : dispute.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                                            </span>
                                                        </td>
                                                        <td className="dispute-td dispute-td-right">
                                                            <button
                                                                className="dispute-action-btn"
                                                                onClick={() => navigate(`/admin/disputes/${dispute.disputeid}`)}
                                                            >
                                                                Điều tra
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="dispute-pagination">
                                <span className="dispute-pagination-info">Hiển thị 5 trong 15 hồ sơ</span>
                                <div className="dispute-pagination-controls">
                                    <button className="dispute-page-btn dispute-page-btn-disabled" disabled>Trước</button>
                                    <button className="dispute-page-btn dispute-page-btn-active">Tiếp</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AdminDisputesPage;
