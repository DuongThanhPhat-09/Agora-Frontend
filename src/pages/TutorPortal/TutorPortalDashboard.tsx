import React, { useState, useEffect } from 'react';
import styles from '../../styles/pages/tutor-portal-dashboard.module.css';
import { getTutorDashboardStats, getTutorCalendar, type TutorDashboardStats, type CalendarDay, type CalendarLesson } from '../../services/lesson.service';
import { getTutorFeedbacks, type FeedbackDto } from '../../services/feedback.service';
import { getCurrentUser } from '../../services/auth.service';
import ReplyFeedbackModal from './components/ReplyFeedbackModal';

// Icons
const ClockIcon = () => (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10.5" cy="10.5" r="8.5" />
        <path d="M10.5 5.5V10.5L14 14" strokeLinecap="round" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <path d="M6 1V3M12 1V3M2 7H16M4 3H14C15.1046 3 16 3.89543 16 5V15C16 16.1046 15.1046 17 14 17H4C2.89543 17 2 16.1046 2 15V5C2 3.89543 2.89543 3 4 3Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
);

const SessionsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="9" r="7" />
        <path d="M9 5V9L12 11" strokeLinecap="round" />
    </svg>
);

const StarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <path d="M9 1L11.09 6.26L17 6.97L12.82 10.72L14.18 16.5L9 13.27L3.82 16.5L5.18 10.72L1 6.97L6.91 6.26L9 1Z" />
    </svg>
);

const DollarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 1V17M13 4H7C5.34315 4 4 5.34315 4 7C4 8.65685 5.34315 10 7 10H11C12.6569 10 14 11.3431 14 13C14 14.6569 12.6569 16 11 16H4" strokeLinecap="round" />
    </svg>
);

const CheckInIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11.5 3.5L5.25 9.75L2.5 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 2V12M2 7H12" strokeLinecap="round" />
    </svg>
);

const BookIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 2H5C6.10457 2 7 2.89543 7 4V13C7 12.4477 6.55228 12 6 12H2V2Z" />
        <path d="M12 2H9C7.89543 2 7 2.89543 7 4V13C7 12.4477 7.44772 12 8 12H12V2Z" />
    </svg>
);

const MessageIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 3.5L7 7.5L13 3.5M1 10.5V3.5C1 2.94772 1.44772 2.5 2 2.5H12C12.5523 2.5 13 2.94772 13 3.5V10.5C13 11.0523 12.5523 11.5 12 11.5H2C1.44772 11.5 1 11.0523 1 10.5Z" strokeLinecap="round" />
    </svg>
);

const NoteIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 1.5H3.5C2.94772 1.5 2.5 1.94772 2.5 2.5V11.5C2.5 12.0523 2.94772 12.5 3.5 12.5H10.5C11.0523 12.5 11.5 12.0523 11.5 11.5V5M8 1.5L11.5 5M8 1.5V5H11.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const WithdrawIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 10V2M7 2L4 5M7 2L10 5M2 12H12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 11L5 7L9 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3L9 7L5 11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckboxIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="currentColor" strokeWidth="1.2" fill="transparent" />
    </svg>
);

const CheckedBoxIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="currentColor" strokeWidth="1.2" fill="transparent" />
        <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


const tasksData = [
    {
        id: 1,
        title: 'Xem báo cáo tiến độ của Nguyễn Văn A',
        date: '22 THÁNG 1, 2025',
        completed: false
    },
    {
        id: 2,
        title: 'Chuẩn bị tài liệu kiểm tra Hóa học',
        date: '23 THÁNG 1, 2025',
        completed: false
    }
];

const personalNote = {
    text: 'Nhớ cập nhật tài liệu giảng dạy cho các buổi học Vật lý tuần tới.',
    date: '20 Tháng 1, 2025'
};

const TutorPortalDashboard: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'today' | 'tomorrow' | 'week'>('today');
    const [currentMonth] = useState(new Date(2025, 0, 1)); // January 2025
    const [tasks, setTasks] = useState(tasksData);

    // API data states
    const [stats, setStats] = useState<TutorDashboardStats | null>(null);
    const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackDto[]>([]);
    const [replyModal, setReplyModal] = useState<{ open: boolean; feedback: FeedbackDto | null }>({ open: false, feedback: null });


    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch dashboard stats
                const statsResponse = await getTutorDashboardStats();
                if (statsResponse.content) {
                    setStats(statsResponse.content);
                }

                // Fetch calendar for current month
                const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

                const calendarResponse = await getTutorCalendar(
                    firstDay.toISOString(),
                    lastDay.toISOString()
                );
                if (calendarResponse.content) {
                    setCalendarData(calendarResponse.content);
                }

                // Fetch recent feedbacks
                const user = getCurrentUser();
                if (user?.userId) {
                    try {
                        const fbResponse = await getTutorFeedbacks(user.userId, 1, 3);
                        if (fbResponse.content?.items) {
                            setRecentFeedbacks(fbResponse.content.items);
                        } else if (Array.isArray(fbResponse.content)) {
                            setRecentFeedbacks(fbResponse.content as unknown as FeedbackDto[]);
                        }
                    } catch { /* feedback is optional */ }
                }
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentMonth]);

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const today = new Date();

        // Get days with sessions from calendar data
        const daysWithSessions = new Set(
            calendarData
                .filter(day => day.lessons && day.lessons.length > 0)
                .map(day => new Date(day.date).getDate())
        );

        // Days from previous month
        const startDay = firstDay.getDay();
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonth.getDate() - i,
                isCurrentMonth: false,
                hasSession: false
            });
        }

        // Days of current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const isToday = today.getDate() === i &&
                today.getMonth() === currentMonth.getMonth() &&
                today.getFullYear() === currentMonth.getFullYear();

            days.push({
                day: i,
                isCurrentMonth: true,
                hasSession: daysWithSessions.has(i),
                isToday
            });
        }

        // Days from next month
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                hasSession: false
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'starting_soon': return styles.statusStartingSoon;
            case 'ongoing': return styles.statusOngoing;
            case 'completed': return styles.statusCompleted;
            default: return '';
        }
    };

    const toggleTask = (taskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    // Get lessons based on selected tab
    const getFilteredLessons = (): CalendarLesson[] => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);

        return calendarData
            .filter(day => {
                const dayDate = new Date(day.date);
                dayDate.setHours(0, 0, 0, 0);

                if (selectedTab === 'today') {
                    return dayDate.getTime() === today.getTime();
                } else if (selectedTab === 'tomorrow') {
                    return dayDate.getTime() === tomorrow.getTime();
                } else {
                    return dayDate >= today && dayDate <= weekEnd;
                }
            })
            .flatMap(day => day.lessons || [])
            .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Bảng điều khiển</h1>
                <span className={styles.date}>Thứ Ba, 21 Tháng 1, 2025</span>
            </div>

            {/* Profile Under Review Banner */}
            <div className={styles.reviewBanner}>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerIcon}>
                        <ClockIcon />
                    </div>
                    <div className={styles.bannerText}>
                        <div className={styles.bannerTitleRow}>
                            <span className={styles.bannerTitle}>Hồ sơ của bạn đang được xem xét</span>
                            <span className={styles.pendingBadge}>Đang chờ</span>
                        </div>
                        <p className={styles.bannerDescription}>
                            Admin đang xác minh thông tin của bạn. Bạn sẽ xuất hiện trên marketplace sau khi được phê duyệt.
                        </p>
                    </div>
                </div>
                <button className={styles.viewDetailsBtn}>
                    Xem chi tiết
                    <ArrowRightIcon />
                </button>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : stats ? (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <CalendarIcon />
                            </div>
                        </div>
                        <div className={styles.statValue}>{stats.upcomingLessons}</div>
                        <div className={styles.statLabel}>Buổi học sắp tới</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <SessionsIcon />
                            </div>
                        </div>
                        <div className={styles.statValue}>{stats.completedThisMonth}</div>
                        <div className={styles.statLabel}>Hoàn thành tháng này</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <StarIcon />
                            </div>
                        </div>
                        <div className={styles.statValue}>{stats.averageRating.toFixed(1)}</div>
                        <div className={styles.statLabel}>Đánh giá trung bình ({stats.totalReviews} đánh giá)</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <DollarIcon />
                            </div>
                        </div>
                        <div className={styles.statValue}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.earningsThisMonth)}
                        </div>
                        <div className={styles.statLabel}>Doanh thu tháng</div>
                    </div>
                </div>
            ) : null}

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <button className={styles.actionBtn}>
                    <CheckInIcon />
                    <span>Bắt đầu điểm danh</span>
                </button>
                <button className={styles.actionBtn}>
                    <PlusIcon />
                    <span>Thêm lịch rảnh</span>
                </button>
                <button className={styles.actionBtn}>
                    <BookIcon />
                    <span>Tạo lớp học</span>
                </button>
                <button className={styles.actionBtn}>
                    <MessageIcon />
                    <span>Tin nhắn</span>
                </button>
                <button className={styles.actionBtn}>
                    <NoteIcon />
                    <span>Ghi chú nhanh</span>
                </button>
                <button className={styles.actionBtn}>
                    <WithdrawIcon />
                    <span>Rút tiền</span>
                </button>
            </div>

            {/* Main Content Grid - 3 Column Layout */}
            <div className={styles.contentGrid}>
                {/* Left Column - Today's Lessons */}
                <div className={styles.leftColumn}>
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Các buổi học hôm nay</h2>
                            <div className={styles.tabGroup}>
                                <button
                                    className={`${styles.tabBtn} ${selectedTab === 'today' ? styles.active : ''}`}
                                    onClick={() => setSelectedTab('today')}
                                >
                                    Hôm nay
                                </button>
                                <button
                                    className={`${styles.tabBtn} ${selectedTab === 'tomorrow' ? styles.active : ''}`}
                                    onClick={() => setSelectedTab('tomorrow')}
                                >
                                    Ngày mai
                                </button>
                                <button
                                    className={`${styles.tabBtn} ${selectedTab === 'week' ? styles.active : ''}`}
                                    onClick={() => setSelectedTab('week')}
                                >
                                    Tuần
                                </button>
                            </div>
                        </div>

                        <div className={styles.lessonsList}>
                            {getFilteredLessons().length > 0 ? (
                                getFilteredLessons().map((lesson) => (
                                    <div key={lesson.lessonId} className={styles.lessonItem}>
                                        <div className={styles.lessonInfo}>
                                            <div className={styles.lessonTime}>{formatTime(lesson.scheduledStart)}</div>
                                            <div className={styles.lessonDetails}>
                                                <h4 className={styles.lessonSubject}>{lesson.subjectName || 'Chưa xác định'}</h4>
                                                <p className={styles.lessonStudent}>{lesson.studentName || 'Chưa có học sinh'}</p>
                                                <span className={`${styles.lessonStatus} ${getStatusClass(lesson.status || '')}`}>
                                                    {lesson.status || 'Đã lên lịch'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.lessonActions}>
                                            {lesson.meetingLink && (
                                                <button className={styles.primaryBtn} onClick={() => window.open(lesson.meetingLink!, '_blank')}>
                                                    Vào lớp
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    <p>Không có buổi học nào trong khoảng thời gian này</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Queue - COMMENTED OUT (waiting for API) */}
                    {/* <div className={styles.sectionCard}>
                        <div className={styles.actionQueueSection}>
                            <h2 className={styles.sectionTitle}>Hàng đợi hành động</h2>
                            <div className={styles.actionQueueList}>
                                {actionQueueItems.map((item) => (
                                    <div key={item.id} className={styles.actionQueueItem}>
                                        <div className={styles.actionQueueInfo}>
                                            <div className={`${styles.actionIndicator} ${item.type === 'warning' ? styles.warning : styles.info}`} />
                                            <div className={styles.actionQueueText}>
                                                <h4 className={styles.actionQueueTitle}>{item.title}</h4>
                                                <p className={styles.actionQueueDesc}>{item.description}</p>
                                            </div>
                                        </div>
                                        <button className={styles.actionQueueBtn}>
                                            {item.action}
                                            <ArrowRightIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div> */}

                    {/* Requests - COMMENTED OUT (waiting for API) */}
                    {/* <div className={styles.sectionCard}>
                        <div className={styles.requestsSection}>
                            <h2 className={styles.sectionTitle}>Yêu cầu</h2>
                            <div className={styles.requestsCard}>
                                <div className={styles.requestsList}>
                                    {requestsData.map((request) => (
                                        <div key={request.id} className={styles.requestItem}>
                                            <div className={styles.requestInfo}>
                                                <span className={styles.requestTitle}>{request.title}</span>
                                                <span className={styles.requestCount}>{request.count} đang chờ</span>
                                            </div>
                                            <button className={styles.reviewBtn}>Xem xét</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Right Column - Calendar & Notes */}
                <div className={styles.rightColumn}>
                    {/* Calendar */}
                    <div className={`${styles.sectionCard} ${styles.calendarSection}`}>
                        <div className={styles.calendarHeader}>
                            <h3 className={styles.calendarMonth}>Tháng 1, 2025</h3>
                            <div className={styles.calendarNav}>
                                <button className={styles.calendarNavBtn}>
                                    <ChevronLeftIcon />
                                </button>
                                <button className={styles.calendarNavBtn}>
                                    <ChevronRightIcon />
                                </button>
                            </div>
                        </div>
                        <div className={styles.calendarWeekDays}>
                            {weekDays.map((day, index) => (
                                <div key={index} className={styles.calendarWeekDay}>{day}</div>
                            ))}
                        </div>
                        <div className={styles.calendarGrid}>
                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`${styles.calendarDay}
                                        ${!day.isCurrentMonth ? styles.otherMonth : ''}
                                        ${day.isToday ? styles.today : ''}
                                        ${day.hasSession ? styles.hasSession : ''}`}
                                >
                                    {day.day}
                                    {day.hasSession && <div className={styles.sessionDot} />}
                                </div>
                            ))}
                        </div>
                        <div className={styles.calendarLegend}>
                            <div className={styles.legendItem}>
                                <div className={`${styles.legendDot} ${styles.classDay}`} />
                                <span className={styles.legendText}>Ngày có lớp</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={`${styles.legendDot} ${styles.todayDot}`} />
                                <span className={styles.legendText}>Hôm nay</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Feedbacks */}
                    {recentFeedbacks.length > 0 && (
                        <div className={styles.sectionCard}>
                            <div style={{ padding: '20px' }}>
                                <h2 className={styles.sectionTitle} style={{ marginBottom: '16px' }}>Đánh giá gần đây</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {recentFeedbacks.map((fb) => (
                                        <div key={fb.feedbackId} style={{
                                            padding: '12px 16px', borderRadius: '10px',
                                            background: '#f9fafb', border: '1px solid rgba(26,34,56,0.06)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{
                                                        width: '28px', height: '28px', borderRadius: '50%',
                                                        background: '#E8E5FF', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#4F46E5',
                                                    }}>
                                                        {fb.parentName?.charAt(0)?.toUpperCase() || 'P'}
                                                    </div>
                                                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#1a2238' }}>
                                                        {fb.parentName || 'Phụ huynh'}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <svg key={s} width="12" height="12" viewBox="0 0 18 18" fill={s <= fb.rating ? '#faad14' : '#e8e8e8'}>
                                                            <path d="M9 1L11.09 6.26L17 6.97L12.82 10.72L14.18 16.5L9 13.27L3.82 16.5L5.18 10.72L1 6.97L6.91 6.26L9 1Z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            {fb.comment && (
                                                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                                                    "{fb.comment}"
                                                </p>
                                            )}
                                            {fb.reply ? (
                                                <div style={{
                                                    padding: '8px 12px', background: '#f0f0ff', borderRadius: '8px',
                                                    fontSize: '12px', color: '#4F46E5', fontStyle: 'italic',
                                                }}>
                                                    Đã phản hồi: "{fb.reply}"
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setReplyModal({ open: true, feedback: fb })}
                                                    style={{
                                                        padding: '4px 12px', borderRadius: '6px',
                                                        border: '1px solid #4F46E5', background: 'transparent',
                                                        color: '#4F46E5', fontSize: '12px', cursor: 'pointer',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    Phản hồi
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reply Feedback Modal */}
                    <ReplyFeedbackModal
                        open={replyModal.open}
                        onClose={() => setReplyModal({ open: false, feedback: null })}
                        onSuccess={async () => {
                            setReplyModal({ open: false, feedback: null });
                            // Refresh feedbacks
                            const user = getCurrentUser();
                            if (user?.userId) {
                                try {
                                    const fbResponse = await getTutorFeedbacks(user.userId, 1, 3);
                                    if (fbResponse.content?.items) {
                                        setRecentFeedbacks(fbResponse.content.items);
                                    }
                                } catch { /* ignore */ }
                            }
                        }}
                        feedbackId={replyModal.feedback?.feedbackId || 0}
                        parentName={replyModal.feedback?.parentName}
                        rating={replyModal.feedback?.rating}
                        comment={replyModal.feedback?.comment}
                        createdAt={replyModal.feedback?.createdAt}
                    />

                    {/* Notes & Tasks */}
                    <div className={styles.sectionCard}>
                        <div className={styles.notesSection}>
                            <div className={styles.notesSectionHeader}>
                                <h2 className={styles.sectionTitle}>Ghi chú & Nhiệm vụ</h2>
                                <button className={styles.addTaskBtn}>
                                    <PlusIcon />
                                    Thêm nhiệm vụ
                                </button>
                            </div>

                            {/* Tasks List */}
                            <div className={styles.tasksList}>
                                {tasks.map((task) => (
                                    <div key={task.id} className={styles.taskItem}>
                                        <button
                                            className={styles.taskCheckbox}
                                            onClick={() => toggleTask(task.id)}
                                        >
                                            {task.completed ? <CheckedBoxIcon /> : <CheckboxIcon />}
                                        </button>
                                        <div className={styles.taskContent}>
                                            <span className={`${styles.taskTitle} ${task.completed ? styles.completed : ''}`}>
                                                {task.title}
                                            </span>
                                            <span className={styles.taskDate}>{task.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Personal Note */}
                            <div className={styles.personalNoteSection}>
                                <span className={styles.personalNoteLabel}>Ghi chú cá nhân</span>
                                <p className={styles.personalNoteText}>
                                    "{personalNote.text}"
                                </p>
                                <span className={styles.personalNoteDate}>{personalNote.date}</span>
                            </div>

                            {/* View All Records Button */}
                            <button className={styles.viewAllRecordsBtn}>
                                Xem tất cả hồ sơ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorPortalDashboard;
