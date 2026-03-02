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
import { getTutorCalendar } from '../../services/lesson.service';
import { CalendarView, type CalendarDayDto } from '../../components/CalendarView/CalendarView';

// Mở rộng dayjs với các plugin
dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.locale('vi');

// Biểu tượng
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

// Interface cục bộ để hiển thị (ánh xạ từ phản hồi API)
// MERGED: Dùng startMinutes + durationMinutes từ develop để hỗ trợ slot giữa giờ (7:30, 8:15...)
interface LocalAvailabilitySlot {
    id: number;
    dayOfWeek: number;  // 1-7 cho tuần ISO (Thứ Hai=1, Chủ Nhật=7)
    startHour: number;
    startMinutes: number; // Tổng số phút từ 00:00 (VD: 7:30 = 450)
    durationMinutes: number; // Thời lượng theo phút
    apiId: number;  // Original API availabilityid
    startTime: string;
    endTime: string;
    apiDayOfWeek: number;  // dayofweek gốc từ API (0-6, Chủ Nhật=0)
}

// Interface dữ liệu modal chỉnh sửa
interface EditAvailabilityData {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

// Hằng số
const DAYS_OF_WEEK = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i); // 0:00 đến 23:00
const ROW_HEIGHT = 70; // px cho mỗi hàng giờ
const PX_PER_MINUTE = ROW_HEIGHT / 60; // px cho mỗi phút

// Hàm trợ giúp: Chuyển đổi API dayofweek (0-6) sang ISO week day (1-7)
// API: 0=Chủ Nhật, 1=Thứ Hai, 2=Thứ Ba, 3=Thứ Tư, 4=Thứ Năm, 5=Thứ Sáu, 6=Thứ Bảy
// ISO: 1=Thứ Hai, 2=Thứ Ba, 3=Thứ Tư, 4=Thứ Năm, 5=Thứ Sáu, 6=Thứ Bảy, 7=Chủ Nhật
const apiDayToIsoDay = (apiDay: number): number => {
    if (apiDay === 0) return 7;  // Chủ Nhật -> ISO 7
    return apiDay;  // Thứ Hai=1, Thứ Ba=2, v.v. (giống như API)
};

// Hàm trợ giúp: Phân tích chuỗi thời gian thành giờ
const parseTimeToHour = (timeStr: string): number => {
    const [hours] = timeStr.split(':').map(Number);
    return hours;
};

// Hàm trợ giúp: Phân tích chuỗi thời gian thành tổng số phút từ 00:00
const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
};

// Hàm trợ giúp: Tính thời lượng theo phút
const calculateDurationMinutes = (startTime: string, endTime: string): number => {
    return parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
};

const TutorPortalSchedule: React.FC = () => {
    // FROM MILESTONE_3: 2 tabs - settings (lịch rảnh) + lessons (lịch dạy)
    const [activeTab, setActiveTab] = useState<'settings' | 'lessons'>('lessons');
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [availability, setAvailability] = useState<LocalAvailabilitySlot[]>([]);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
    const [isAddAvailabilityModalOpen, setIsAddAvailabilityModalOpen] = useState(false);
    const [isEditAvailabilityModalOpen, setIsEditAvailabilityModalOpen] = useState(false);
    const [editingAvailability, setEditingAvailability] = useState<EditAvailabilityData | null>(null);
    const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

    // FROM MILESTONE_3: State cho lessons tab
    const [calendarData, setCalendarData] = useState<CalendarDayDto[]>([]);
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);

    // Lấy các ngày trong tuần sử dụng dayjs
    const weekDates = useMemo(() => {
        const startOfWeek = currentDate.startOf('isoWeek'); // Thứ Hai
        return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
    }, [currentDate]);

    // Định dạng khoảng tuần để hiển thị
    const weekRange = useMemo(() => {
        const start = weekDates[0];
        const end = weekDates[6];

        if (start.month() === end.month()) {
            return `${start.format('DD')} - ${end.format('DD MMM, YYYY')}`;
        }
        return `${start.format('DD MMM')} - ${end.format('DD MMM, YYYY')}`;
    }, [weekDates]);

    // Lấy lịch rảnh từ API
    // MERGED: Dùng minutes precision từ develop
    const fetchAvailability = useCallback(async () => {
        const userId = getUserIdFromToken();

        if (!userId) {
            return;
        }

        setIsLoadingAvailability(true);
        try {
            const response = await getAvailability(userId);

            // Ánh xạ phản hồi API sang định dạng cục bộ (dùng phút cho chính xác)
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
            // Không hiển thị thông báo lỗi nếu 404 (chưa có lịch rảnh)
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status !== 404) {
                toast.error('Không thể tải lịch rảnh. Vui lòng thử lại.');
            }
        } finally {
            setIsLoadingAvailability(false);
        }
    }, []);

    // FETCH CALENDAR FOR LESSONS TAB
    const fetchCalendar = useCallback(async () => {
        setIsLoadingLessons(true);
        try {
            const startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
            const endDate = dayjs().add(30, 'day').format('YYYY-MM-DD');
            const response = await getTutorCalendar(startDate, endDate);

            // Map specific fields if necessary or cast directly (same interface fields mostly)
            setCalendarData((response.content || []) as unknown as CalendarDayDto[]);
        } catch (error) {
            toast.error('Không thể tải lịch dạy. Vui lòng thử lại.');
        } finally {
            setIsLoadingLessons(false);
        }
    }, []);

    // Tải lịch rảnh khi khởi tạo component
    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // Fetch calendar when switching to lessons tab
    useEffect(() => {
        if (activeTab === 'lessons') {
            fetchCalendar();
        }
    }, [activeTab, fetchCalendar]);

    // Xử lý xóa lịch rảnh với Popconfirm
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

    // Xử lý chỉnh sửa lịch rảnh
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

    // Xử lý điều hướng
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

    // FROM DEVELOP: Tìm slot rảnh bắt đầu trong giờ cụ thể
    // dayIndex: 0-6 (Thứ Hai-Chủ Nhật theo thứ tự hiển thị)
    const getAvailabilityStartingAtHour = (dayIndex: number, hour: number): LocalAvailabilitySlot | null => {
        const isoDay = dayIndex + 1;
        return availability.find(a =>
            a.dayOfWeek === isoDay &&
            a.startHour === hour
        ) || null;
    };

    // Kiểm tra một ngày có phải hôm nay không
    const isToday = (date: Dayjs) => {
        return date.isSame(dayjs(), 'day');
    };

    // Kiểm tra tuần hiện tại có phải tuần này không
    const isCurrentWeek = useMemo(() => {
        const today = dayjs();
        const startOfCurrentWeek = today.startOf('isoWeek');
        const startOfDisplayWeek = currentDate.startOf('isoWeek');
        return startOfCurrentWeek.isSame(startOfDisplayWeek, 'day');
    }, [currentDate]);

    return (
        <div className={styles.schedulePage}>
            {/* Nội dung chính */}
            <div className={styles.mainContainer}>
                {/* Phần đầu trang */}
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

                    {/* Các tab - FROM MILESTONE_3 */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Cài đặt lịch
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'lessons' ? styles.active : ''}`}
                            onClick={() => setActiveTab('lessons')}
                        >
                            Lịch dạy
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'settings' ? (
                    /* Tab Cài đặt lịch (Availability) - MERGED: dùng minutes precision từ develop */
                    <div className={styles.calendarContainer}>
                        {/* Điều khiển lịch */}
                        <div className={styles.calendarControls}>
                            {/* Chuyển đổi chế độ xem */}
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

                            {/* Điều hướng ngày */}
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

                        {/* Chú giải */}
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

                        {/* Trạng thái đang tải */}
                        {isLoadingAvailability && (
                            <div className={styles.loadingOverlay}>
                                <Spin size="large" />
                            </div>
                        )}

                        {/* Trạng thái trống - Hiển thị khi không có lịch rảnh và không đang tải */}
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
                            /* Lưới lịch - MERGED: dùng pixel-perfect positioning từ develop */
                            <div className={styles.calendarGrid}>
                                {/* Hàng tiêu đề */}
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

                                {/* Các hàng thời gian - FROM DEVELOP: tính toán theo phút */}
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
                                                // FROM DEVELOP: Tính offset phút trong giờ (VD: 30 phút cho 07:30)
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
                ) : (
                    /* FROM MILESTONE_3: Tab Lịch dạy (Lessons) */
                    <div className={styles.calendarContainer}>
                        {/* Calendar controls */}
                        <div className={styles.calendarControls}>
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
                                <div className={styles.legendDot} style={{ backgroundColor: '#3d4a3e' }} />
                                <span>Buổi học</span>
                            </div>
                            <div className={styles.timezone}>
                                UTC+7 • Giờ Việt Nam
                            </div>
                        </div>

                        {/* Tab Lịch dạy: Sử dụng CalendarView component */}
                        <div className={styles.lessonsTabContent}>
                            <CalendarView
                                data={calendarData}
                                isLoading={isLoadingLessons}
                                onLessonClick={(lessonId) => {
                                    // Mặc định tutor detail page là `/tutor/classes/lessons/:id`
                                    console.log('Navigate to lesson', lessonId);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal thêm lịch rảnh */}
            <AddAvailabilityModal
                isOpen={isAddAvailabilityModalOpen}
                onClose={handleCloseAddAvailabilityModal}
                onSuccess={fetchAvailability}
            />

            {/* Modal chỉnh sửa lịch rảnh */}
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
