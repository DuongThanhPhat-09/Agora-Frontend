import React from 'react';
import '../../styles/pages/tutor-schedule.css';

const TutorScheduleContent: React.FC = () => {
    return (
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
    );
};

export default TutorScheduleContent;
