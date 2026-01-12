import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/tutor-workspace.css';

const TutorWorkspacePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="tutor-workspace-dashboard">
            {/* Sidebar */}
            <aside className="workspace-sidebar">
                <div className="sidebar-header">
                    <h1 className="sidebar-logo">AGORA</h1>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item nav-item-active" onClick={() => navigate('/tutor-workspace')}>
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

                    <div className="nav-item" onClick={() => navigate('/tutor-wallet')}>
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
                                <span className="breadcrumb-item breadcrumb-current">Dashboard</span>
                            </nav>
                            <h2 className="page-greeting">Chào buổi tối, Minh! 👋</h2>
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
                                    <path d="M10 2C10.5304 2 11.0391 2.21071 11.4142 2.58579C11.7893 2.96086 12 3.46957 12 4V4.09C13.13 4.34 14.23 4.78 15.23 5.39L15.29 5.33C15.6651 4.95493 16.1738 4.74421 16.7042 4.74421C17.2346 4.74421 17.7433 4.95493 18.1184 5.33C18.4935 5.70507 18.7042 6.21378 18.7042 6.74421C18.7042 7.27464 18.4935 7.78336 18.1184 8.15843L18.06 8.21C18.67 9.21 19.11 10.31 19.36 11.44H19.5C20.0304 11.44 20.5391 11.6507 20.9142 12.0258C21.2893 12.4009 21.5 12.9096 21.5 13.44C21.5 13.9704 21.2893 14.4791 20.9142 14.8542C20.5391 15.2293 20.0304 15.44 19.5 15.44H19.36C19.11 16.57 18.67 17.67 18.06 18.67L18.12 18.73C18.4951 19.1051 18.7058 19.6138 18.7058 20.1442C18.7058 20.6746 18.4951 21.1833 18.12 21.5584C17.7449 21.9335 17.2362 22.1442 16.7058 22.1442C16.1754 22.1442 15.6667 21.9335 15.2916 21.5584L15.23 21.5C14.23 22.11 13.13 22.55 12 22.8V23C12 23.5304 11.7893 24.0391 11.4142 24.4142C11.0391 24.7893 10.5304 25 10 25C9.46957 25 8.96086 24.7893 8.58579 24.4142C8.21071 24.0391 8 23.5304 8 23V22.8C6.87 22.55 5.77 22.11 4.77 21.5L4.71 21.56C4.33493 21.9351 3.82621 22.1458 3.29579 22.1458C2.76536 22.1458 2.25664 21.9351 1.88157 21.56C1.5065 21.1849 1.29579 20.6762 1.29579 20.1458C1.29579 19.6154 1.5065 19.1067 1.88157 18.7316L1.94 18.67C1.33 17.67 0.89 16.57 0.64 15.44H0.5C-0.0304347 15.44 -0.539129 15.2293 -0.914204 14.8542C-1.28928 14.4791 -1.5 13.9704 -1.5 13.44C-1.5 12.9096 -1.28928 12.4009 -0.914204 12.0258C-0.539129 11.6507 -0.0304347 11.44 0.5 11.44H0.64C0.89 10.31 1.33 9.21 1.94 8.21L1.88 8.15C1.5049 7.77493 1.29418 7.26621 1.29418 6.73579C1.29418 6.20536 1.5049 5.69664 1.88 5.32157C2.25507 4.9465 2.76379 4.73579 3.29421 4.73579C3.82464 4.73579 4.33336 4.9465 4.70843 5.32157L4.77 5.38C5.77 4.77 6.87 4.33 8 4.08V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2ZM10 8C8.67392 8 7.40215 8.52678 6.46447 9.46447C5.52678 10.4021 5 11.6739 5 13C5 14.3261 5.52678 15.5979 6.46447 16.5355C7.40215 17.4732 8.67392 18 10 18C11.3261 18 12.5979 17.4732 13.5355 16.5355C14.4732 15.5979 15 14.3261 15 13C15 11.6739 14.4732 10.4021 13.5355 9.46447C12.5979 8.52678 11.3261 8 10 8Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="dashboard-content">
                    <div className="dashboard-grid">
                        {/* Left Column */}
                        <div className="dashboard-left">
                            {/* Profile Status Widget */}
                            <div className="widget profile-status-widget">
                                <div className="profile-header">
                                    <div className="profile-icon">📊</div>
                                    <div className="profile-text">
                                        <h3 className="widget-title">Hoàn thiện hồ sơ</h3>
                                        <p className="profile-progress-text">60% hoàn thành</p>
                                    </div>
                                </div>

                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '60%' }}></div>
                                </div>

                                <div className="profile-checklist">
                                    <div className="checklist-item checklist-item-completed">
                                        <svg className="checklist-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M13.485 2.343a1 1 0 011.415 1.415l-8 8a1 1 0 01-1.415 0l-3-3a1 1 0 011.415-1.415L6 9.657l7.485-7.314z" />
                                        </svg>
                                        <span>Thông tin cơ bản</span>
                                    </div>
                                    <div className="checklist-item">
                                        <svg className="checklist-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                        <span>Chứng chỉ & bằng cấp</span>
                                    </div>
                                    <div className="checklist-item">
                                        <svg className="checklist-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                        <span>Video giới thiệu</span>
                                    </div>
                                </div>

                                <button className="widget-button widget-button-primary">Hoàn thiện ngay</button>
                            </div>

                            {/* Next Class Widget */}
                            <div className="widget next-class-widget">
                                <div className="widget-header">
                                    <h3 className="widget-title">Lớp học tiếp theo</h3>
                                    <span className="status-badge status-badge-upcoming">Sắp bắt đầu</span>
                                </div>

                                <div className="class-details">
                                    <div className="class-detail-row">
                                        <div className="detail-icon">🕐</div>
                                        <div className="detail-content">
                                            <p className="detail-label">Thời gian</p>
                                            <p className="detail-value">14:00 - 16:00 hôm nay</p>
                                        </div>
                                    </div>

                                    <div className="class-detail-row">
                                        <div className="detail-icon">📚</div>
                                        <div className="detail-content">
                                            <p className="detail-label">Môn học</p>
                                            <p className="detail-value">Toán 9 - Hàm số bậc nhất</p>
                                        </div>
                                    </div>

                                    <div className="class-detail-row">
                                        <div className="student-avatar">NT</div>
                                        <div className="detail-content">
                                            <p className="detail-label">Học sinh</p>
                                            <p className="detail-value">Nguyễn Tuấn</p>
                                        </div>
                                    </div>

                                    <div className="class-detail-row">
                                        <div className="detail-icon">📍</div>
                                        <div className="detail-content">
                                            <p className="detail-label">Địa điểm</p>
                                            <p className="detail-value">Online - Google Meet</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="widget-button widget-button-primary widget-button-large">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                    </svg>
                                    CHECK-IN VÀO LỚP
                                </button>

                                <p className="class-countdown">Bắt đầu sau 45 phút</p>
                            </div>

                            {/* Weekly Calendar Widget */}
                            <div className="widget weekly-calendar-widget">
                                <div className="widget-header">
                                    <h3 className="widget-title">Lịch tuần này</h3>
                                    <button className="widget-link">
                                        Xem tất cả
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="calendar-grid">
                                    <div className="calendar-day">
                                        <span className="day-name">CN</span>
                                        <div className="day-number day-number-active">11</div>
                                    </div>

                                    <div className="calendar-day">
                                        <span className="day-name">Th 2</span>
                                        <div className="day-number">12</div>
                                        <div className="class-card class-card-blue">
                                            <span className="class-time">14:00</span>
                                            <span className="class-subject">Toán 9</span>
                                        </div>
                                    </div>

                                    <div className="calendar-day">
                                        <span className="day-name">Th 3</span>
                                        <div className="day-number">13</div>
                                    </div>

                                    <div className="calendar-day">
                                        <span className="day-name">Th 4</span>
                                        <div className="day-number">14</div>
                                        <div className="class-card class-card-purple">
                                            <span className="class-time">16:00</span>
                                            <span className="class-subject">Lý 10</span>
                                        </div>
                                    </div>

                                    <div className="calendar-day">
                                        <span className="day-name">Th 5</span>
                                        <div className="day-number">15</div>
                                    </div>

                                    <div className="calendar-day">
                                        <span className="day-name">Th 6</span>
                                        <div className="day-number">16</div>
                                        <div className="class-card class-card-green">
                                            <span className="class-time">15:00</span>
                                            <span className="class-subject">Hóa 11</span>
                                        </div>
                                    </div>

                                    <div className="calendar-day">
                                        <span className="day-name">Th 7</span>
                                        <div className="day-number">17</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="dashboard-right">
                            {/* Finance Widget */}
                            <div className="widget finance-widget">
                                <div className="widget-header">
                                    <h3 className="widget-title">Tổng quan thu nhập</h3>
                                    <select className="time-filter">
                                        <option>Tháng này</option>
                                        <option>Tuần này</option>
                                        <option>Hôm nay</option>
                                    </select>
                                </div>

                                <div className="finance-stats">
                                    <div className="finance-stat finance-stat-income">
                                        <div className="stat-header">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 3L3 9H7V17H13V9H17L10 3Z" />
                                            </svg>
                                            <span className="stat-label">Thu nhập</span>
                                        </div>
                                        <p className="stat-amount">5.700.000 ₫</p>
                                        <p className="stat-change stat-change-positive">+12% so với tháng trước</p>
                                    </div>

                                    <div className="finance-stat finance-stat-balance">
                                        <div className="stat-header">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4C2.89543 4 2 4.89543 2 6V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V6C18 4.89543 17.1046 4 16 4H4Z" />
                                            </svg>
                                            <span className="stat-label">Số dư</span>
                                        </div>
                                        <p className="stat-amount">3.500.000 ₫</p>
                                        <p className="stat-change">Có thể rút</p>
                                    </div>
                                </div>

                                <div className="transaction-list">
                                    <div className="transaction-item">
                                        <div className="transaction-info">
                                            <div className="transaction-icon">📚</div>
                                            <div className="transaction-details">
                                                <p className="transaction-name">Toán 9 - Buổi 12</p>
                                                <p className="transaction-date">20/10/2023</p>
                                            </div>
                                        </div>
                                        <span className="transaction-amount transaction-amount-positive">+190.000 ₫</span>
                                    </div>

                                    <div className="transaction-item">
                                        <div className="transaction-info">
                                            <div className="transaction-icon">🔬</div>
                                            <div className="transaction-details">
                                                <p className="transaction-name">Lý 10 - Buổi 4</p>
                                                <p className="transaction-date">18/10/2023</p>
                                            </div>
                                        </div>
                                        <span className="transaction-amount transaction-amount-positive">+200.000 ₫</span>
                                    </div>
                                </div>

                                <button className="widget-link widget-link-centered">
                                    Xem chi tiết
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Messages & Offers Widget */}
                            <div className="widget messages-widget">
                                <div className="widget-header">
                                    <h3 className="widget-title">Tin nhắn & Đề xuất</h3>
                                    <span className="notification-badge">2 mới</span>
                                </div>

                                <div className="message-list">
                                    <div className="message-item message-item-highlighted">
                                        <div className="message-content">
                                            <div className="message-avatar">P</div>
                                            <div className="message-details">
                                                <div className="message-header">
                                                    <span className="message-sender">Phụ huynh Ngọc Anh</span>
                                                    <span className="message-time">10 phút trước</span>
                                                </div>
                                                <p className="message-preview">Em cần tìm gia sư Toán lớp 9...</p>
                                                <div className="message-tags">
                                                    <span className="message-tag message-tag-subject">Toán 9</span>
                                                    <span className="message-tag message-tag-offer">Job Offer</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="message-item">
                                        <div className="message-content">
                                            <div className="message-avatar">P</div>
                                            <div className="message-details">
                                                <div className="message-header">
                                                    <span className="message-sender">Phụ huynh Minh Tuấn</span>
                                                    <span className="message-time">1 giờ trước</span>
                                                </div>
                                                <p className="message-preview">Lịch học tuần sau có thể dời...</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="message-item message-item-highlighted">
                                        <div className="message-content">
                                            <div className="message-avatar message-avatar-system">H</div>
                                            <div className="message-details">
                                                <div className="message-header">
                                                    <span className="message-sender">Hệ thống AGORA</span>
                                                    <span className="message-time">2 giờ trước</span>
                                                </div>
                                                <p className="message-preview">Bạn có 1 đánh giá mới từ học sinh</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="widget-link widget-link-centered">
                                    Xem tất cả
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Performance Widget */}
                            <div className="widget performance-widget">
                                <div className="widget-header">
                                    <h3 className="widget-title">Hiệu suất dạy học</h3>
                                    <button className="widget-link">Chi tiết</button>
                                </div>

                                <div className="performance-stats">
                                    <div className="performance-stat">
                                        <div className="performance-value">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="#D4B483">
                                                <path d="M8 0L9.7 5.5H15.6L10.9 8.9L12.6 14.4L8 11L3.4 14.4L5.1 8.9L0.4 5.5H6.3L8 0Z" />
                                            </svg>
                                            <strong>4.9</strong>
                                        </div>
                                        <p className="performance-label">Đánh giá TB</p>
                                    </div>

                                    <div className="performance-stat">
                                        <div className="performance-value">
                                            <strong>20</strong>
                                        </div>
                                        <p className="performance-label">Buổi/tháng</p>
                                    </div>

                                    <div className="performance-stat">
                                        <div className="performance-value">
                                            <strong>98%</strong>
                                        </div>
                                        <p className="performance-label">Điểm danh</p>
                                    </div>
                                </div>

                                <div className="performance-chart">
                                    <div className="chart-placeholder">
                                        {/* Simple bar chart representation */}
                                        <div className="chart-bars">
                                            <div className="chart-bar" style={{ height: '40%' }}>
                                                <span className="bar-label">T7</span>
                                            </div>
                                            <div className="chart-bar" style={{ height: '55%' }}>
                                                <span className="bar-label">T8</span>
                                            </div>
                                            <div className="chart-bar" style={{ height: '65%' }}>
                                                <span className="bar-label">T9</span>
                                            </div>
                                            <div className="chart-bar chart-bar-active" style={{ height: '95%' }}>
                                                <span className="bar-label">T10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="chart-legend">
                                    <div className="legend-dot"></div>
                                    <span className="legend-label">Số buổi dạy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorWorkspacePage;
