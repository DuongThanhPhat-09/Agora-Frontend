import React, { useState, useMemo } from 'react';
import styles from '../../styles/pages/tutor-portal-schedule.module.css';
import { RescheduleModal, AddAvailabilityModal } from './components';

// Icons
const CalendarSyncIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1.5V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M1.5 7.5H3.75C4.5 7.5 4.5 7.5 4.5 6.75V6.75C4.5 6 4.5 6 5.25 6H6.75C7.5 6 7.5 6 7.5 6.75V6.75C7.5 7.5 7.5 7.5 8.25 7.5H10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <rect x="1.5" y="2" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11 5L7 9L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M7 5L11 9L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const UserIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor" opacity="0.4">
        <path d="M14 17.5C18.1421 17.5 21.5 20.8579 21.5 25H6.5C6.5 20.8579 9.85786 17.5 14 17.5Z" />
        <circle cx="14" cy="9.5" r="5" />
    </svg>
);

const VideoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="4" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12.5 7L16.5 5V13L12.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MessageIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1.5 4L9 9L16.5 4M1.5 14V4C1.5 2.89543 2.39543 2 3.5 2H14.5C15.6046 2 16.5 2.89543 16.5 4V14C16.5 15.1046 15.6046 16 14.5 16H3.5C2.39543 16 1.5 15.1046 1.5 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const RescheduleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1.5" y="1.5" width="11" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1.5" y="7.5" width="11" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="3" cy="4" r="1" fill="currentColor" />
        <circle cx="11" cy="10" r="1" fill="currentColor" />
    </svg>
);

const CancelIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4 7H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

// Types
interface Session {
    id: number;
    studentName: string;
    subject: string;
    grade?: string;
    dayOfWeek: number;
    startHour: number;
    duration: number; // in hours
    type: 'lesson' | 'group';
    status: 'confirmed' | 'pending' | 'cancelled';
}

interface AvailabilitySlot {
    id: number;
    dayOfWeek: number;
    startHour: number;
    duration: number;
}

// Constants
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = Array.from({ length: 10 }, (_, i) => 9 + i); // 9:00 to 18:00

// Mock data
const mockSessions: Session[] = [
    { id: 1, studentName: 'Alex Chen', subject: 'Mathematics', grade: 'Grade 11', dayOfWeek: 0, startHour: 10, duration: 1, type: 'lesson', status: 'confirmed' },
    { id: 2, studentName: 'Emma Davis', subject: 'Physics', grade: 'Grade 12', dayOfWeek: 0, startHour: 17, duration: 2, type: 'lesson', status: 'confirmed' },
    { id: 3, studentName: 'Group Session', subject: 'AP Mathematics', dayOfWeek: 3, startHour: 10, duration: 2, type: 'group', status: 'confirmed' },
    { id: 4, studentName: 'Mike Johnson', subject: 'Mathematics', grade: 'Grade 10', dayOfWeek: 4, startHour: 14, duration: 1, type: 'lesson', status: 'confirmed' },
];

const mockAvailability: AvailabilitySlot[] = [
    { id: 1, dayOfWeek: 0, startHour: 15, duration: 1 },
    { id: 2, dayOfWeek: 2, startHour: 15, duration: 1 },
    { id: 3, dayOfWeek: 2, startHour: 16, duration: 1 },
];

// Helper functions
const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
};

const getWeekDates = (baseDate: Date) => {
    const dates: Date[] = [];
    const startOfWeek = new Date(baseDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
    }
    return dates;
};

const TutorPortalSchedule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'settings'>('schedule');
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 20)); // Jan 20, 2025
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [sessions] = useState<Session[]>(mockSessions);
    const [availability] = useState<AvailabilitySlot[]>(mockAvailability);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isAddAvailabilityModalOpen, setIsAddAvailabilityModalOpen] = useState(false);

    const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

    const weekRange = useMemo(() => {
        const start = weekDates[0];
        const end = weekDates[6];
        return `${formatDate(start)} - ${end.getDate()}, ${end.getFullYear()}`;
    }, [weekDates]);

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const handleNow = () => {
        setCurrentDate(new Date());
    };

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
    };

    const handleCloseSidebar = () => {
        setSelectedSession(null);
    };

    const handleRescheduleClick = () => {
        setIsRescheduleModalOpen(true);
    };

    const handleCloseRescheduleModal = () => {
        setIsRescheduleModalOpen(false);
    };

    const handleAddAvailabilityClick = () => {
        setIsAddAvailabilityModalOpen(true);
    };

    const handleCloseAddAvailabilityModal = () => {
        setIsAddAvailabilityModalOpen(false);
    };

    const getSessionAtTime = (dayIndex: number, hour: number): Session | null => {
        return sessions.find(s =>
            s.dayOfWeek === dayIndex &&
            s.startHour === hour
        ) || null;
    };

    const getAvailabilityAtTime = (dayIndex: number, hour: number): AvailabilitySlot | null => {
        return availability.find(a =>
            a.dayOfWeek === dayIndex &&
            a.startHour === hour
        ) || null;
    };

    const isSlotOccupied = (dayIndex: number, hour: number): boolean => {
        return sessions.some(s =>
            s.dayOfWeek === dayIndex &&
            hour >= s.startHour &&
            hour < s.startHour + s.duration
        );
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    return (
        <div className={styles.schedulePage}>
            {/* Main Content */}
            <div className={`${styles.mainContainer} ${selectedSession ? styles.withSidebar : ''}`}>
                {/* Header Section */}
                <div className={styles.headerSection}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.pageTitle}>Teaching Schedule</h1>
                        <div className={styles.headerActions}>
                            <button className={styles.syncBtn}>
                                <CalendarSyncIcon />
                                <span>Sync Calendar</span>
                            </button>
                            <button className={styles.addBtn} onClick={handleAddAvailabilityClick}>
                                <PlusIcon />
                                <span>Add Availability</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'schedule' ? styles.active : ''}`}
                            onClick={() => setActiveTab('schedule')}
                        >
                            Schedule & Availability
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Schedule Settings
                        </button>
                    </div>
                </div>

                {/* Calendar Container */}
                <div className={styles.calendarContainer}>
                    {/* Calendar Controls */}
                    <div className={styles.calendarControls}>
                        {/* View Mode Toggle */}
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'day' ? styles.active : ''}`}
                                onClick={() => setViewMode('day')}
                            >
                                Day
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'week' ? styles.active : ''}`}
                                onClick={() => setViewMode('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'month' ? styles.active : ''}`}
                                onClick={() => setViewMode('month')}
                            >
                                Month
                            </button>
                        </div>

                        {/* Date Navigation */}
                        <div className={styles.dateNav}>
                            <button className={styles.navBtn} onClick={handlePrevWeek}>
                                <ChevronLeftIcon />
                            </button>
                            <span className={styles.dateRange}>{weekRange}</span>
                            <button className={styles.navBtn} onClick={handleNextWeek}>
                                <ChevronRightIcon />
                            </button>
                            <button className={styles.nowBtn} onClick={handleNow}>
                                Now
                            </button>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} />
                            <span>Lesson</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendBorder} />
                            <span>Available</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendBlocked} />
                            <span>Blocked</span>
                        </div>
                        <div className={styles.timezone}>
                            UTC+7 • Vietnam Time
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className={styles.calendarGrid}>
                        {/* Header Row */}
                        <div className={styles.calendarHeader}>
                            <div className={styles.timeColumn} />
                            {weekDates.map((date, index) => (
                                <div
                                    key={index}
                                    className={`${styles.dayColumn} ${isToday(date) ? styles.today : ''}`}
                                >
                                    <span className={styles.dayName}>{DAYS_OF_WEEK[index]}</span>
                                    <span className={styles.dayNumber}>{date.getDate()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Time Rows */}
                        <div className={styles.calendarBody}>
                            {TIME_SLOTS.map(hour => (
                                <div key={hour} className={styles.timeRow}>
                                    <div className={styles.timeLabel}>
                                        {hour}:00
                                    </div>
                                    {DAYS_OF_WEEK.map((_, dayIndex) => {
                                        const session = getSessionAtTime(dayIndex, hour);
                                        const availabilitySlot = getAvailabilityAtTime(dayIndex, hour);
                                        const isOccupied = isSlotOccupied(dayIndex, hour);

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`${styles.timeCell} ${isToday(weekDates[dayIndex]) ? styles.todayColumn : ''}`}
                                            >
                                                {session && (
                                                    <div
                                                        className={`${styles.sessionBlock} ${selectedSession?.id === session.id ? styles.selected : ''}`}
                                                        style={{ height: `${session.duration * 70 - 6}px` }}
                                                        onClick={() => handleSessionClick(session)}
                                                    >
                                                        <span className={styles.sessionName}>
                                                            {session.studentName}
                                                        </span>
                                                        <span className={styles.sessionSubject}>
                                                            {session.subject}
                                                        </span>
                                                    </div>
                                                )}
                                                {availabilitySlot && !isOccupied && (
                                                    <div className={styles.availableBlock}>
                                                        <span>Available</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Session Quick View Sidebar - Only visible when session is selected */}
            <div className={`${styles.sidebar} ${selectedSession ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Session Quick View</h2>
                    <button className={styles.closeBtn} onClick={handleCloseSidebar}>
                        <CloseIcon />
                    </button>
                </div>

                {selectedSession && (
                    <div className={styles.sessionDetails}>
                        {/* Student Info */}
                        <div className={styles.studentInfo}>
                            <div className={styles.studentAvatar}>
                                <UserIcon />
                            </div>
                            <div className={styles.studentMeta}>
                                <h3 className={styles.studentName}>{selectedSession.studentName}</h3>
                                <p className={styles.studentSubject}>
                                    {selectedSession.subject} {selectedSession.grade && `• ${selectedSession.grade}`}
                                </p>
                            </div>
                        </div>

                        {/* Lesson Details */}
                        <div className={styles.detailsSection}>
                            <span className={styles.detailsLabel}>Lesson Details</span>
                            <div className={styles.detailsCard}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailKey}>Student</span>
                                    <span className={styles.detailValue}>{selectedSession.studentName}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailKey}>Subject</span>
                                    <span className={styles.detailValue}>{selectedSession.subject}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailKey}>Grade</span>
                                    <span className={styles.detailValue}>{selectedSession.grade || 'N/A'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailKey}>Date</span>
                                    <span className={styles.detailValue}>
                                        {DAYS_OF_WEEK[selectedSession.dayOfWeek]}, {formatDate(weekDates[selectedSession.dayOfWeek])}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailKey}>Time</span>
                                    <span className={styles.detailValue}>{selectedSession.startHour}:00 AM</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailKey}>Duration</span>
                                    <span className={styles.detailValue}>{selectedSession.duration * 60} minutes</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailKey}>Type</span>
                                    <span className={styles.detailValue}>Online</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailKey}>Status</span>
                                    <div className={styles.statusBadge}>
                                        <span className={styles.statusDot} />
                                        <span>Confirmed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.actionButtons}>
                            <button className={styles.primaryBtn}>
                                <VideoIcon />
                                <span>Open Session</span>
                            </button>
                            <button className={styles.secondaryBtn}>
                                <MessageIcon />
                                <span>Message Student</span>
                            </button>
                            <div className={styles.smallBtnGroup}>
                                <button className={styles.smallBtn} onClick={handleRescheduleClick}>
                                    <RescheduleIcon />
                                    <span>Reschedule</span>
                                </button>
                                <button className={`${styles.smallBtn} ${styles.cancelBtn}`}>
                                    <CancelIcon />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {selectedSession && (
                <div className={styles.sidebarOverlay} onClick={handleCloseSidebar} />
            )}

            {/* Reschedule Modal */}
            {selectedSession && (
                <RescheduleModal
                    isOpen={isRescheduleModalOpen}
                    onClose={handleCloseRescheduleModal}
                    studentName={selectedSession.studentName}
                    currentDate={`${DAYS_OF_WEEK[selectedSession.dayOfWeek]}, ${formatDate(weekDates[selectedSession.dayOfWeek])}`}
                    currentTime={`${selectedSession.startHour}:00`}
                />
            )}

            {/* Add Availability Modal */}
            <AddAvailabilityModal
                isOpen={isAddAvailabilityModalOpen}
                onClose={handleCloseAddAvailabilityModal}
            />
        </div>
    );
};

export default TutorPortalSchedule;
