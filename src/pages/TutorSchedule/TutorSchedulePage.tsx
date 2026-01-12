import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/tutor-schedule.css';

const TutorSchedulePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="tutor-schedule-dashboard">
            {/* Sidebar */}
            <aside className="schedule-sidebar">
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

                    <div className="nav-item nav-item-active" onClick={() => navigate('/tutor-schedule')}>
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

                    <div className="nav-item">
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
            <div className="schedule-main">
                {/* Header */}
                <header className="schedule-header">
                    <div className="header-content">
                        <div className="breadcrumb-section">
                            <nav className="breadcrumb">
                                <span className="breadcrumb-item">Trang chủ</span>
                                <span className="breadcrumb-separator">›</span>
                                <span className="breadcrumb-item breadcrumb-current">Lịch dạy</span>
                            </nav>
                            <h2 className="page-title">Lịch dạy & Điểm danh</h2>
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
                                    <path d="M10 2C10.5523 2 11 2.44772 11 3V4H13C14.1046 4 15 4.89543 15 6V8H17C17.5523 8 18 8.44772 18 9C18 9.55228 17.5523 10 17 10H15V12C15 13.1046 14.1046 14 13 14H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V14H7C5.89543 14 5 13.1046 5 12V10H3C2.44772 10 2 9.55228 2 9C2 8.44772 2.44772 8 3 8H5V6C5 4.89543 5.89543 4 7 4H9V3C9 2.44772 9.44772 2 10 2Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Schedule Content */}
                <div className="schedule-content">
                    <div className="schedule-page">
                        {/* Schedule Toolbar */}
                        <div className="schedule-toolbar">
                            <div className="toolbar-container">
                                <div className="view-buttons">
                                    <button className="view-button view-button-active">Tuần</button>
                                    <button className="view-button">Tháng</button>
                                    <button className="view-button">Ngày</button>
                                    <button className="view-button">Danh sách</button>
                                </div>

                                <div className="navigation-controls">
                                    <button className="nav-arrow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <p className="current-period">tháng 1 năm 2026</p>
                                    <button className="nav-arrow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button className="today-button">Hôm nay</button>
                                </div>

                                <div className="filter-controls">
                                    <div className="filter-dropdown">
                                        <select className="filter-select">
                                            <option>Tất cả học sinh</option>
                                            <option>Nguyễn Văn A</option>
                                            <option>Trần Thị B</option>
                                        </select>
                                    </div>
                                    <div className="filter-dropdown">
                                        <select className="filter-select">
                                            <option>Tất cả trạng thái</option>
                                            <option>Sắp tới</option>
                                            <option>Đã hoàn thành</option>
                                            <option>Đổi lịch</option>
                                            <option>Đã hủy</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Week Calendar Grid */}
                        <div className="week-calendar-grid">
                            {/* Calendar Header */}
                            <div className="calendar-header">
                                <div className="header-cell time-header">
                                    <b>Giờ</b>
                                </div>
                                <div className="header-cell">
                                    <div className="day-name">Th 2</div>
                                    <div className="day-number"><b>12</b></div>
                                </div>
                                <div className="header-cell">
                                    <div className="day-name">Th 3</div>
                                    <div className="day-number"><b>13</b></div>
                                </div>
                                <div className="header-cell">
                                    <div className="day-name">Th 4</div>
                                    <div className="day-number"><b>14</b></div>
                                </div>
                                <div className="header-cell">
                                    <div className="day-name">Th 5</div>
                                    <div className="day-number"><b>15</b></div>
                                </div>
                                <div className="header-cell">
                                    <div className="day-name">Th 6</div>
                                    <div className="day-number"><b>16</b></div>
                                </div>
                                <div className="header-cell">
                                    <div className="day-name">Th 7</div>
                                    <div className="day-number"><b>17</b></div>
                                </div>
                                <div className="header-cell">
                                    <div className="day-name">CN</div>
                                    <div className="day-number"><b>18</b></div>
                                </div>
                            </div>

                            {/* Calendar Body */}
                            <div className="calendar-body">
                                {/* Time Column */}
                                <div className="time-column">
                                    {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(hour => (
                                        <div key={hour} className="time-slot">
                                            <div className="time-label">{hour}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Day Columns with Grid */}
                                <div className="days-grid">
                                    {/* Background Grid */}
                                    <div className="grid-lines">
                                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(hour => (
                                            <div key={hour} className="grid-row"></div>
                                        ))}
                                    </div>

                                    {/* Monday */}
                                    <div className="day-column">
                                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(hour => (
                                            <div key={hour} className="hour-cell"></div>
                                        ))}
                                    </div>

                                    {/* Tuesday */}
                                    <div className="day-column">
                                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour, index) => (
                                            <div key={hour} className="hour-cell">
                                                {index === 7 && (
                                                    <>
                                                        <div className="class-event event-blue">
                                                            <div className="event-content">
                                                                <p className="event-title"><b>Toán 9</b></p>
                                                                <p className="event-student">Nguyễn Văn A</p>
                                                                <p className="event-time">14:00 - 15:30</p>
                                                            </div>
                                                        </div>
                                                        <div className="class-event event-blue" style={{ marginTop: '40px' }}>
                                                            <div className="event-content">
                                                                <p className="event-title"><b>Lý 10</b></p>
                                                                <p className="event-student">Trần Thị B</p>
                                                                <p className="event-time">16:00 - 17:30</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Wednesday */}
                                    <div className="day-column">
                                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour, index) => (
                                            <div key={hour} className="hour-cell">
                                                {index === 8 && (
                                                    <div className="class-event event-yellow">
                                                        <div className="event-content">
                                                            <p className="event-title"><b>Hóa 11</b></p>
                                                            <p className="event-student">Lê Văn C</p>
                                                            <p className="event-time">15:00 - 16:30</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Thursday */}
                                    <div className="day-column">
                                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour, index) => (
                                            <div key={hour} className="hour-cell">
                                                {index === 7 && (
                                                    <div className="class-event event-green">
                                                        <div className="event-content">
                                                            <p className="event-title"><b>Toán 9</b></p>
                                                            <p className="event-student">Nguyễn Văn A</p>
                                                            <p className="event-time">14:00 - 15:30</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Friday */}
                                    <div className="day-column">
                                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(hour => (
                                            <div key={hour} className="hour-cell"></div>
                                        ))}
                                    </div>

                                    {/* Saturday */}
                                    <div className="day-column">
                                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour, index) => (
                                            <div key={hour} className="hour-cell">
                                                {index === 3 && (
                                                    <div className="class-event event-blue">
                                                        <div className="event-content">
                                                            <p className="event-title"><b>Toán 8</b></p>
                                                            <p className="event-student">Phạm Thị D</p>
                                                            <p className="event-time">10:00 - 11:30</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Sunday */}
                                    <div className="day-column">
                                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(hour => (
                                            <div key={hour} className="hour-cell"></div>
                                        ))}
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

export default TutorSchedulePage;
