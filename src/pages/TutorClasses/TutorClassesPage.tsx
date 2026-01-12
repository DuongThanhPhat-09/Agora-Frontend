import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/tutor-classes.css';

const TutorClassesPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="tutor-classes-dashboard">
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

                    <div className="nav-item nav-item-active" onClick={() => navigate('/tutor-classes')}>
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

                    <div className="nav-item" onClick={() => navigate('/tutor-profile')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z" />
                            <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z" />
                        </svg>
                        <span className="nav-text">Hồ sơ</span>
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
                                <span className="breadcrumb-item breadcrumb-current">Lớp học</span>
                            </nav>
                            <h2 className="page-title">Danh sách lớp học</h2>
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

                {/* Classes Content */}
                <div className="classes-content">
                    <div className="classes-page">
                        {/* Actions Bar */}
                        <div className="classes-actions">
                            <p className="classes-subtitle">Quản lý hồ sơ, tài liệu và sổ điểm của 4 học sinh</p>
                            <button className="add-student-button">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 5C10.5523 5 11 5.44772 11 6V9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H11V14C11 14.5523 10.5523 15 10 15C9.44772 15 9 14.5523 9 14V11H6C5.44772 11 5 10.5523 5 10C5 9.44772 5.44772 9 6 9H9V6C9 5.44772 9.44772 5 10 5Z" />
                                </svg>
                                Thêm học sinh mới
                            </button>
                        </div>

                        {/* Filter Section */}
                        <div className="filter-section">
                            <div className="filter-controls">
                                <select className="filter-dropdown">
                                    <option>Tất cả</option>
                                    <option>Đang dạy</option>
                                    <option>Đã kết thúc</option>
                                </select>

                                <select className="filter-dropdown">
                                    <option>Tất cả môn</option>
                                    <option>Toán</option>
                                    <option>Lý</option>
                                    <option>Hóa</option>
                                    <option>Anh</option>
                                </select>

                                <div className="view-toggle">
                                    <button className="view-button view-button-active">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M3 4C3 3.44772 3.44772 3 4 3H7C7.55228 3 8 3.44772 8 4V7C8 7.55228 7.55228 8 7 8H4C3.44772 8 3 7.55228 3 7V4Z" />
                                            <path d="M3 13C3 12.4477 3.44772 12 4 12H7C7.55228 12 8 12.4477 8 13V16C8 16.5523 7.55228 17 7 17H4C3.44772 17 3 16.5523 3 16V13Z" />
                                            <path d="M12 4C12 3.44772 12.4477 3 13 3H16C16.5523 3 17 3.44772 17 4V7C17 7.55228 16.5523 8 16 8H13C12.4477 8 12 7.55228 12 7V4Z" />
                                            <path d="M13 12C12.4477 12 12 12.4477 12 13V16C12 16.5523 12.4477 17 13 17H16C16.5523 17 17 16.5523 17 16V13C17 12.4477 16.5523 12 16 12H13Z" />
                                        </svg>
                                    </button>
                                    <button className="view-button">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M3 5C3 4.44772 3.44772 4 4 4H16C16.5523 4 17 4.44772 17 5C17 5.55228 16.5523 6 16 6H4C3.44772 6 3 5.55228 3 5Z" />
                                            <path d="M3 10C3 9.44772 3.44772 9 4 9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H4C3.44772 11 3 10.5523 3 10Z" />
                                            <path d="M3 15C3 14.4477 3.44772 14 4 14H16C16.5523 14 17 14.4477 17 15C17 15.5523 16.5523 16 16 16H4C3.44772 16 3 15.5523 3 15Z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="search-container search-container-inline">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Tìm theo tên học sinh hoặc môn học..."
                                    />
                                    <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                                        <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Classes Grid */}
                        <div className="classes-grid">
                            {/* Class Card 1 */}
                            <div className="class-card">
                                <div className="class-card-header">
                                    <div className="student-info">
                                        <div className="student-avatar-large">A</div>
                                        <div className="student-details">
                                            <h3 className="student-name">Nguyễn Văn A</h3>
                                            <span className="subject-badge subject-badge-blue">Toán 9</span>
                                        </div>
                                    </div>
                                    <button className="menu-button">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <circle cx="10" cy="5" r="1.5" />
                                            <circle cx="10" cy="10" r="1.5" />
                                            <circle cx="10" cy="15" r="1.5" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="class-card-body">
                                    <div className="class-info-item">
                                        <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0C8.53043 0 9.03914 0.210714 9.41421 0.585786C9.78929 0.960859 10 1.46957 10 2V4H12C13.1046 4 14 4.89543 14 6V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V6C2 4.89543 2.89543 4 4 4H6V2C6 1.46957 6.21071 0.960859 6.58579 0.585786C6.96086 0.210714 7.46957 0 8 0Z" />
                                        </svg>
                                        <span>T3, T5 - 19:30</span>
                                    </div>

                                    <div className="class-info-item">
                                        <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V14L8 11L2 14V4Z" />
                                        </svg>
                                        <span>12 buổi đã dạy</span>
                                    </div>

                                    <div className="class-stats">
                                        <div className="stat-row">
                                            <div className="stat-label">
                                                <svg className="stat-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 0L12.2451 7.00383L19.5106 7.95492L14.6139 12.4962L15.8779 19.6947L10 16.18L4.12215 19.6947L5.38606 12.4962L0.489435 7.95492L7.75486 7.00383L10 0Z" />
                                                </svg>
                                                <span>Điểm TB</span>
                                            </div>
                                            <span className="stat-value stat-value-excellent">8.5</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="class-card-footer">
                                    <span className="status-badge status-badge-active">✓ Đang dạy</span>
                                </div>
                            </div>

                            {/* Class Card 2 */}
                            <div className="class-card">
                                <div className="class-card-header">
                                    <div className="student-info">
                                        <div className="student-avatar-large">B</div>
                                        <div className="student-details">
                                            <h3 className="student-name">Trần Thị B</h3>
                                            <span className="subject-badge subject-badge-purple">Lý 10</span>
                                        </div>
                                    </div>
                                    <button className="menu-button">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <circle cx="10" cy="5" r="1.5" />
                                            <circle cx="10" cy="10" r="1.5" />
                                            <circle cx="10" cy="15" r="1.5" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="class-card-body">
                                    <div className="class-info-item">
                                        <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0C8.53043 0 9.03914 0.210714 9.41421 0.585786C9.78929 0.960859 10 1.46957 10 2V4H12C13.1046 4 14 4.89543 14 6V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V6C2 4.89543 2.89543 4 4 4H6V2C6 1.46957 6.21071 0.960859 6.58579 0.585786C6.96086 0.210714 7.46957 0 8 0Z" />
                                        </svg>
                                        <span>T2, T4 - 15:00</span>
                                    </div>

                                    <div className="class-info-item">
                                        <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V14L8 11L2 14V4Z" />
                                        </svg>
                                        <span>8 buổi đã dạy</span>
                                    </div>

                                    <div className="class-stats">
                                        <div className="stat-row">
                                            <div className="stat-label">
                                                <svg className="stat-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 0L12.2451 7.00383L19.5106 7.95492L14.6139 12.4962L15.8779 19.6947L10 16.18L4.12215 19.6947L5.38606 12.4962L0.489435 7.95492L7.75486 7.00383L10 0Z" />
                                                </svg>
                                                <span>Điểm TB</span>
                                            </div>
                                            <span className="stat-value stat-value-good">7.8</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="class-card-footer">
                                    <span className="status-badge status-badge-active">✓ Đang dạy</span>
                                </div>
                            </div>

                            {/* Class Card 3 */}
                            <div className="class-card">
                                <div className="class-card-header">
                                    <div className="student-info">
                                        <div className="student-avatar-large">C</div>
                                        <div className="student-details">
                                            <h3 className="student-name">Lê Văn C</h3>
                                            <span className="subject-badge subject-badge-green">Hóa 11</span>
                                        </div>
                                    </div>
                                    <button className="menu-button">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <circle cx="10" cy="5" r="1.5" />
                                            <circle cx="10" cy="10" r="1.5" />
                                            <circle cx="10" cy="15" r="1.5" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="class-card-body">
                                    <div className="class-info-item">
                                        <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0C8.53043 0 9.03914 0.210714 9.41421 0.585786C9.78929 0.960859 10 1.46957 10 2V4H12C13.1046 4 14 4.89543 14 6V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V6C2 4.89543 2.89543 4 4 4H6V2C6 1.46957 6.21071 0.960859 6.58579 0.585786C6.96086 0.210714 7.46957 0 8 0Z" />
                                        </svg>
                                        <span>T3, T6 - 14:00</span>
                                    </div>

                                    <div className="class-info-item">
                                        <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V14L8 11L2 14V4Z" />
                                        </svg>
                                        <span>15 buổi đã dạy</span>
                                    </div>

                                    <div className="class-stats">
                                        <div className="stat-row">
                                            <div className="stat-label">
                                                <svg className="stat-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 0L12.2451 7.00383L19.5106 7.95492L14.6139 12.4962L15.8779 19.6947L10 16.18L4.12215 19.6947L5.38606 12.4962L0.489435 7.95492L7.75486 7.00383L10 0Z" />
                                                </svg>
                                                <span>Điểm TB</span>
                                            </div>
                                            <span className="stat-value stat-value-excellent">9.2</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="class-card-footer">
                                    <span className="status-badge status-badge-active">✓ Đang dạy</span>
                                </div>
                            </div>

                            {/* Class Card 4 - Completed */}
                            <div className="class-card">
                                <div className="class-card-header">
                                    <div className="student-info">
                                        <div className="student-avatar-large">E</div>
                                        <div className="student-details">
                                            <h3 className="student-name">Hoàng Văn E</h3>
                                            <span className="subject-badge subject-badge-orange">Anh 12</span>
                                        </div>
                                    </div>
                                    <button className="menu-button">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <circle cx="10" cy="5" r="1.5" />
                                            <circle cx="10" cy="10" r="1.5" />
                                            <circle cx="10" cy="15" r="1.5" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="class-card-body">
                                    <div className="class-info-item">
                                        <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0C8.53043 0 9.03914 0.210714 9.41421 0.585786C9.78929 0.960859 10 1.46957 10 2V4H12C13.1046 4 14 4.89543 14 6V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V6C2 4.89543 2.89543 4 4 4H6V2C6 1.46957 6.21071 0.960859 6.58579 0.585786C6.96086 0.210714 7.46957 0 8 0Z" />
                                        </svg>
                                        <span>T5 - 18:00</span>
                                    </div>

                                    <div className="class-info-item">
                                        <svg className="info-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V14L8 11L2 14V4Z" />
                                        </svg>
                                        <span>20 buổi đã dạy</span>
                                    </div>

                                    <div className="class-stats">
                                        <div className="stat-row">
                                            <div className="stat-label">
                                                <svg className="stat-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 0L12.2451 7.00383L19.5106 7.95492L14.6139 12.4962L15.8779 19.6947L10 16.18L4.12215 19.6947L5.38606 12.4962L0.489435 7.95492L7.75486 7.00383L10 0Z" />
                                                </svg>
                                                <span>Điểm TB</span>
                                            </div>
                                            <span className="stat-value stat-value-good">8.0</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="class-card-footer">
                                    <span className="status-badge status-badge-completed">Đã kết thúc</span>
                                </div>
                            </div>

                            {/* Class Card 5 - Locked */}
                            <div className="class-card class-card-locked">
                                <div className="locked-overlay">
                                    <svg className="lock-icon" width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
                                        <path d="M32 2C22.0589 2 14 10.0589 14 20V26H10C7.79086 26 6 27.7909 6 30V54C6 56.2091 7.79086 58 10 58H54C56.2091 58 58 56.2091 58 54V30C58 27.7909 56.2091 26 54 26H50V20C50 10.0589 41.9411 2 32 2ZM32 6C39.732 6 46 12.268 46 20V26H18V20C18 12.268 24.268 6 32 6Z" />
                                    </svg>
                                    <p className="locked-text">Nâng cấp để mở khóa</p>
                                    <button className="upgrade-now-button">
                                        👑 Nâng cấp ngay
                                    </button>
                                </div>

                                <div className="class-card-header class-card-blurred">
                                    <div className="student-info">
                                        <div className="student-avatar-large">D</div>
                                        <div className="student-details">
                                            <h3 className="student-name">Phạm Thị D</h3>
                                            <span className="subject-badge subject-badge-blue">Toán 8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorClassesPage;
