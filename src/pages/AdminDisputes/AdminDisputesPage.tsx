import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import '../../styles/pages/admin-dashboard.css';

const AdminDisputesPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    // Sample data for disputes
    const disputes = [
        {
            id: '8821',
            student: {
                name: 'Sarah M.',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6nPy0_cZA794Sg0K6k7-mZMsB-Mq_jr8XELGDnDjPPsLfmrhcV1NDh_qlM4AWYj-orlbdH8cmxG7gXgcKNmGKbHbY6JNwMe4j1B_Q-Z7JSv6El5lnrRdRA7pm33EOE_aLhD-TWTdV-YLqcTbCl3a4R2uuPqNNzvLCRuGUqpAhFJiE7dpXUxtIYqm-evHUMeTuJZyNGC5f38sovWYKkpfaXTGDM_w-Og3LpcJ6UboTtdZuhvEsYhagQp4IfhHvJKwDsnIaYMgtrm4'
            },
            tutor: {
                name: 'Prof. Davids',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfoPTqviyQwfEXTgibH4wMRXkJD6CN5H2GH6xtjpn3E2nlgadR4YcLpz_kpxv_BG43eqpj6koea1XRsQNJSPU-XOleaLq5dYlPwXqm3iVs65w7_0ixup07F0wxHdX0lbhLf8ZU1S1VvWUzh9LRSd8UJbUeUZr3ezKZOIdEAQBDQ_w4HAbodf1qfJiXm9vTrewxtSQduiB86tbj0DL5XT8A2h8R2gJ8oQbf_yRlBQP4g7qtAHdf2gDfxRKyy5LyUHRoyioarN-oy4w'
            },
            reason: {
                title: 'Gia sư không đến',
                description: 'Học viên báo cáo gia sư vắng mặt...'
            },
            amount: 50.00,
            timeRemaining: '23h còn lại',
            priority: 'Cao',
            isUrgent: true
        },
        {
            id: '8822',
            student: {
                name: 'Michael C.',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4ZkjNRJFYQ5d44SUKMdNbhGHwlaQbTvXu6muMXS06rK0aVxYP780rruPH-XcXfgv2y0FFqRgmCYv8glTMPISlctepzpUwANlHi2L0qWQDbhC8_bDwy5ggytDc7VUFq8EmxKVZjPRnXOVwcgqsq9FCEDFD_4IV29HxviNkgkefs4jEFKIfrovLSZqkKwtF0hZ9hc-HdYdz56qetY6gU0kY8piGRS1v0GiXk0TdyIN2VUe0SyYOUa6USEQZKh3qAlOIK4emGgm-nTs'
            },
            tutor: {
                name: 'Tutor Jane',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGVmiMa1qOpPl9ptdzQmoDOvRv81iK__Lau7oXY35Hqed699ccruST3HLpnAMp3WlqMTb7zYb1-h0qfuKV9IsGZnxHmY7n6iefXknJzQNVDyjF8kumQ8J_m4icZqU8xOkRrOROSijpdgfJMVnCVe70oyoPBUCIFJF8Kd1kppqA1bc7r2XBJE450VchjmKDRkOGcqirsPk1-zHHuhck8iKU51odEqRY9uulyEoruIju4pXIkbh_t_Xqz4AMiAr2rZGDJWpz0QzpyY'
            },
            reason: {
                title: 'Nộp bài muộn',
                description: 'Phản hồi chậm 3 ngày'
            },
            amount: 30.00,
            timeRemaining: '2 ngày còn lại',
            priority: 'Trung bình',
            isUrgent: false
        },
        {
            id: '8823',
            student: {
                name: 'Emma W.',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXH0JZiBytEovqHxhoTP7ycg5FCGsD3jhOi1e3TmhKKGDiwzurTOcqS4lTKZV8PaZTxHLdnIQ_Xn_tgl0-lU0NNPXNfrCn3O5T8Y_FTx2l-DMpVsohxsowHZSTd2FM5WkDAZZyuUV1mGKMMGVoS9iKcn2G7qKfqeW0wsv4r9X6VsPTupbLu7mky6himXAtv25ihSi3NpcSx-pUNxWz5GGQLBQKgb7cEY4b_rPmoefsbnhBE3EYFIOmJ9fUTWSoaHnpxWvPGhJ8Heo'
            },
            tutor: {
                name: 'Dr. Roberts',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMBrilX3h5Zs6XdyMjSCYGqJO_4gM3TLx6vbZtPLycGNYtfEO4cYD9lY8VVI0dwD-nJilY0gHxA-j1evOJYhy4GOPwUVcCs-i1krQmX8HuAf_zXDAfcMqpDIQWWt8GfWeFdOf2NLBThkjHseWDV3277IO8WrJojWT2eYuiyAg9nPspFFyDJWGL5IE5jWAt_ahFm5Mr2vh3SeUniGNFvJj-mQOGXw2fSb2MnC2FMCJkriNgS4xHQhIMPtR2wykda8VIaG4kYr7kKN8'
            },
            reason: {
                title: 'Khiếu nại đạo văn',
                description: 'Điểm Turnitin bị khiếu nại'
            },
            amount: 120.00,
            timeRemaining: '1h còn lại',
            priority: 'Cao',
            isUrgent: true
        },
        {
            id: '8824',
            student: {
                name: 'David K.',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIbMgb54iQRlKq8R6thAqqyS4IycvGSisxI_FzhNdi-pWvKgj80ugA9mWDNCpNh4JUxxq3gyRtu0iU-aBxF2hrWvv7we2nha4IomPwuTY4BIb_6bIlG4LHvGwAo6MTxRLQxxyEl0kxK3O-lDYllNWZyUGIzjRNBW-lxBkwHeG7UCfc6CNQvVWMdlJI1HTdYgFTW5QcQtVBdNkckdvz1GIXRLDuuR-j2kD7ghr1PoHzzB7sc-MHIAcok8_rmjBvmvPj8MOsFa0urak'
            },
            tutor: {
                name: 'Tutor Alan',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1wg4zpoI28ONSMoAP_S3dVZI8Cw52Gax0nichlFDJ44h0jImtFQWVksnENbeXJVcphV67YZSd0kX-FxTAJ9iMw6oIvDmVNCYppjF_zVUzbClJsB4U3Sbiq5PE2n0wjCwfYr4BNNyWK-oDvl5lHGgNShyr7AhOLN1ywB9ZNp2bl96Z5KY6SrVm57ExIqrbxy6i53foP_f3V0ShkQuWAgV_5s2bBhDUQReCRzXOTXzUwSFAFj92qX3ZWpNp8X3mBva14ul_GarXbrE'
            },
            reason: {
                title: 'Sự cố kết nối',
                description: 'Buổi học bị ngắt quãng giữa chừng'
            },
            amount: 45.00,
            timeRemaining: '4h còn lại',
            priority: 'Thấp',
            isUrgent: false
        },
        {
            id: '8825',
            student: {
                name: 'Olivia R.',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBSUmQDdr1c-kYm6495UMOZD676z-wxNcvVgDeTx5kxl7vwVGng6EZtdGGpoH5iF5Juge6sYsIfLVYLnecjFdTGYGXVpAAdYUp7DEyfk3HSGPtyc1hWpSwqPwQrzYNMjAw-DW9-8m-dJHnIQNFJaRLW9cgbNhlRpPlRvsFZgwhFWO0281SaMi64fXpbAEN-kX7xq7yUa16cCF8dSU49cn7xIC7gHpkp_RAFZnr8JA8Q2Urc6XceuGm9pf_8HsSX1aMxSVYamRNigg'
            },
            tutor: {
                name: 'Prof. Smith',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPEYH13JjSGv8fsXI2X9JcF7wzb5IRk_xFS4NCTr-VxwZk5Je0NNjcjaQbpdDfFOYtrJQlJdTBerft0qwRMcLzzqdTusPAmQAOjJgpyPpkYHR2jrBaVoRr9GAk0ZVerq58fJjHGG2qnvjsh1hdma9gVUC-BiechWyJ0jjm-uQ6dwRtxxLKC5RV80jrxzeOWTdhl_zbujPzLTMBELah_H3w7MHgYpLLxRejxopAUtkpHuH6BaET2JmhJiBwAKPd68jRG9uFcJwWz3w'
            },
            reason: {
                title: 'Tranh chấp nội dung',
                description: 'Nội dung môn học không chính xác'
            },
            amount: 200.00,
            timeRemaining: '5 ngày còn lại',
            priority: 'Trung bình',
            isUrgent: false
        }
    ];

    return (
        <div className="admin-dashboard">
            <AdminSidebar />

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
                                        {disputes.map((dispute) => (
                                            <tr key={dispute.id} className="dispute-tr">
                                                <td className="dispute-td dispute-td-id">
                                                    {dispute.isUrgent && <div className="dispute-priority-indicator"></div>}
                                                    #{dispute.id}
                                                </td>
                                                <td className="dispute-td">
                                                    <div className="dispute-parties-wrapper">
                                                        <div className="dispute-avatars">
                                                            <div className="dispute-avatar" style={{ backgroundImage: `url('${dispute.student.avatar}')` }}></div>
                                                            <div className="dispute-avatar" style={{ backgroundImage: `url('${dispute.tutor.avatar}')` }}></div>
                                                        </div>
                                                        <div className="dispute-parties-names">
                                                            <span>{dispute.student.name}</span>
                                                            <span className="dispute-vs">VS</span>
                                                            <span>{dispute.tutor.name}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="dispute-td">
                                                    <span className="dispute-reason-title">{dispute.reason.title}</span>
                                                    <p className="dispute-reason-desc">{dispute.reason.description}</p>
                                                </td>
                                                <td className="dispute-td">
                                                    <div className={`dispute-amount-badge ${dispute.amount > 100 ? 'dispute-amount-gold' : 'dispute-amount-gray'}`}>
                                                        ${dispute.amount.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="dispute-td">
                                                    <div className={`dispute-time ${dispute.isUrgent ? 'dispute-time-crimson' : 'dispute-time-gray'}`}>
                                                        <span className="material-symbols-outlined dispute-time-icon">
                                                            {dispute.isUrgent ? 'timer' : 'calendar_clock'}
                                                        </span>
                                                        {dispute.timeRemaining}
                                                    </div>
                                                </td>
                                                <td className="dispute-td">
                                                    <span className={`dispute-priority-badge dispute-priority-${dispute.priority.toLowerCase() === 'cao' ? 'high' : dispute.priority.toLowerCase() === 'trung bình' ? 'medium' : 'low'}`}>
                                                        {dispute.priority}
                                                    </span>
                                                </td>
                                                <td className="dispute-td dispute-td-right">
                                                    <button
                                                        className="dispute-action-btn"
                                                        onClick={() => navigate(`/admin-disputes/${dispute.id}`)}
                                                    >
                                                        Điều tra
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
        </div>
    );
};

export default AdminDisputesPage;
