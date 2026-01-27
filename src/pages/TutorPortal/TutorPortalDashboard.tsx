import React, { useState } from 'react';
import styles from '../../styles/pages/tutor-portal-dashboard.module.css';

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

// Sample data
const todaysLessons = [
    {
        id: 1,
        time: '2:30 PM',
        subject: 'Mathematics - Grade 10',
        student: 'Alex Chen',
        status: 'starting_soon',
        statusLabel: 'Starting soon'
    },
    {
        id: 2,
        time: '4:00 PM',
        subject: 'Physics - Grade 11',
        student: 'Emma Wilson',
        status: 'ongoing',
        statusLabel: 'Ongoing'
    },
    {
        id: 3,
        time: '6:30 PM',
        subject: 'Chemistry - Grade 12',
        student: 'David Park',
        status: 'completed',
        statusLabel: 'Completed'
    }
];

const actionQueueItems = [
    {
        id: 1,
        title: 'Check-in pending',
        description: 'Physics class with Emma Wilson - 4:00 PM',
        type: 'warning',
        action: 'Check-in'
    },
    {
        id: 2,
        title: '5 homework assignments to review',
        description: 'Math (3) and Chemistry (2) classes',
        type: 'info',
        action: 'Review'
    },
    {
        id: 3,
        title: '2 scores to enter',
        description: "Yesterday's completed sessions",
        type: 'info',
        action: 'Enter Scores'
    }
];

const requestsData = [
    { id: 1, title: 'New booking requests', count: 2 },
    { id: 2, title: 'Reschedule requests', count: 1 },
    { id: 3, title: 'Cancellations', count: 0 }
];

const tasksData = [
    {
        id: 1,
        title: "Review Alex's progress report",
        date: 'JAN 22, 2025',
        completed: false
    },
    {
        id: 2,
        title: 'Prepare Chemistry quiz materials',
        date: 'JAN 23, 2025',
        completed: false
    }
];

const personalNote = {
    text: "Remember to update teaching materials for next week's Physics lessons.",
    date: 'Jan 20, 2025'
};

const TutorPortalDashboard: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'today' | 'tomorrow' | 'week'>('today');
    const [currentMonth] = useState(new Date(2025, 0, 1)); // January 2025
    const [tasks, setTasks] = useState(tasksData);

    // Generate calendar days
    const generateCalendarDays = () => {
        const days = [];
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

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
            days.push({
                day: i,
                isCurrentMonth: true,
                hasSession: [6, 7, 8, 14, 15, 20, 21].includes(i),
                isToday: i === 21
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

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <span className={styles.date}>Tuesday, January 21, 2025</span>
            </div>

            {/* Profile Under Review Banner */}
            <div className={styles.reviewBanner}>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerIcon}>
                        <ClockIcon />
                    </div>
                    <div className={styles.bannerText}>
                        <div className={styles.bannerTitleRow}>
                            <span className={styles.bannerTitle}>Your profile is under review</span>
                            <span className={styles.pendingBadge}>Pending</span>
                        </div>
                        <p className={styles.bannerDescription}>
                            Admin is verifying your credentials. You'll appear on the marketplace once approved.
                        </p>
                    </div>
                </div>
                <button className={styles.viewDetailsBtn}>
                    View Details
                    <ArrowRightIcon />
                </button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon}>
                            <CalendarIcon />
                        </div>
                        <span className={styles.statChange}>+12%</span>
                    </div>
                    <div className={styles.statValue}>3</div>
                    <div className={styles.statLabel}>Today Sessions</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon}>
                            <SessionsIcon />
                        </div>
                        <span className={styles.statChange}>+12%</span>
                    </div>
                    <div className={styles.statValue}>8</div>
                    <div className={styles.statLabel}>Classes Activity</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon}>
                            <StarIcon />
                        </div>
                        <span className={styles.statChange}>+12%</span>
                    </div>
                    <div className={styles.statValue}>12h</div>
                    <div className={styles.statLabel}>Total Rating</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon}>
                            <DollarIcon />
                        </div>
                        <span className={styles.statChange}>+12%</span>
                    </div>
                    <div className={styles.statValue}>$240</div>
                    <div className={styles.statLabel}>Monthly Revenue</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <button className={styles.actionBtn}>
                    <CheckInIcon />
                    <span>Start Check-in</span>
                </button>
                <button className={styles.actionBtn}>
                    <PlusIcon />
                    <span>Add Availability</span>
                </button>
                <button className={styles.actionBtn}>
                    <BookIcon />
                    <span>Create Class</span>
                </button>
                <button className={styles.actionBtn}>
                    <MessageIcon />
                    <span>Message</span>
                </button>
                <button className={styles.actionBtn}>
                    <NoteIcon />
                    <span>Quick Note</span>
                </button>
                <button className={styles.actionBtn}>
                    <WithdrawIcon />
                    <span>Withdraw</span>
                </button>
            </div>

            {/* Main Content Grid - 3 Column Layout */}
            <div className={styles.contentGrid}>
                {/* Left Column - Today's Lessons */}
                <div className={styles.leftColumn}>
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Today's Lessons</h2>
                            <div className={styles.tabGroup}>
                                <button
                                    className={`${styles.tabBtn} ${selectedTab === 'today' ? styles.active : ''}`}
                                    onClick={() => setSelectedTab('today')}
                                >
                                    Today
                                </button>
                                <button
                                    className={`${styles.tabBtn} ${selectedTab === 'tomorrow' ? styles.active : ''}`}
                                    onClick={() => setSelectedTab('tomorrow')}
                                >
                                    Tomorrow
                                </button>
                                <button
                                    className={`${styles.tabBtn} ${selectedTab === 'week' ? styles.active : ''}`}
                                    onClick={() => setSelectedTab('week')}
                                >
                                    Week
                                </button>
                            </div>
                        </div>

                        <div className={styles.lessonsList}>
                            {todaysLessons.map((lesson) => (
                                <div key={lesson.id} className={styles.lessonItem}>
                                    <div className={styles.lessonInfo}>
                                        <div className={styles.lessonTime}>{lesson.time}</div>
                                        <div className={styles.lessonDetails}>
                                            <h4 className={styles.lessonSubject}>{lesson.subject}</h4>
                                            <p className={styles.lessonStudent}>{lesson.student}</p>
                                            <span className={`${styles.lessonStatus} ${getStatusClass(lesson.status)}`}>
                                                {lesson.statusLabel}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.lessonActions}>
                                        {lesson.status === 'starting_soon' && (
                                            <button className={styles.primaryBtn}>Start Check-in</button>
                                        )}
                                        {lesson.status === 'ongoing' && (
                                            <button className={styles.secondaryBtn}>Open Session</button>
                                        )}
                                        {lesson.status === 'completed' && (
                                            <>
                                                <button className={styles.outlineBtn}>Assign HW</button>
                                                <button className={styles.outlineBtn}>Enter Score</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Queue */}
                    <div className={styles.sectionCard}>
                        <div className={styles.actionQueueSection}>
                            <h2 className={styles.sectionTitle}>Action Queue</h2>
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
                    </div>

                    {/* Requests */}
                    <div className={styles.sectionCard}>
                        <div className={styles.requestsSection}>
                            <h2 className={styles.sectionTitle}>Requests</h2>
                            <div className={styles.requestsCard}>
                                <div className={styles.requestsList}>
                                    {requestsData.map((request) => (
                                        <div key={request.id} className={styles.requestItem}>
                                            <div className={styles.requestInfo}>
                                                <span className={styles.requestTitle}>{request.title}</span>
                                                <span className={styles.requestCount}>{request.count} pending</span>
                                            </div>
                                            <button className={styles.reviewBtn}>Review</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Calendar & Notes */}
                <div className={styles.rightColumn}>
                    {/* Calendar */}
                    <div className={`${styles.sectionCard} ${styles.calendarSection}`}>
                        <div className={styles.calendarHeader}>
                            <h3 className={styles.calendarMonth}>January 2025</h3>
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
                                <span className={styles.legendText}>Class Day</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={`${styles.legendDot} ${styles.todayDot}`} />
                                <span className={styles.legendText}>Today</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes & Tasks */}
                    <div className={styles.sectionCard}>
                        <div className={styles.notesSection}>
                            <div className={styles.notesSectionHeader}>
                                <h2 className={styles.sectionTitle}>Notes & Tasks</h2>
                                <button className={styles.addTaskBtn}>
                                    <PlusIcon />
                                    Add Task
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
                                <span className={styles.personalNoteLabel}>Personal Note</span>
                                <p className={styles.personalNoteText}>
                                    "{personalNote.text}"
                                </p>
                                <span className={styles.personalNoteDate}>{personalNote.date}</span>
                            </div>

                            {/* View All Records Button */}
                            <button className={styles.viewAllRecordsBtn}>
                                View All Records
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorPortalDashboard;
