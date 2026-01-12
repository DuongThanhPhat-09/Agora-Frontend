import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/tutor-wallet.css';

const TutorWalletPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="tutor-workspace-dashboard-wire">
            {/* Sidebar */}
            <aside className="workspace-sidebar">
                <div className="sidebar-header">
                    <h1 className="sidebar-logo">AGORA</h1>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item" onClick={() => navigate('/tutor-workspace')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 4C3 3.44772 3.44772 3 4 3H7C7.55228 3 8 3.44772 8 4V7C8 7.55228 7.55228 8 7 8H4C3.44772 8 3 7.55228 3 7V4Z" />
                            <path d="M3 13C3 12.4477 3.44772 12 4 12H7C7.55228 12 8 12.4477 8 13V16C8 16.5523 7.55228 17 7 17H4C3.44772 17 3 16.5523 3 16V13Z" />
                            <path d="M12 4C12 3.44772 12.4477 3 13 3H16C16.5523 3 17 3.44772 17 4V7C17 7.55228 16.5523 8 16 8H13C12.4477 8 12 7.55228 12 7V4Z" />
                            <path d="M13 12C12.4477 12 12 12.4477 12 13V16C12 16.5523 12.4477 17 13 17H16C16.5523 17 17 16.5523 17 16V13C17 12.4477 16.5523 12 16 12H13Z" />
                        </svg>
                        <span className="nav-text">Tổng quan</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/tutor-schedule')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2Z" />
                        </svg>
                        <span className="nav-text">Lịch dạy</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/tutor-classes')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z" />
                            <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z" />
                        </svg>
                        <span className="nav-text">Lớp học</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/tutor-messages')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5C2 4.44772 2.44772 4 3 4H17C17.5523 4 18 4.44772 18 5V15C18 15.5523 17.5523 16 17 16H3C2.44772 16 2 15.5523 2 15V5Z" />
                            <path d="M2 5L10 10L18 5" stroke="white" strokeWidth="1.5" />
                        </svg>
                        <span className="nav-text">Tin nhắn</span>
                        <span className="nav-badge">3</span>
                    </div>

                    <div className="nav-item nav-item-active">
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4C4 2.89543 4.89543 2 6 2H14C15.1046 2 16 2.89543 16 4V18L10 15L4 18V4Z" />
                        </svg>
                        <span className="nav-text">Ví của tôi</span>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="upgrade-card">
                        <p className="upgrade-title">👑 Nâng cấp Unlimited</p>
                        <p className="upgrade-subtitle">Mở khóa công cụ thuế</p>
                        <button className="upgrade-button">Nâng cấp ngay</button>
                    </div>

                    <div className="user-profile">
                        <div className="user-avatar">M</div>
                        <div className="user-info">
                            <p className="user-name">Minh</p>
                            <p className="user-role">Gia sư</p>
                        </div>
                        <svg className="user-menu-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="workspace-main">
                {/* Header */}
                <header className="workspace-header">
                    <div className="header-content">
                        <div className="breadcrumb-section">
                            <nav className="breadcrumb">
                                <span className="breadcrumb-item">Trang chủ</span>
                                <span className="breadcrumb-separator">›</span>
                                <span className="breadcrumb-item breadcrumb-current">Tài chính</span>
                            </nav>
                            <h2 className="page-greeting">Ví của tôi</h2>
                        </div>

                        <div className="header-actions">
                            <button className="header-button header-button-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2C11.1046 2 12 2.89543 12 4V10H16C17.1046 10 18 10.8954 18 12C18 13.1046 17.1046 14 16 14H12V18C12 19.1046 11.1046 20 10 20C8.89543 20 8 19.1046 8 18V14H4C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10H8V4C8 2.89543 8.89543 2 10 2Z" />
                                </svg>
                            </button>

                            <div className="search-container">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Tìm kiếm lớp học, học sinh, tài liệu"
                                />
                                <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                                    <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>

                            <button className="header-button header-button-icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2C6.47715 2 3.58649 4.68626 3.10636 8.125H2C1.44772 8.125 1 8.57272 1 9.125V10.875C1 11.4273 1.44772 11.875 2 11.875H3.10636C3.58649 15.3137 6.47715 18 10 18C13.5228 18 16.4135 15.3137 16.8936 11.875H18C18.5523 11.875 19 11.4273 19 10.875V9.125C19 8.57272 18.5523 8.125 18 8.125H16.8936C16.4135 4.68626 13.5228 2 10 2ZM10 6C11.6569 6 13 7.34315 13 9C13 10.6569 11.6569 12 10 12C8.34315 12 7 10.6569 7 9C7 7.34315 8.34315 6 10 6Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Wallet Content */}
                <div className="wallet-content">
                    {/* Asset Cards */}
                    <div className="asset-cards">
                        {/* Available Balance Card */}
                        <div className="asset-card asset-card-green">
                            <div className="asset-header">
                                <div className="asset-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" />
                                    </svg>
                                </div>
                                <div className="asset-info">
                                    <p className="asset-label">Số dư khả dụng</p>
                                    <p className="asset-subtitle">Có thể rút ngay</p>
                                </div>
                            </div>
                            <p className="asset-amount">3.500.000 ₫</p>
                            <button className="asset-button asset-button-primary">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3L3 9H7V17H13V9H17L10 3Z" />
                                </svg>
                                RÚT TIỀN
                            </button>
                        </div>

                        {/* Escrow Card */}
                        <div className="asset-card asset-card-yellow">
                            <div className="asset-header">
                                <div className="asset-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                        <path d="M2 17L12 22L22 17" />
                                        <path d="M2 12L12 17L22 12" />
                                    </svg>
                                </div>
                                <div className="asset-info">
                                    <p className="asset-label">Đang giữ (Escrow)</p>
                                    <p className="asset-subtitle">Chờ hoàn thành buổi học</p>
                                </div>
                            </div>
                            <p className="asset-amount">1.200.000 ₫</p>
                            <button className="asset-button asset-button-secondary">
                                Xem chi tiết →
                            </button>
                        </div>

                        {/* Credits Card */}
                        <div className="asset-card asset-card-purple">
                            <div className="asset-header">
                                <div className="asset-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                                    </svg>
                                </div>
                                <div className="asset-info">
                                    <p className="asset-label">Tín dụng (Credits)</p>
                                    <p className="asset-subtitle">Đổi quà / Mua gói</p>
                                </div>
                            </div>
                            <p className="asset-amount">150</p>
                            <button className="asset-button asset-button-secondary">
                                Đổi thưởng →
                            </button>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="wallet-bottom">
                        {/* Bank Account Card */}
                        <div className="bank-account-card">
                            <h3 className="section-title">Tài khoản nhận tiền</h3>

                            <div className="bank-account-info">
                                <div className="bank-header">
                                    <div className="bank-logo">VCB</div>
                                    <div className="bank-details">
                                        <p className="bank-name">Vietcombank</p>
                                        <p className="bank-full-name">Ngân hàng TMCP Ngoại Thương VN</p>
                                    </div>
                                    <div className="verified-badge">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M13.485 2.343a1 1 0 011.415 1.415l-8 8a1 1 0 01-1.415 0l-3-3a1 1 0 011.415-1.415L6 9.657l7.485-7.314z" />
                                        </svg>
                                        <span>Đã xác thực</span>
                                    </div>
                                </div>

                                <div className="account-details">
                                    <div className="account-row">
                                        <span className="account-label">Số tài khoản</span>
                                        <span className="account-value">**** **** 8888</span>
                                    </div>
                                    <div className="account-row">
                                        <span className="account-label">Tên chủ tài khoản</span>
                                        <span className="account-value">NGUYEN VAN A</span>
                                    </div>
                                </div>
                            </div>

                            <button className="add-account-button">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9H9V4C9 3.44772 9.44772 3 10 3Z" />
                                </svg>
                                Thêm tài khoản
                            </button>
                        </div>

                        {/* Tax Info Card */}
                        <div className="tax-info-card">
                            <h3 className="section-title">Thuế TNCN ước tính</h3>

                            <div className="tax-content">
                                <div className="tax-stat">
                                    <p className="tax-label">Thu nhập chịu thuế (tháng này)</p>
                                    <p className="tax-amount">45.000.000 ₫</p>
                                </div>

                                <div className="tax-stat">
                                    <p className="tax-label">Thuế phải đóng ước tính</p>
                                    <p className="tax-amount tax-amount-highlight">0 ₫</p>
                                    <p className="tax-note">Theo biểu thuế lũy tiến</p>
                                </div>

                                <div className="tax-report">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 3H17V17H3V3Z" />
                                    </svg>
                                    <div>
                                        <p className="report-label">Báo cáo chi tiết</p>
                                        <p className="report-subtitle">Xem phân tích đầy đủ</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upgrade Overlay */}
                            <div className="upgrade-overlay">
                                <div className="upgrade-content">
                                    <div className="upgrade-icon">🔒</div>
                                    <h4 className="upgrade-heading">Nâng cấp để mở khóa</h4>
                                    <p className="upgrade-description">
                                        Gói Unlimited cung cấp công cụ tính thuế tự động<br />
                                        và báo cáo tài chính chi tiết
                                    </p>
                                    <button className="upgrade-pro-button">👑 Nâng cấp ngay</button>
                                    <p className="upgrade-price">Chỉ từ 99.000đ/tháng</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="transaction-history">
                        <h3 className="section-title">Lịch sử Giao dịch</h3>

                        {/* Filters */}
                        <div className="transaction-filters">
                            <select className="time-filter">
                                <option>Tuần này</option>
                                <option>Tháng này</option>
                                <option>Quý này</option>
                                <option>Năm này</option>
                            </select>

                            <div className="type-filters">
                                <button className="filter-btn filter-btn-active">Tất cả</button>
                                <button className="filter-btn">Nhận tiền</button>
                                <button className="filter-btn">Rút tiền</button>
                                <button className="filter-btn">Phí sàn</button>
                            </div>
                        </div>

                        {/* Transaction Table */}
                        <div className="transaction-table">
                            <div className="table-header">
                                <div className="table-row">
                                    <div className="table-cell header-cell">LOẠI</div>
                                    <div className="table-cell header-cell">NỘI DUNG</div>
                                    <div className="table-cell header-cell">THỜI GIAN</div>
                                    <div className="table-cell header-cell text-right">SỐ TIỀN</div>
                                    <div className="table-cell header-cell text-center">TRẠNG THÁI</div>
                                </div>
                            </div>

                            <div className="table-body">
                                {/* Transaction Row 1 */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <div className="transaction-icon">📚</div>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-description">Thù lao: Toán 9 - Buổi 12 (Em Tuấn)</p>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-date">20/10/2023</p>
                                        <p className="transaction-time">10:30</p>
                                    </div>
                                    <div className="table-cell text-right">
                                        <p className="transaction-amount amount-positive">+ 190.000 ₫</p>
                                    </div>
                                    <div className="table-cell text-center">
                                        <span className="status-badge status-completed">Hoàn tất</span>
                                    </div>
                                </div>

                                {/* Transaction Row 2 */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <div className="transaction-icon">🔬</div>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-description">Thù lao: Lý 10 - Buổi 4</p>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-date">22/10/2023</p>
                                        <p className="transaction-time">14:00</p>
                                    </div>
                                    <div className="table-cell text-right">
                                        <p className="transaction-amount amount-neutral">200.000 ₫</p>
                                    </div>
                                    <div className="table-cell text-center">
                                        <span className="status-badge status-processing">Đang xử lý</span>
                                    </div>
                                </div>

                                {/* Transaction Row 3 */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <div className="transaction-icon">💸</div>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-description">Rút tiền về Vietcombank</p>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-date">18/10/2023</p>
                                        <p className="transaction-time">09:15</p>
                                    </div>
                                    <div className="table-cell text-right">
                                        <p className="transaction-amount amount-negative">- 2.000.000 ₫</p>
                                    </div>
                                    <div className="table-cell text-center">
                                        <span className="status-badge status-completed">Hoàn tất</span>
                                    </div>
                                </div>

                                {/* Transaction Row 4 */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <div className="transaction-icon">⚗️</div>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-description">Thù lao: Hóa 11 - Buổi 8 (Em Minh An)</p>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-date">15/10/2023</p>
                                        <p className="transaction-time">16:00</p>
                                    </div>
                                    <div className="table-cell text-right">
                                        <p className="transaction-amount amount-positive">+ 250.000 ₫</p>
                                    </div>
                                    <div className="table-cell text-center">
                                        <span className="status-badge status-completed">Hoàn tất</span>
                                    </div>
                                </div>

                                {/* Transaction Row 5 */}
                                <div className="table-row">
                                    <div className="table-cell">
                                        <div className="transaction-icon">💰</div>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-description">Phí sàn AGORA (10%)</p>
                                    </div>
                                    <div className="table-cell">
                                        <p className="transaction-date">15/10/2023</p>
                                        <p className="transaction-time">16:01</p>
                                    </div>
                                    <div className="table-cell text-right">
                                        <p className="transaction-amount amount-negative">- 25.000 ₫</p>
                                    </div>
                                    <div className="table-cell text-center">
                                        <span className="status-badge status-completed">Hoàn tất</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="pagination">
                            <p className="pagination-info">Hiển thị 5 giao dịch</p>
                            <div className="pagination-buttons">
                                <button className="pagination-btn">Trước</button>
                                <button className="pagination-btn pagination-btn-active">1</button>
                                <button className="pagination-btn">2</button>
                                <button className="pagination-btn">Sau</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorWalletPage;
