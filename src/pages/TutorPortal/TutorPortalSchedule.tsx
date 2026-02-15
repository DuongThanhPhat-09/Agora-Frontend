import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Popconfirm, Spin, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/vi';
import styles from '../../styles/pages/tutor-portal-schedule.module.css';
import { AddAvailabilityModal, EditAvailabilityModal } from './components';
import { getAvailability, deleteAvailability, DAY_OF_WEEK_MAP } from '../../services/availability.service';
import type { AvailabilitySlot } from '../../services/availability.service';
import { getUserIdFromToken } from '../../services/auth.service';

// Extend dayjs with plugins
dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.locale('vi');

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

// Local interface for display (mapped from API response)
interface LocalAvailabilitySlot {
    id: number;
    dayOfWeek: number;  // 1-7 for ISO week (Mon=1, Sun=7)
    startHour: number;
    startMinutes: number; // Total minutes from midnight (e.g. 7:30 = 450)
    durationMinutes: number; // Duration in minutes
    apiId: number;  // Original API availabilityid
    startTime: string;
    endTime: string;
    apiDayOfWeek: number;  // Original API dayofweek (0-6, Sun=0)
}

// Edit modal data interface
interface EditAvailabilityData {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

// Constants
const DAYS_OF_WEEK = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => 7 + i); // 7:00 to 21:00
const ROW_HEIGHT = 70; // px per hour row
const PX_PER_MINUTE = ROW_HEIGHT / 60;

// Helper: Convert API dayofweek (0-6) to ISO week day (1-7)
// API: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
// ISO: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
const apiDayToIsoDay = (apiDay: number): number => {
    if (apiDay === 0) return 7;  // Sunday -> ISO 7
    return apiDay;  // Mon=1, Tue=2, etc. (same as API)
};

// Helper: Parse time string to hour
const parseTimeToHour = (timeStr: string): number => {
    const [hours] = timeStr.split(':').map(Number);
    return hours;
};

// Helper: Parse time string to total minutes from midnight
const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
};

// Helper: Calculate duration in minutes
const calculateDurationMinutes = (startTime: string, endTime: string): number => {
    return parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
};

const TutorPortalSchedule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'settings'>('schedule');
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [availability, setAvailability] = useState<LocalAvailabilitySlot[]>([]);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
    const [isAddAvailabilityModalOpen, setIsAddAvailabilityModalOpen] = useState(false);
    const [isEditAvailabilityModalOpen, setIsEditAvailabilityModalOpen] = useState(false);
    const [editingAvailability, setEditingAvailability] = useState<EditAvailabilityData | null>(null);
    const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

    // Get week dates using dayjs
    const weekDates = useMemo(() => {
        const startOfWeek = currentDate.startOf('isoWeek'); // Monday
        return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
    }, [currentDate]);

    // Format week range for display
    const weekRange = useMemo(() => {
        const start = weekDates[0];
        const end = weekDates[6];

        if (start.month() === end.month()) {
            return `${start.format('DD')} - ${end.format('DD MMM, YYYY')}`;
        }
        return `${start.format('DD MMM')} - ${end.format('DD MMM, YYYY')}`;
    }, [weekDates]);

    // Fetch availability from API
    const fetchAvailability = useCallback(async () => {
        const userId = getUserIdFromToken();

        if (!userId) {
            return;
        }

        setIsLoadingAvailability(true);
        try {
            const response = await getAvailability(userId);

            // Map API response to local format
            const mappedAvailability: LocalAvailabilitySlot[] = (response.content || []).map((slot: AvailabilitySlot, index: number) => ({
                id: index + 1,
                dayOfWeek: apiDayToIsoDay(slot.dayofweek),
                startHour: parseTimeToHour(slot.starttime),
                startMinutes: parseTimeToMinutes(slot.starttime),
                durationMinutes: calculateDurationMinutes(slot.starttime, slot.endtime),
                apiId: slot.availabilityid,
                startTime: slot.starttime,
                endTime: slot.endtime,
                apiDayOfWeek: slot.dayofweek,
            }));

            setAvailability(mappedAvailability);
        } catch (error: unknown) {
            // Don't show error toast if 404 (no availability yet)
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status !== 404) {
                toast.error('Không thể tải lịch rảnh. Vui lòng thử lại.');
            }
        } finally {
            setIsLoadingAvailability(false);
        }
    }, []);

    // Load availability on mount
    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // Handle delete availability with Popconfirm
    const handleDeleteAvailability = async (slot: LocalAvailabilitySlot) => {
        setDeletingSlotId(slot.apiId);
        try {
            await deleteAvailability(slot.apiId);
            toast.success('Đã xóa lịch rảnh thành công!');
            fetchAvailability();
        } catch {
            toast.error('Không thể xóa lịch rảnh. Vui lòng thử lại.');
        } finally {
            setDeletingSlotId(null);
        }
    };

    // Handle edit availability
    const handleEditAvailability = (slot: LocalAvailabilitySlot) => {
        setEditingAvailability({
            id: slot.apiId,
            dayOfWeek: slot.apiDayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
        });
        setIsEditAvailabilityModalOpen(true);
    };

    const handleCloseEditAvailabilityModal = () => {
        setIsEditAvailabilityModalOpen(false);
        setEditingAvailability(null);
    };

    // Navigation handlers
    const handlePrevWeek = () => {
        setCurrentDate(currentDate.subtract(1, 'week'));
    };

    const handleNextWeek = () => {
        setCurrentDate(currentDate.add(1, 'week'));
    };

    const handleToday = () => {
        setCurrentDate(dayjs());
    };

    const handleAddAvailabilityClick = () => {
        setIsAddAvailabilityModalOpen(true);
    };

    const handleCloseAddAvailabilityModal = () => {
        setIsAddAvailabilityModalOpen(false);
    };

    // Get availability slot that starts in the given hour for a specific day
    // dayIndex: 0-6 (Mon-Sun in display order)
    const getAvailabilityStartingAtHour = (dayIndex: number, hour: number): LocalAvailabilitySlot | null => {
        const isoDay = dayIndex + 1;
        return availability.find(a =>
            a.dayOfWeek === isoDay &&
            a.startHour === hour
        ) || null;
    };

    // Check if a date is today
    const isToday = (date: Dayjs) => {
        return date.isSame(dayjs(), 'day');
    };

    // Check if current week is this week
    const isCurrentWeek = useMemo(() => {
        const today = dayjs();
        const startOfCurrentWeek = today.startOf('isoWeek');
        const startOfDisplayWeek = currentDate.startOf('isoWeek');
        return startOfCurrentWeek.isSame(startOfDisplayWeek, 'day');
    }, [currentDate]);

    return (
        <div className={styles.schedulePage}>
            {/* Main Content */}
            <div className={styles.mainContainer}>
                {/* Header Section */}
                <div className={styles.headerSection}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.pageTitle}>Lịch dạy</h1>
                        <div className={styles.headerActions}>
                            <button className={styles.syncBtn}>
                                <CalendarSyncIcon />
                                <span>Đồng bộ lịch</span>
                            </button>
                            <button className={styles.addBtn} onClick={handleAddAvailabilityClick}>
                                <PlusIcon />
                                <span>Thêm lịch rảnh</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'schedule' ? styles.active : ''}`}
                            onClick={() => setActiveTab('schedule')}
                        >
                            Lịch & Thời gian rảnh
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Cài đặt lịch
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
                                Ngày
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'week' ? styles.active : ''}`}
                                onClick={() => setViewMode('week')}
                            >
                                Tuần
                            </button>
                            <button
                                className={`${styles.viewBtn} ${viewMode === 'month' ? styles.active : ''}`}
                                onClick={() => setViewMode('month')}
                            >
                                Tháng
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
                            <button
                                className={`${styles.nowBtn} ${isCurrentWeek ? styles.active : ''}`}
                                onClick={handleToday}
                                disabled={isCurrentWeek}
                            >
                                Hôm nay
                            </button>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} />
                            <span>Buổi học</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendBorder} />
                            <span>Rảnh</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendBlocked} />
                            <span>Bận</span>
                        </div>
                        <div className={styles.timezone}>
                            UTC+7 • Giờ Việt Nam
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoadingAvailability && (
                        <div className={styles.loadingOverlay}>
                            <Spin size="large" />
                        </div>
                    )}

                    {/* Empty State - Show when no availability and not loading */}
                    {!isLoadingAvailability && availability.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📅</div>
                            <h3 className={styles.emptyTitle}>Chưa có lịch rảnh</h3>
                            <p className={styles.emptyDescription}>
                                Thêm lịch rảnh để học viên có thể đặt lịch học với bạn
                            </p>
                            <button
                                className={styles.emptyBtn}
                                onClick={handleAddAvailabilityClick}
                            >
                                <PlusIcon />
                                <span>Thêm lịch rảnh đầu tiên</span>
                            </button>
                        </div>
                    ) : (
                        /* Calendar Grid - Show when has availability or loading */
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
                                        <span className={styles.dayNumber}>{date.format('DD')}</span>
                                        <span className={styles.monthName}>{date.format('MMM')}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Time Rows */}
                            <div className={styles.calendarBody}>
                                {TIME_SLOTS.map((hour, index) => (
                                    <div
                                        key={hour}
                                        className={styles.timeRow}
                                        style={{
                                            zIndex: TIME_SLOTS.length - index,
                                            position: 'relative'
                                        }}
                                    >
                                        <div className={styles.timeLabel}>
                                            {hour.toString().padStart(2, '0')}:00
                                        </div>
                                        {weekDates.map((date, dayIndex) => {
                                            const slot = getAvailabilityStartingAtHour(dayIndex, hour);
                                            // Calculate minute offset within the hour (e.g. 30 min for 07:30)
                                            const minuteOffset = slot ? (slot.startMinutes - hour * 60) : 0;
                                            const topOffsetPx = minuteOffset * PX_PER_MINUTE;
                                            const heightPx = slot ? slot.durationMinutes * PX_PER_MINUTE : 0;

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`${styles.timeCell} ${isToday(date) ? styles.todayColumn : ''}`}
                                                >
                                                    {slot && (
                                                        <div
                                                            className={styles.availableBlock}
                                                            style={{
                                                                top: `${topOffsetPx + 3}px`,
                                                                height: `${heightPx - 6}px`,
                                                            }}
                                                        >
                                                            <div className={styles.availableContent}>
                                                                <span className={styles.availableLabel}>Rảnh</span>
                                                                <span className={styles.availableTime}>
                                                                    {slot.startTime} - {slot.endTime}
                                                                </span>
                                                            </div>
                                                            <div className={styles.slotActions}>
                                                                <Tooltip title="Chỉnh sửa">
                                                                    <button
                                                                        className={styles.editSlotBtn}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleEditAvailability(slot);
                                                                        }}
                                                                    >
                                                                        <EditOutlined />
                                                                    </button>
                                                                </Tooltip>
                                                                <Popconfirm
                                                                    title="Xóa lịch rảnh"
                                                                    description={`Bạn có chắc muốn xóa lịch rảnh ${DAY_OF_WEEK_MAP[slot.apiDayOfWeek]} ${slot.startTime} - ${slot.endTime}?`}
                                                                    onConfirm={() => handleDeleteAvailability(slot)}
                                                                    okText="Xóa"
                                                                    cancelText="Hủy"
                                                                    okButtonProps={{
                                                                        danger: true,
                                                                        loading: deletingSlotId === slot.apiId
                                                                    }}
                                                                    placement="left"
                                                                >
                                                                    <Tooltip title="Xóa">
                                                                        <button
                                                                            className={styles.deleteSlotBtn}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <DeleteOutlined />
                                                                        </button>
                                                                    </Tooltip>
                                                                </Popconfirm>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Availability Modal */}
            <AddAvailabilityModal
                isOpen={isAddAvailabilityModalOpen}
                onClose={handleCloseAddAvailabilityModal}
                onSuccess={fetchAvailability}
            />

            {/* Edit Availability Modal */}
            <EditAvailabilityModal
                isOpen={isEditAvailabilityModalOpen}
                onClose={handleCloseEditAvailabilityModal}
                onSuccess={fetchAvailability}
                availabilityData={editingAvailability}
            />
        </div>
    );
};

export default TutorPortalSchedule;
