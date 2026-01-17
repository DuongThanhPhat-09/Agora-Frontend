import React from 'react';
import '../../styles/pages/tutor-classes.css';

const TutorClassesPage: React.FC = () => {
    return (
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
    );
};

export default TutorClassesPage;
