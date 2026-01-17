import React from 'react';
import '../../styles/pages/tutor-workspace.css';

const TutorDashboard: React.FC = () => {
    return (
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
    );
};

export default TutorDashboard;
