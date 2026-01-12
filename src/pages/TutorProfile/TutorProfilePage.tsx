import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/tutor-profile.css';

const TutorProfilePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="tutor-profile-page">
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

                    <div className="nav-item" onClick={() => navigate('/tutor-wallet')}>
                        <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4C4 2.89543 4.89543 2 6 2H14C15.1046 2 16 2.89543 16 4V18L10 15L4 18V4Z" />
                        </svg>
                        <span className="nav-text">Ví của tôi</span>
                    </div>

                    <div className="nav-item nav-item-active" onClick={() => navigate('/tutor-profile')}>
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
                                <span className="breadcrumb-item breadcrumb-current">Dashboard</span>
                            </nav>
                            <h2 className="page-greeting">Chào buổi chiều, Minh! 👋</h2>
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
                                    <path d="M10 2C6.5 2 4 4.5 4 8C4 12.5 10 18 10 18C10 18 16 12.5 16 8C16 4.5 13.5 2 10 2Z" />
                                    <circle cx="10" cy="8" r="2" fill="white" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Profile Page Content */}
                <div className="profile-content">
                    {/* Profile Status Banner */}
                    <div className="profile-status-banner">
                        <div className="status-icon">⏳</div>
                        <div className="status-text">
                            <h3 className="status-title">Cập nhật đang chờ duyệt</h3>
                            <p className="status-description">Bạn vừa cập nhật hồ sơ. Admin đang xét duyệt (dự kiến 24h). Phụ huynh vẫn sẽ thấy thông tin cũ cho đến khi được duyệt.</p>
                            <button className="status-button">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Xem so sánh thay đổi
                            </button>
                        </div>
                    </div>

                    {/* Profile Header */}
                    <div className="profile-header-section">
                        <div className="profile-title-group">
                            <h1 className="profile-main-title">Hồ sơ gia sư</h1>
                            <p className="profile-subtitle">Quản lý thông tin cá nhân và chuyên môn của bạn</p>
                        </div>
                        <div className="profile-actions">
                            <button className="profile-action-btn btn-preview">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" />
                                    <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" />
                                </svg>
                                Xem với tư cách Phụ huynh
                            </button>
                            <div className="toggle-container">
                                <span className="toggle-label">Nhận lớp mới</span>
                                <button className="toggle-switch toggle-on">
                                    <span className="toggle-knob"></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Grid */}
                    <div className="profile-grid">
                        {/* Left Column - Profile Card */}
                        <div className="profile-left-column">
                            <div className="profile-card">
                                <div className="profile-avatar-section">
                                    <div className="avatar-large">M</div>
                                    <button className="avatar-edit-btn">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                </div>
                                <h2 className="profile-name">Nguyễn Văn Minh</h2>
                                <div className="profile-badges">
                                    <span className="badge badge-verified">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Đã xác thực
                                    </span>
                                    <span className="badge badge-certified">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Bằng cấp đã duyệt
                                    </span>
                                </div>
                            </div>

                            {/* Video Section */}
                            <div className="video-section">
                                <div className="video-placeholder">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <circle cx="24" cy="24" r="20" fill="#E4DED5" />
                                        <path d="M20 16L32 24L20 32V16Z" fill="#6B7280" />
                                    </svg>
                                    <p className="video-hint">Video giới thiệu giúp tăng 3x cơ hội được chọn</p>
                                </div>
                                <button className="btn-upload-video">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    Cập nhật Video
                                </button>
                            </div>

                            {/* Trust Score */}
                            <div className="trust-score-card">
                                <div className="trust-header">
                                    <div className="trust-title">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 2L9 6L13 6L10 9L11 13L8 11L5 13L6 9L3 6L7 6L8 2Z" />
                                        </svg>
                                        Độ tin cậy
                                    </div>
                                    <span className="trust-percentage">85%</span>
                                </div>
                                <div className="trust-progress">
                                    <div className="trust-progress-fill" style={{ width: '85%' }}></div>
                                </div>
                                <div className="trust-details">
                                    <div className="trust-suggestion">
                                        <p className="suggestion-label">💡 Gợi ý tăng điểm</p>
                                        <p className="suggestion-text">Thêm 1 chứng chỉ IELTS để đạt 100%</p>
                                    </div>
                                    <div className="trust-completed">
                                        <p className="completed-label">Đã hoàn thành</p>
                                        <div className="completed-list">
                                            <div className="completed-item">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>Xác thực CCCD</span>
                                            </div>
                                            <div className="completed-item">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>Xác thực bằng cấp</span>
                                            </div>
                                            <div className="completed-item">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>Thêm video giới thiệu</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Profile Information */}
                        <div className="profile-right-column">
                            {/* Basic Info Block */}
                            <div className="info-block">
                                <div className="block-header">
                                    <h3 className="block-title">Thông tin hiển thị</h3>
                                    <button className="btn-edit">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M11.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.379 4.793L1 13.172V16h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Sửa
                                    </button>
                                </div>
                                <div className="info-fields">
                                    <div className="info-field">
                                        <label className="field-label">TÊN HIỂN THỊ</label>
                                        <p className="field-value">Nguyễn Văn Minh</p>
                                    </div>
                                    <div className="info-field">
                                        <label className="field-label">TIÊU ĐỀ (HEADLINE)</label>
                                        <p className="field-value">Gia sư Toán tâm huyết, chuyên luyện thi vào 10</p>
                                    </div>
                                    <div className="info-field">
                                        <label className="field-label">GIỚI THIỆU BẢN THÂN</label>
                                        <p className="field-value field-value-multiline">Tôi có 5 năm kinh nghiệm giảng dạy Toán THCS và THPT. Chuyên giúp học sinh nắm vững kiến thức nền tảng và tự tin với kỳ thi. Phương pháp giảng dạy của tôi tập trung vào việc hiểu bản chất bài toán thay vì học vẹt công thức.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Education Block */}
                            <div className="info-block">
                                <div className="block-header">
                                    <h3 className="block-title">Học vấn & Chứng chỉ</h3>
                                    <button className="btn-edit">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M11.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.379 4.793L1 13.172V16h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Sửa
                                    </button>
                                </div>
                                <div className="education-list">
                                    <div className="education-item">
                                        <div className="education-icon">🎓</div>
                                        <div className="education-content">
                                            <div className="education-info">
                                                <h4 className="education-school">ĐH Sư Phạm Hà Nội</h4>
                                                <p className="education-degree">Cử nhân - Sư phạm Toán</p>
                                            </div>
                                            <span className="status-badge status-verified">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Đã xác thực
                                            </span>
                                        </div>
                                    </div>
                                    <div className="education-item education-pending">
                                        <div className="education-icon">📜</div>
                                        <div className="education-content">
                                            <div className="education-info">
                                                <h4 className="education-school">British Council</h4>
                                                <p className="education-degree">Chứng chỉ - IELTS 7.5</p>
                                            </div>
                                            <span className="status-badge status-pending">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                </svg>
                                                Đang chờ duyệt
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Services Block */}
                            <div className="info-block">
                                <div className="block-header">
                                    <h3 className="block-title">Dịch vụ & Học phí</h3>
                                    <button className="btn-edit">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M11.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.379 4.793L1 13.172V16h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Sửa
                                    </button>
                                </div>
                                <div className="services-content">
                                    <div className="services-section">
                                        <label className="services-label">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 2L9 6H13L10 9L11 13L8 11L5 13L6 9L3 6H7L8 2Z" />
                                            </svg>
                                            MÔN HỌC GIẢNG DẠY
                                        </label>
                                        <div className="subject-tags">
                                            <span className="subject-tag">Toán 9</span>
                                            <span className="subject-tag">Toán 10</span>
                                            <span className="subject-tag">Luyện thi vào 10</span>
                                        </div>
                                    </div>
                                    <div className="services-section">
                                        <label className="services-label">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M4 4C2.89543 4 2 4.89543 2 6V10C2 11.1046 2.89543 12 4 12H12C13.1046 12 14 11.1046 14 10V6C14 4.89543 13.1046 4 12 4H4Z" />
                                            </svg>
                                            HỌC PHÍ
                                        </label>
                                        <div className="fee-card">
                                            <div className="fee-amount">
                                                <span className="fee-number">200,000</span>
                                                <span className="fee-currency">đ</span>
                                                <span className="fee-unit">/ buổi</span>
                                            </div>
                                            <div className="fee-note">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                    <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <p><strong>Lưu ý:</strong> Giá mới sẽ chỉ áp dụng cho lớp mới. Lớp cũ giữ nguyên giá đã thỏa thuận.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* KYC Block */}
                            <div className="kyc-block">
                                <div className="kyc-header">
                                    <div className="kyc-icon">🔒</div>
                                    <div className="kyc-title-group">
                                        <h3 className="block-title">
                                            Xác thực danh tính
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                                <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </h3>
                                        <p className="kyc-subtitle">Chỉ Admin được xem thông tin này</p>
                                    </div>
                                </div>

                                <div className="kyc-warning">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 2L2 18H18L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                        <path d="M10 8V12M10 14V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <div className="kyc-warning-content">
                                        <p className="kyc-warning-title">⚠️ Cảnh báo quan trọng</p>
                                        <p className="kyc-warning-text">
                                            Việc thay đổi giấy tờ sẽ khiến tài khoản bị <strong>tạm khóa nhận lớp</strong> cho đến khi Admin duyệt lại.
                                        </p>
                                    </div>
                                </div>

                                <div className="id-cards">
                                    <div className="id-card">
                                        <div className="id-card-header">
                                            <h4 className="id-card-title">CCCD Mặt trước</h4>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" />
                                                <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" />
                                            </svg>
                                        </div>
                                        <div className="id-card-image">📄</div>
                                        <span className="id-status status-approved">Đã duyệt</span>
                                    </div>
                                    <div className="id-card">
                                        <div className="id-card-header">
                                            <h4 className="id-card-title">CCCD Mặt sau</h4>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" />
                                                <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" />
                                            </svg>
                                        </div>
                                        <div className="id-card-image">📄</div>
                                        <span className="id-status status-approved">Đã duyệt</span>
                                    </div>
                                </div>

                                <button className="btn-update-kyc">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 2V14M2 8H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    Cập nhật giấy tờ
                                </button>

                                <div className="kyc-footer">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                        <path d="M6 3V6M6 8V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <p className="kyc-footer-text">Thông tin này được mã hóa và chỉ Admin có quyền truy cập. AGORA cam kết bảo mật tuyệt đối thông tin cá nhân của bạn.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorProfilePage;
