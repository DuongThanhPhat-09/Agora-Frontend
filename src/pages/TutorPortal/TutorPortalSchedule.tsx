import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Popconfirm, Spin, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/vi';
import styles from '../../styles/pages/tutor-portal-schedule.module.css';
import { AddAvailabilityModal, EditAvailabilityModal } from './components';
import { getAvailability, deleteAvailability, createAvailability, updateAvailability, DAY_OF_WEEK_MAP } from '../../services/availability.service';
import type { AvailabilitySlot } from '../../services/availability.service';
import { getUserIdFromToken } from '../../services/auth.service';
import { getTutorCalendar, getTutorLessonDetail } from '../../services/lesson.service';
import type { CalendarDay, CalendarLesson, LessonDetailDto } from '../../services/lesson.service';

// Translate common English API messages to Vietnamese
const translateScheduleMsg = (msg: string, fallback: string): string => {
    if (!msg) return fallback;
    if (/time slot overlaps/i.test(msg)) {
        const match = msg.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        return match
            ? `Khung giờ bị trùng với lịch hiện có: ${match[1]} - ${match[2]}`
            : 'Khung giờ bị trùng với lịch rảnh hiện có';
    }
    if (/start time must be before/i.test(msg)) return 'Giờ bắt đầu phải trước giờ kết thúc';
    if (/invalid time/i.test(msg)) return 'Thời gian không hợp lệ';
    if (/already exists/i.test(msg)) return 'Lịch rảnh này đã tồn tại';
    if (/not found/i.test(msg)) return 'Không tìm thấy lịch rảnh';
    return msg;
};

// Mở rộng dayjs với các plugin
dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.locale('vi');

// Biểu tượng
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
const DEFAULT_ROW_HEIGHT = 70; // px mặc định cho mỗi hàng giờ
const MIN_ROW_HEIGHT = 36;  // CSS minimum (timeLabel padding+font won't shrink below ~36px)
const MAX_ROW_HEIGHT = 150;
const ZOOM_STEP = 10;
const LONG_PRESS_DURATION = 500; // ms to hold before drag activates on mobile
const LONG_PRESS_MOVE_THRESHOLD = 10; // px - cancel long-press if finger moves more than this

// Zoom icons
const ZoomInIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);
const ZoomOutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

// Hàm trợ giúp: Chuyển đổi API dayofweek (0-6) sang ISO week day (1-7)
// API: 0=Chủ Nhật, 1=Thứ Hai, 2=Thứ Ba, 3=Thứ Tư, 4=Thứ Năm, 5=Thứ Sáu, 6=Thứ Bảy
// ISO: 1=Thứ Hai, 2=Thứ Ba, 3=Thứ Tư, 4=Thứ Năm, 5=Thứ Sáu, 6=Thứ Bảy, 7=Chủ Nhật
const apiDayToIsoDay = (apiDay: number): number => {
    if (apiDay === 0) return 7;  // Chủ Nhật -> ISO 7
    return apiDay;  // Thứ Hai=1, Thứ Ba=2, v.v. (giống như API)
};

// Reverse: ISO day (1-7) -> API day (0-6)
const isoDayToApiDay = (isoDay: number): number => {
    if (isoDay === 7) return 0; // CN -> 0
    return isoDay;
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
    const navigate = useNavigate();
    // FROM MILESTONE_3: 2 tabs - settings (lịch rảnh) + lessons (lịch dạy)
    const [activeTab, setActiveTab] = useState<'settings' | 'lessons'>('settings');
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    // Mobile: tapped slot shows action popup
    const [tappedSlotId, setTappedSlotId] = useState<number | null>(null);
    const [tapPosition, setTapPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [availability, setAvailability] = useState<LocalAvailabilitySlot[]>([]);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
    const [isAddAvailabilityModalOpen, setIsAddAvailabilityModalOpen] = useState(false);
    const [isEditAvailabilityModalOpen, setIsEditAvailabilityModalOpen] = useState(false);
    const [editingAvailability, setEditingAvailability] = useState<EditAvailabilityData | null>(null);
    const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

    // FROM MILESTONE_3: State cho lessons tab
    const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);

    // Lesson detail popup state
    const [selectedLessonDetail, setSelectedLessonDetail] = useState<LessonDetailDto | null>(null);
    const [isLoadingLessonDetail, setIsLoadingLessonDetail] = useState(false);
    const [lessonPopupPosition, setLessonPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [showLessonPopup, setShowLessonPopup] = useState(false);
    const lessonPopupRef = useRef<HTMLDivElement>(null);

    // Flatten calendar data into lessons array for the lessons tab grid
    const lessons: CalendarLesson[] = useMemo(() => {
        return calendarData.flatMap(day => day.lessons || []);
    }, [calendarData]);

    // Zoom state
    const [rowHeight, setRowHeight] = useState(DEFAULT_ROW_HEIGHT);
    const pxPerMinute = rowHeight / 60;

    const handleZoomIn = () => setRowHeight(prev => Math.min(prev + ZOOM_STEP, MAX_ROW_HEIGHT));
    const handleZoomOut = () => setRowHeight(prev => Math.max(prev - ZOOM_STEP, MIN_ROW_HEIGHT));
    const handleZoomReset = () => setRowHeight(DEFAULT_ROW_HEIGHT);

    // ===== DRAG-TO-CREATE (Google Calendar style) =====
    interface DragState {
        isDragging: boolean;
        dayIndex: number;       // which column (index in displayDates)
        isoDay: number;         // ISO day (1-7)
        startMinutes: number;   // drag anchor (minutes from 00:00)
        currentMinutes: number; // current mouse position (minutes)
    }
    const [dragState, setDragState] = useState<DragState | null>(null);
    const calendarBodyRef = React.useRef<HTMLDivElement>(null);

    // Snap to 30-minute increments
    const SNAP_MINUTES = 30;
    const snapToGrid = (minutes: number): number => {
        return Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES;
    };

    // Convert pixel Y position relative to calendar body into minutes
    const pixelToMinutes = useCallback((clientY: number): number => {
        if (!calendarBodyRef.current) return 0;
        const rect = calendarBodyRef.current.getBoundingClientRect();
        const scrollTop = calendarBodyRef.current.scrollTop;
        const relativeY = clientY - rect.top + scrollTop;
        const totalMinutes = (relativeY / rowHeight) * 60;
        return Math.max(0, Math.min(totalMinutes, 24 * 60));
    }, [rowHeight]);

    // Format minutes -> "HH:mm"
    const minutesToTimeStr = (minutes: number): string => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    // Handle mousedown on a time cell (start drag) — DESKTOP ONLY
    // On mobile, we use long-press (handleCellTouchStart) instead
    const handleCellMouseDown = useCallback((e: React.MouseEvent, dayIndex: number, isoDay: number) => {
        if (activeTab !== 'settings' || viewMode === 'month') return;
        if (e.button !== 0) return; // left click only
        // Skip on mobile — long-press handles drag-to-create there
        if (window.innerWidth <= 768) return;
        e.preventDefault();

        const minutes = snapToGrid(pixelToMinutes(e.clientY));

        setDragState({
            isDragging: true,
            dayIndex,
            isoDay,
            startMinutes: minutes,
            currentMinutes: minutes + SNAP_MINUTES, // minimum 30min
        });
    }, [activeTab, viewMode, pixelToMinutes]);

    // ===== LONG-PRESS TO DRAG on mobile =====
    const longPressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressTouchStartRef = React.useRef<{ x: number; y: number; dayIndex: number; isoDay: number } | null>(null);
    const [isLongPressActive, setIsLongPressActive] = useState(false);

    const cancelLongPress = useCallback(() => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
        longPressTouchStartRef.current = null;
    }, []);

    // Handle touchstart on a time cell — start long-press timer (don't drag yet)
    const handleCellTouchStart = useCallback((e: React.TouchEvent, dayIndex: number, isoDay: number) => {
        if (activeTab !== 'settings' || viewMode === 'month') return;
        const touch = e.touches[0];
        if (!touch) return;

        // Store initial touch position
        longPressTouchStartRef.current = { x: touch.clientX, y: touch.clientY, dayIndex, isoDay };

        // Start long-press timer
        longPressTimerRef.current = setTimeout(() => {
            // Long-press succeeded — activate drag
            const touchData = longPressTouchStartRef.current;
            if (!touchData) return;

            // Haptic feedback if supported
            if (navigator.vibrate) navigator.vibrate(50);

            setIsLongPressActive(true);
            const minutes = snapToGrid(pixelToMinutes(touch.clientY));
            setDragState({
                isDragging: true,
                dayIndex: touchData.dayIndex,
                isoDay: touchData.isoDay,
                startMinutes: minutes,
                currentMinutes: minutes + SNAP_MINUTES,
            });
            longPressTimerRef.current = null;
        }, LONG_PRESS_DURATION);
    }, [activeTab, viewMode, pixelToMinutes]);

    // Cancel long-press if finger moves too far (user is scrolling)
    useEffect(() => {
        const handleTouchMoveCancel = (e: TouchEvent) => {
            if (!longPressTouchStartRef.current || !longPressTimerRef.current) return;
            const touch = e.touches[0];
            if (!touch) return;
            const dx = Math.abs(touch.clientX - longPressTouchStartRef.current.x);
            const dy = Math.abs(touch.clientY - longPressTouchStartRef.current.y);
            if (dx > LONG_PRESS_MOVE_THRESHOLD || dy > LONG_PRESS_MOVE_THRESHOLD) {
                cancelLongPress();
            }
        };

        const handleTouchEndCancel = () => {
            cancelLongPress();
        };

        window.addEventListener('touchmove', handleTouchMoveCancel, { passive: true });
        window.addEventListener('touchend', handleTouchEndCancel);
        return () => {
            window.removeEventListener('touchmove', handleTouchMoveCancel);
            window.removeEventListener('touchend', handleTouchEndCancel);
        };
    }, [cancelLongPress]);

    // Reset long-press active flag when drag ends
    useEffect(() => {
        if (!dragState?.isDragging) {
            setIsLongPressActive(false);
        }
    }, [dragState?.isDragging]);

    // Refs to avoid stale closures in drag/resize useEffects
    const dragStateRef = React.useRef(dragState);
    dragStateRef.current = dragState;
    const pixelToMinutesRef = React.useRef(pixelToMinutes);
    pixelToMinutesRef.current = pixelToMinutes;
    // These refs are initialized later after their values are declared
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resizeStateRef = React.useRef<any>(null);
    const fetchAvailabilityRef = React.useRef<() => void>(() => {});

    // Handle mousemove (update drag preview)
    useEffect(() => {
        if (!dragState?.isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const minutes = snapToGrid(pixelToMinutesRef.current(e.clientY));
            setDragState(prev => prev ? { ...prev, currentMinutes: minutes } : null);
        };

        const handleMouseUp = async () => {
            const ds = dragStateRef.current;
            if (!ds) return;

            const startMin = Math.min(ds.startMinutes, ds.currentMinutes);
            const endMin = Math.max(ds.startMinutes, ds.currentMinutes);

            // Must be at least 30 minutes
            if (endMin - startMin < SNAP_MINUTES) {
                setDragState(null);
                return;
            }

            // Save to API
            try {
                const apiDay = isoDayToApiDay(ds.isoDay);
                await createAvailability({
                    dayofweek: apiDay,
                    starttime: minutesToTimeStr(startMin),
                    endtime: minutesToTimeStr(endMin),
                });
                toast.success(`Đã thêm lịch rảnh ${minutesToTimeStr(startMin)} - ${minutesToTimeStr(endMin)}`);
                fetchAvailabilityRef.current();
            } catch (error: any) {
                const msg = error?.response?.data?.message || '';
                toast.error(translateScheduleMsg(msg, 'Không thể thêm lịch rảnh'));
            } finally {
                setDragState(null);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (!touch) return;
            const minutes = snapToGrid(pixelToMinutesRef.current(touch.clientY));
            setDragState(prev => prev ? { ...prev, currentMinutes: minutes } : null);
        };

        const handleTouchEnd = () => handleMouseUp();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragState?.isDragging]);

    // Compute ghost preview block position
    const ghostPreview = useMemo(() => {
        if (!dragState?.isDragging) return null;
        const startMin = Math.min(dragState.startMinutes, dragState.currentMinutes);
        const endMin = Math.max(dragState.startMinutes, dragState.currentMinutes);
        const duration = endMin - startMin;
        if (duration < SNAP_MINUTES) return null;
        return {
            dayIndex: dragState.dayIndex,
            topPx: startMin * pxPerMinute,
            heightPx: duration * pxPerMinute,
            startTime: minutesToTimeStr(startMin),
            endTime: minutesToTimeStr(endMin),
        };
    }, [dragState, pxPerMinute]);

    // ===== DRAG-TO-RESIZE existing slots =====
    interface ResizeState {
        isResizing: boolean;
        slot: LocalAvailabilitySlot;
        edge: 'top' | 'bottom';
        originalStartMinutes: number;
        originalEndMinutes: number;
        currentMinutes: number;
    }
    const [resizeState, setResizeState] = useState<ResizeState | null>(null);
    // Keep ref in sync for stale closure fix
    resizeStateRef.current = resizeState;

    const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, slot: LocalAvailabilitySlot, edge: 'top' | 'bottom') => {
        e.preventDefault();
        e.stopPropagation();
        const startMin = parseTimeToMinutes(slot.startTime);
        const endMin = parseTimeToMinutes(slot.endTime);
        setResizeState({
            isResizing: true,
            slot,
            edge,
            originalStartMinutes: startMin,
            originalEndMinutes: endMin,
            currentMinutes: edge === 'top' ? startMin : endMin,
        });
    }, []);

    useEffect(() => {
        if (!resizeState?.isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            const minutes = snapToGrid(pixelToMinutesRef.current(e.clientY));
            setResizeState(prev => prev ? { ...prev, currentMinutes: minutes } : null);
        };

        const handleMouseUp = async () => {
            const rs = resizeStateRef.current;
            if (!rs) return;

            let newStart = rs.originalStartMinutes;
            let newEnd = rs.originalEndMinutes;

            if (rs.edge === 'top') {
                newStart = Math.min(rs.currentMinutes, newEnd - SNAP_MINUTES);
            } else {
                newEnd = Math.max(rs.currentMinutes, newStart + SNAP_MINUTES);
            }

            // Clamp
            newStart = Math.max(0, newStart);
            newEnd = Math.min(24 * 60, newEnd);

            if (newEnd - newStart < SNAP_MINUTES) {
                setResizeState(null);
                return;
            }

            try {
                await updateAvailability(rs.slot.apiId, {
                    dayofweek: rs.slot.apiDayOfWeek,
                    starttime: minutesToTimeStr(newStart),
                    endtime: minutesToTimeStr(newEnd),
                });
                toast.success('Đã cập nhật lịch rảnh');
                fetchAvailabilityRef.current();
            } catch (error: any) {
                const msg = error?.response?.data?.message || '';
                toast.error(translateScheduleMsg(msg, 'Không thể cập nhật lịch rảnh'));
            } finally {
                setResizeState(null);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (!touch) return;
            const minutes = snapToGrid(pixelToMinutesRef.current(touch.clientY));
            setResizeState(prev => prev ? { ...prev, currentMinutes: minutes } : null);
        };

        const handleTouchEnd = () => handleMouseUp();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resizeState?.isResizing]);

    // Compute resized slot dimensions
    const getResizedSlotStyle = useCallback((slot: LocalAvailabilitySlot) => {
        if (!resizeState?.isResizing || resizeState.slot.apiId !== slot.apiId) return null;

        let startMin = resizeState.originalStartMinutes;
        let endMin = resizeState.originalEndMinutes;

        if (resizeState.edge === 'top') {
            startMin = Math.min(resizeState.currentMinutes, endMin - SNAP_MINUTES);
        } else {
            endMin = Math.max(resizeState.currentMinutes, startMin + SNAP_MINUTES);
        }

        startMin = Math.max(0, startMin);
        endMin = Math.min(24 * 60, endMin);

        return {
            topPx: startMin * pxPerMinute,
            heightPx: (endMin - startMin) * pxPerMinute,
            startTime: minutesToTimeStr(startMin),
            endTime: minutesToTimeStr(endMin),
        };
    }, [resizeState, pxPerMinute]);

    // Lấy các ngày hiển thị dựa trên viewMode
    const displayDates = useMemo(() => {
        if (viewMode === 'day') {
            return [currentDate];
        }
        // week mode (default)
        const startOfWeek = currentDate.startOf('isoWeek');
        return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
    }, [currentDate, viewMode]);

    // Lấy dữ liệu cho month view
    const monthCalendarData = useMemo(() => {
        if (viewMode !== 'month') return [];
        const startOfMonth = currentDate.startOf('month');
        const endOfMonth = currentDate.endOf('month');
        const startDay = startOfMonth.startOf('isoWeek');
        const endDay = endOfMonth.endOf('isoWeek');
        const days: Dayjs[] = [];
        let day = startDay;
        while (day.isBefore(endDay) || day.isSame(endDay, 'day')) {
            days.push(day);
            day = day.add(1, 'day');
        }
        return days;
    }, [currentDate, viewMode]);

    // Định dạng tiêu đề ngày/tuần/tháng
    const dateRangeText = useMemo(() => {
        if (viewMode === 'day') {
            return currentDate.format('DD MMMM, YYYY');
        }
        if (viewMode === 'month') {
            return currentDate.format('MMMM YYYY');
        }
        // week
        const start = displayDates[0];
        const end = displayDates[6];
        if (start.month() === end.month()) {
            return `${start.format('DD')} - ${end.format('DD MMM, YYYY')}`;
        }
        return `${start.format('DD MMM')} - ${end.format('DD MMM, YYYY')}`;
    }, [currentDate, displayDates, viewMode]);

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
    // Keep ref in sync for drag/resize handlers
    fetchAvailabilityRef.current = fetchAvailability;

    // FETCH CALENDAR FOR LESSONS TAB
    const fetchCalendar = useCallback(async () => {
        setIsLoadingLessons(true);
        try {
            // Debug: log logged-in user info
            const userId = getUserIdFromToken();
            const startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
            const endDate = dayjs().add(30, 'day').format('YYYY-MM-DD');
            console.log('📅 [DEBUG] fetchCalendar called with:', { userId, startDate, endDate });

            const response = await getTutorCalendar(startDate, endDate);
            console.log('📅 [DEBUG] /tutorlesson/calendar response:', JSON.stringify(response, null, 2));
            console.log('📅 [DEBUG] content length:', (response.content || []).length);

            setCalendarData(response.content || []);
        } catch (error: any) {
            console.error('❌ fetchCalendar error:', error);
            console.error('❌ Error details:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
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

    // Xử lý điều hướng theo viewMode
    const navUnit = viewMode === 'day' ? 'day' : viewMode === 'month' ? 'month' : 'week';

    const handlePrev = () => {
        setCurrentDate(currentDate.subtract(1, navUnit));
    };

    const handleNext = () => {
        setCurrentDate(currentDate.add(1, navUnit));
    };

    const handleToday = () => {
        setCurrentDate(dayjs());
    };

    // Helper: check if a day has availability slots
    const getDayAvailability = (date: Dayjs): LocalAvailabilitySlot[] => {
        const isoDay = date.isoWeekday(); // 1=Mon, 7=Sun
        return availability.filter(a => a.dayOfWeek === isoDay);
    };

    // Helper: check if a day has lessons
    const getDayLessons = (date: Dayjs): CalendarLesson[] => {
        return lessons.filter((l: CalendarLesson) => dayjs(l.scheduledStart).isSame(date, 'day'));
    };

    const handleAddAvailabilityClick = () => {
        setIsAddAvailabilityModalOpen(true);
    };

    const handleCloseAddAvailabilityModal = () => {
        setIsAddAvailabilityModalOpen(false);
    };

    // Handle lesson block click — fetch detail and show popup
    const handleLessonClick = useCallback(async (e: React.MouseEvent, lesson: CalendarLesson) => {
        e.stopPropagation();
        // Position popup near click, but keep in viewport
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const popupWidth = 340;
        const popupHeight = 320;
        let x = rect.right + 8;
        let y = rect.top;
        // Keep within viewport
        if (x + popupWidth > window.innerWidth) x = rect.left - popupWidth - 8;
        if (x < 8) x = 8;
        if (y + popupHeight > window.innerHeight) y = window.innerHeight - popupHeight - 8;
        if (y < 8) y = 8;
        setLessonPopupPosition({ x, y });
        setShowLessonPopup(true);
        setIsLoadingLessonDetail(true);
        setSelectedLessonDetail(null);

        try {
            const response = await getTutorLessonDetail(lesson.lessonId);
            setSelectedLessonDetail(response.content);
        } catch (error: any) {
            console.error('Error fetching lesson detail:', error);
            toast.error('Không thể tải chi tiết buổi học');
            setShowLessonPopup(false);
        } finally {
            setIsLoadingLessonDetail(false);
        }
    }, []);

    const handleCloseLessonPopup = useCallback(() => {
        setShowLessonPopup(false);
        setSelectedLessonDetail(null);
    }, []);

    const handleNavigateToClassDetail = useCallback(() => {
        if (selectedLessonDetail?.bookingId) {
            navigate(`/tutor-portal/classes/${selectedLessonDetail.bookingId}`);
        }
    }, [selectedLessonDetail, navigate]);

    // Close popup when clicking outside
    useEffect(() => {
        if (!showLessonPopup) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (lessonPopupRef.current && !lessonPopupRef.current.contains(e.target as Node)) {
                handleCloseLessonPopup();
            }
        };
        // Delay to avoid closing immediately from the same click
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLessonPopup, handleCloseLessonPopup]);

    // Helper: get status label for lesson popup
    const getLessonStatusInfo = (status: string | null): { label: string; color: string } => {
        switch (status) {
            case 'scheduled': return { label: 'Đã lên lịch', color: '#1890ff' };
            case 'in_progress': return { label: 'Đang học', color: '#52c41a' };
            case 'pending_confirmation': return { label: 'Chờ xác nhận', color: '#722ed1' };
            case 'completed': return { label: 'Hoàn thành', color: '#52c41a' };
            case 'cancelled': return { label: 'Đã hủy', color: '#999' };
            case 'no_show': return { label: 'Vắng mặt', color: '#ff4d4f' };
            default: return { label: status || 'N/A', color: '#999' };
        }
    };

    // FROM DEVELOP: Tìm slot rảnh bắt đầu trong giờ cụ thể
    const getAvailabilityStartingAtHour = (date: Dayjs, hour: number): LocalAvailabilitySlot | null => {
        const isoDay = date.isoWeekday();
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
    const isCurrentPeriod = useMemo(() => {
        const today = dayjs();
        if (viewMode === 'day') return currentDate.isSame(today, 'day');
        if (viewMode === 'month') return currentDate.isSame(today, 'month');
        const startOfCurrentWeek = today.startOf('isoWeek');
        const startOfDisplayWeek = currentDate.startOf('isoWeek');
        return startOfCurrentWeek.isSame(startOfDisplayWeek, 'day');
    }, [currentDate, viewMode]);

    return (
        <div className={styles.schedulePage}>
            {/* === MOBILE GOOGLE-CALENDAR HEADER (hidden on desktop via CSS) === */}
            <div className={styles.mobileGcalHeader}>
                <button className={styles.mobileMonthBtn} onClick={handlePrev}>
                    <ChevronLeftIcon />
                </button>
                <span className={styles.mobileMonthLabel}>{`Tháng ${currentDate.format('M')}`}</span>
                <button className={styles.mobileMonthBtn} onClick={handleNext}>
                    <ChevronRightIcon />
                </button>
                <button
                    className={`${styles.mobileTodayBtn} ${isCurrentPeriod ? styles.disabled : ''}`}
                    onClick={handleToday}
                    disabled={isCurrentPeriod}
                >
                    Hôm nay
                </button>
                <div className={styles.mobileTabSwitch}>
                    <button
                        className={`${styles.mobileTabBtn} ${activeTab === 'settings' ? styles.active : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        ⚙
                    </button>
                    <button
                        className={`${styles.mobileTabBtn} ${activeTab === 'lessons' ? styles.active : ''}`}
                        onClick={() => setActiveTab('lessons')}
                    >
                        📅
                    </button>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className={styles.mainContainer}>
                {/* Phần đầu trang (hidden on mobile via CSS) */}
                <div className={styles.headerSection}>
                    <div className={styles.headerTop}>
                        <h1 className={styles.pageTitle}>Lịch dạy</h1>
                        <div className={styles.headerActions}>
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
                                <button className={styles.navBtn} onClick={handlePrev}>
                                    <ChevronLeftIcon />
                                </button>
                                <span className={styles.dateRange}>{dateRangeText}</span>
                                <button className={styles.navBtn} onClick={handleNext}>
                                    <ChevronRightIcon />
                                </button>
                                <button
                                    className={`${styles.nowBtn} ${isCurrentPeriod ? styles.active : ''}`}
                                    onClick={handleToday}
                                    disabled={isCurrentPeriod}
                                >
                                    Hôm nay
                                </button>
                            </div>
                        </div>

                        {/* Chú giải + Drag Hint */}
                        <div className={styles.legend}>
                            <div className={styles.legendItem}>
                                <div className={styles.legendDot} />
                                <span>Rảnh</span>
                            </div>
                            {activeTab === 'settings' && viewMode !== 'month' && (
                                <div className={styles.legendItem}>
                                    <span className={styles.dragHintDesktop} style={{ color: 'rgba(79, 140, 255, 0.6)', fontSize: '9px', fontStyle: 'italic', letterSpacing: '0' }}>✦ Kéo trên lưới để tạo lịch rảnh</span>
                                    <span className={styles.dragHintMobile} style={{ color: 'rgba(79, 140, 255, 0.6)', fontSize: '9px', fontStyle: 'italic', letterSpacing: '0' }}>✦ Nhấn giữ trên lưới hoặc nút (+) góc dưới để tạo lịch rảnh</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                                <div className={styles.timezone}>
                                    UTC+7 • Giờ Việt Nam
                                </div>
                                {viewMode !== 'month' && (
                                    <div className={styles.zoomControls}>
                                        <button onClick={handleZoomOut} disabled={rowHeight <= MIN_ROW_HEIGHT} className={styles.zoomBtn} title="Thu nhỏ"><ZoomOutIcon /></button>
                                        <button onClick={handleZoomReset} className={styles.zoomLabel} title="Mặc định">{Math.round((rowHeight / DEFAULT_ROW_HEIGHT) * 100)}%</button>
                                        <button onClick={handleZoomIn} disabled={rowHeight >= MAX_ROW_HEIGHT} className={styles.zoomBtn} title="Phóng to"><ZoomInIcon /></button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile drag hint (hidden on desktop via CSS) */}
                        {activeTab === 'settings' && viewMode !== 'month' && (
                            <div className={styles.mobileDragHint}>
                                ✦ Nhấn giữ trên lưới hoặc nút (+) góc dưới để tạo lịch rảnh
                            </div>
                        )}

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
                        ) : viewMode === 'month' ? (
                            /* Month view - Availability */
                            <div className={styles.monthGrid}>
                                <div className={styles.monthHeader}>
                                    {DAYS_OF_WEEK.map(d => <div key={d} className={styles.monthHeaderCell}>{d}</div>)}
                                </div>
                                <div className={styles.monthBody}>
                                    {monthCalendarData.map((date, i) => {
                                        const daySlots = getDayAvailability(date);
                                        const isCurrentMonth = date.month() === currentDate.month();
                                        // Calculate total available hours for this day
                                        const totalMinutes = daySlots.reduce((sum, s) => sum + s.durationMinutes, 0);
                                        const totalHours = Math.floor(totalMinutes / 60);
                                        const remainMins = totalMinutes % 60;
                                        const hoursLabel = totalHours > 0
                                            ? (remainMins > 0 ? `${totalHours}h${remainMins}` : `${totalHours}h`)
                                            : (remainMins > 0 ? `${remainMins}m` : '');
                                        return (
                                            <div
                                                key={i}
                                                className={`${styles.monthCell} ${!isCurrentMonth ? styles.otherMonth : ''} ${isToday(date) ? styles.todayCell : ''}`}
                                                onClick={() => { setCurrentDate(date); setViewMode('day'); }}
                                            >
                                                <span className={styles.monthCellDay}>{date.format('D')}</span>
                                                {daySlots.length > 0 && (
                                                    <div className={styles.monthCellDots}>
                                                        <div className={styles.monthDotAvail} title={daySlots.map(s => `${s.startTime}-${s.endTime}`).join(', ')} />
                                                        <span className={styles.monthHoursLabel}>{hoursLabel}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* Day / Week view - Availability grid */
                            <div className={styles.calendarGrid} style={viewMode === 'day' ? { '--col-count': '1' } as React.CSSProperties : undefined}>
                                {/* Hàng tiêu đề */}
                                <div className={styles.calendarHeader} style={viewMode === 'day' ? { gridTemplateColumns: '70px 1fr' } : undefined}>
                                    <div className={styles.timeColumn} />
                                    {displayDates.map((date, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.dayColumn} ${isToday(date) ? styles.today : ''}`}
                                        >
                                            <span className={styles.dayName}>{viewMode === 'day' ? date.format('dddd') : DAYS_OF_WEEK[index]}</span>
                                            <span className={styles.dayNumber}>{date.format('DD')}</span>
                                            <span className={styles.monthName}>{date.format('MMM')}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Các hàng thời gian */}
                                <div className={styles.calendarBody} ref={calendarBodyRef} style={{ position: 'relative' }}>
                                    {TIME_SLOTS.map((hour, index) => (
                                        <div
                                            key={hour}
                                            className={styles.timeRow}
                                            style={{
                                                minHeight: `${rowHeight}px`,
                                                zIndex: TIME_SLOTS.length - index,
                                                position: 'relative',
                                                ...(viewMode === 'day' ? { gridTemplateColumns: '70px 1fr' } : {})
                                            }}
                                        >
                                            <div className={styles.timeLabel}>
                                                {hour.toString().padStart(2, '0')}:00
                                            </div>
                                            {displayDates.map((date, dayIndex) => {
                                                const slot = getAvailabilityStartingAtHour(date, hour);
                                                const resizedStyle = slot ? getResizedSlotStyle(slot) : null;
                                                const minuteOffset = slot ? (slot.startMinutes - hour * 60) : 0;
                                                const topOffsetPx = resizedStyle ? resizedStyle.topPx - hour * rowHeight : minuteOffset * pxPerMinute;
                                                const heightPx = resizedStyle ? resizedStyle.heightPx : (slot ? slot.durationMinutes * pxPerMinute : 0);
                                                const displayStartTime = resizedStyle ? resizedStyle.startTime : slot?.startTime;
                                                const displayEndTime = resizedStyle ? resizedStyle.endTime : slot?.endTime;

                                                return (
                                                    <div
                                                        key={dayIndex}
                                                        className={`${styles.timeCell} ${isToday(date) ? styles.todayColumn : ''}`}
                                                        onMouseDown={(e) => {
                                                            // Only start drag if click is on empty area
                                                            const target = e.target as HTMLElement;
                                                            if (target.closest(`.${styles.availableBlock}`)) return;
                                                            if (target.closest(`.${styles.mobileSlotActions}`)) return;
                                                            if (target.closest('button')) return;
                                                            if (target.closest('.ant-popover')) return;
                                                            if (target.closest('.ant-popconfirm')) return;
                                                            handleCellMouseDown(e, dayIndex, date.isoWeekday());
                                                        }}
                                                        onTouchStart={(e) => {
                                                            const target = e.target as HTMLElement;
                                                            if (target.closest(`.${styles.availableBlock}`)) return;
                                                            if (target.closest(`.${styles.mobileSlotActions}`)) return;
                                                            if (target.closest('button')) return;
                                                            handleCellTouchStart(e, dayIndex, date.isoWeekday());
                                                        }}
                                                        style={{ cursor: dragState?.isDragging ? 'ns-resize' : 'crosshair', touchAction: isLongPressActive ? 'none' : 'auto' }}
                                                    >
                                                        {slot && (
                                                            <div
                                                                className={`${styles.availableBlock} ${resizedStyle ? styles.resizing : ''} ${tappedSlotId === slot.apiId ? styles.tapped : ''}`}
                                                                style={{
                                                                    top: `${topOffsetPx + 3}px`,
                                                                    height: `${heightPx - 6}px`,
                                                                }}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                onTouchStart={(e) => e.stopPropagation()}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // On mobile, toggle action popup at tap position
                                                                    if (window.innerWidth <= 768) {
                                                                        if (tappedSlotId === slot.apiId) {
                                                                            setTappedSlotId(null);
                                                                        } else {
                                                                            setTapPosition({ x: e.clientX, y: e.clientY });
                                                                            setTappedSlotId(slot.apiId);
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {/* Top resize handle */}
                                                                <div
                                                                    className={styles.resizeHandle}
                                                                    style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', cursor: 'n-resize', zIndex: 10, touchAction: 'none' }}
                                                                    onMouseDown={(e) => handleResizeStart(e, slot, 'top')}
                                                                    onTouchStart={(e) => handleResizeStart(e, slot, 'top')}
                                                                />
                                                                <div className={styles.availableContent}>
                                                                    <span className={styles.availableLabel}>Rảnh</span>
                                                                    <span className={`${styles.availableTime} ${styles.desktopOnly}`}>
                                                                        {displayStartTime} - {displayEndTime}
                                                                    </span>
                                                                    <span className={`${styles.availableTime} ${styles.mobileOnly}`}>
                                                                        {`Từ ${parseInt(displayStartTime?.split(':')[0] || '0')}h`}
                                                                    </span>
                                                                    <span className={`${styles.availableTime} ${styles.mobileOnly}`}>
                                                                        {`Đến ${parseInt(displayEndTime?.split(':')[0] || '0')}h`}
                                                                    </span>
                                                                </div>
                                                                {/* Desktop: inline actions (hidden on mobile via CSS) */}
                                                                <div className={styles.slotActions}>
                                                                    <Tooltip title="Chỉnh sửa">
                                                                        <button
                                                                            className={styles.editSlotBtn}
                                                                            onMouseDown={(e) => e.stopPropagation()}
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
                                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <DeleteOutlined />
                                                                            </button>
                                                                        </Tooltip>
                                                                    </Popconfirm>
                                                                </div>
                                                                {/* Mobile: action buttons at tap position */}
                                                                {tappedSlotId === slot.apiId && (
                                                                    <div
                                                                        className={styles.mobileSlotActions}
                                                                        style={{ top: tapPosition.y, left: tapPosition.x }}
                                                                    >
                                                                        <button
                                                                            className={styles.mobileEditBtn}
                                                                            onTouchStart={(e) => e.stopPropagation()}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setTappedSlotId(null);
                                                                                handleEditAvailability(slot);
                                                                            }}
                                                                        >
                                                                            <EditOutlined /> Sửa
                                                                        </button>
                                                                        <button
                                                                            className={styles.mobileDeleteBtn}
                                                                            onTouchStart={(e) => e.stopPropagation()}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setTappedSlotId(null);
                                                                                handleDeleteAvailability(slot);
                                                                            }}
                                                                        >
                                                                            <DeleteOutlined /> Xóa
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {/* Bottom resize handle */}
                                                                <div
                                                                    className={styles.resizeHandle}
                                                                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', cursor: 's-resize', zIndex: 10, touchAction: 'none' }}
                                                                    onMouseDown={(e) => handleResizeStart(e, slot, 'bottom')}
                                                                    onTouchStart={(e) => handleResizeStart(e, slot, 'bottom')}
                                                                />
                                                            </div>
                                                        )}
                                                        {/* Ghost preview for drag-to-create */}
                                                        {ghostPreview && ghostPreview.dayIndex === dayIndex && hour === 0 && (
                                                            <div
                                                                className={styles.ghostBlock}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: `${ghostPreview.topPx}px`,
                                                                    left: '3px',
                                                                    right: '3px',
                                                                    height: `${ghostPreview.heightPx}px`,
                                                                    pointerEvents: 'none',
                                                                }}
                                                            >
                                                                <span className={styles.ghostLabel}>
                                                                    {ghostPreview.startTime} - {ghostPreview.endTime}
                                                                </span>
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
                                <button className={styles.navBtn} onClick={handlePrev}>
                                    <ChevronLeftIcon />
                                </button>
                                <span className={styles.dateRange}>{dateRangeText}</span>
                                <button className={styles.navBtn} onClick={handleNext}>
                                    <ChevronRightIcon />
                                </button>
                                <button
                                    className={`${styles.nowBtn} ${isCurrentPeriod ? styles.active : ''}`}
                                    onClick={handleToday}
                                    disabled={isCurrentPeriod}
                                >
                                    Hôm nay
                                </button>
                            </div>
                        </div>

                        {/* Legend + Zoom */}
                        <div className={styles.legend}>
                            <div className={styles.legendItem}>
                                <div className={styles.legendDot} style={{ backgroundColor: '#3d4a3e' }} />
                                <span>Buổi học</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div className={styles.timezone} style={{ marginRight: '12px' }}>
                                    UTC+7 • Giờ Việt Nam
                                </div>
                                {viewMode !== 'month' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#f5f5f5', borderRadius: '6px', padding: '2px' }}>
                                        <button onClick={handleZoomOut} disabled={rowHeight <= MIN_ROW_HEIGHT} style={{ background: 'none', border: 'none', cursor: rowHeight <= MIN_ROW_HEIGHT ? 'not-allowed' : 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', opacity: rowHeight <= MIN_ROW_HEIGHT ? 0.3 : 1, color: '#555' }} title="Thu nhỏ"><ZoomOutIcon /></button>
                                        <button onClick={handleZoomReset} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: '11px', fontWeight: 600, color: '#555', borderRadius: '4px' }} title="Mặc định">{Math.round((rowHeight / DEFAULT_ROW_HEIGHT) * 100)}%</button>
                                        <button onClick={handleZoomIn} disabled={rowHeight >= MAX_ROW_HEIGHT} style={{ background: 'none', border: 'none', cursor: rowHeight >= MAX_ROW_HEIGHT ? 'not-allowed' : 'pointer', padding: '4px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', opacity: rowHeight >= MAX_ROW_HEIGHT ? 0.3 : 1, color: '#555' }} title="Phóng to"><ZoomInIcon /></button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isLoadingLessons ? (
                            <div className={styles.loadingOverlay}>
                                <Spin size="large" />
                            </div>
                        ) : lessons.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📚</div>
                                <h3 className={styles.emptyTitle}>Chưa có lịch dạy</h3>
                                <p className={styles.emptyDescription}>
                                    Các buổi học đã được đặt sẽ hiển thị tại đây
                                </p>
                            </div>
                        ) : viewMode === 'month' ? (
                            /* Month view - Lessons */
                            <div className={styles.monthGrid}>
                                <div className={styles.monthHeader}>
                                    {DAYS_OF_WEEK.map(d => <div key={d} className={styles.monthHeaderCell}>{d}</div>)}
                                </div>
                                <div className={styles.monthBody}>
                                    {monthCalendarData.map((date, i) => {
                                        const dayLessons = getDayLessons(date);
                                        const isCurrentMonth = date.month() === currentDate.month();
                                        return (
                                            <div
                                                key={i}
                                                className={`${styles.monthCell} ${!isCurrentMonth ? styles.otherMonth : ''} ${isToday(date) ? styles.todayCell : ''}`}
                                                onClick={() => { setCurrentDate(date); setViewMode('day'); }}
                                            >
                                                <span className={styles.monthCellDay}>{date.format('D')}</span>
                                                {dayLessons.length > 0 && (
                                                    <div className={styles.monthCellDots}>
                                                        {dayLessons.slice(0, 3).map((l, j) => (
                                                            <div key={j} className={styles.monthDotLesson} title={`${l.subjectName || ''} ${dayjs(l.scheduledStart).format('HH:mm')}`} />
                                                        ))}
                                                        {dayLessons.length > 3 && <span className={styles.monthMore}>+{dayLessons.length - 3}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* Day / Week view - Lessons grid */
                            <div className={styles.calendarGrid} style={viewMode === 'day' ? { '--col-count': '1' } as React.CSSProperties : undefined}>
                                {/* Header row */}
                                <div className={styles.calendarHeader} style={viewMode === 'day' ? { gridTemplateColumns: '70px 1fr' } : undefined}>
                                    <div className={styles.timeColumn} />
                                    {displayDates.map((date, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.dayColumn} ${isToday(date) ? styles.today : ''}`}
                                        >
                                            <span className={styles.dayName}>{viewMode === 'day' ? date.format('dddd') : DAYS_OF_WEEK[index]}</span>
                                            <span className={styles.dayNumber}>{date.format('DD')}</span>
                                            <span className={styles.monthName}>{date.format('MMM')}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Time rows */}
                                <div className={styles.calendarBody}>
                                    {TIME_SLOTS.map((hour, index) => (
                                        <div
                                            key={hour}
                                            className={styles.timeRow}
                                            style={{
                                                minHeight: `${rowHeight}px`,
                                                zIndex: TIME_SLOTS.length - index,
                                                position: 'relative',
                                                ...(viewMode === 'day' ? { gridTemplateColumns: '70px 1fr' } : {})
                                            }}
                                        >
                                            <div className={styles.timeLabel}>
                                                {hour.toString().padStart(2, '0')}:00
                                            </div>
                                            {displayDates.map((date, dayIndex) => {
                                                const lessonsInSlot = lessons.filter(lesson => {
                                                    const lessonDate = dayjs(lesson.scheduledStart);
                                                    return lessonDate.isSame(date, 'day') && lessonDate.hour() === hour;
                                                });

                                                return (
                                                    <div
                                                        key={dayIndex}
                                                        className={`${styles.timeCell} ${isToday(date) ? styles.todayColumn : ''}`}
                                                    >
                                                        {lessonsInSlot.map(lesson => {
                                                            const start = dayjs(lesson.scheduledStart);
                                                            const end = dayjs(lesson.scheduledEnd);
                                                            const duration = end.diff(start, 'hour', true);
                                                            const heightPx = duration * rowHeight - 6;

                                                            return (
                                                                <div
                                                                    key={lesson.lessonId}
                                                                    className={styles.lessonBlock}
                                                                    style={{ height: `${heightPx}px`, cursor: 'pointer' }}
                                                                    onClick={(e) => handleLessonClick(e, lesson)}
                                                                >
                                                                    <div className={styles.lessonContent}>
                                                                        <span className={styles.lessonLabel}>
                                                                            {lesson.subjectName || 'N/A'}
                                                                        </span>
                                                                        <span className={styles.lessonTime}>
                                                                            {start.format('HH:mm')} - {end.format('HH:mm')}
                                                                        </span>
                                                                        <span className={styles.lessonStudent}>
                                                                            {lesson.studentName || 'Unknown'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Lesson Detail Popup */}
            {showLessonPopup && (
                <div
                    ref={lessonPopupRef}
                    className={styles.lessonPopup}
                    style={{ left: lessonPopupPosition.x, top: lessonPopupPosition.y }}
                >
                    <div className={styles.lessonPopupHeader}>
                        <span className={styles.lessonPopupTitle}>Chi tiết buổi học</span>
                        <button className={styles.lessonPopupClose} onClick={handleCloseLessonPopup}>
                            <CloseOutlined />
                        </button>
                    </div>
                    {isLoadingLessonDetail ? (
                        <div className={styles.lessonPopupLoading}>
                            <Spin size="small" />
                            <span>Đang tải...</span>
                        </div>
                    ) : selectedLessonDetail ? (
                        <div className={styles.lessonPopupBody}>
                            <div className={styles.lessonPopupRow}>
                                <span className={styles.lessonPopupLabel}>Môn học</span>
                                <span className={styles.lessonPopupValue}>{selectedLessonDetail.subject?.subjectName || 'N/A'}</span>
                            </div>
                            <div className={styles.lessonPopupRow}>
                                <span className={styles.lessonPopupLabel}>Học sinh</span>
                                <span className={styles.lessonPopupValue}>{selectedLessonDetail.student?.fullName || 'N/A'}</span>
                            </div>
                            <div className={styles.lessonPopupRow}>
                                <span className={styles.lessonPopupLabel}>Thời gian</span>
                                <span className={styles.lessonPopupValue}>
                                    {dayjs(selectedLessonDetail.scheduledStart).format('HH:mm')} - {dayjs(selectedLessonDetail.scheduledEnd).format('HH:mm')}
                                    {' · '}
                                    {dayjs(selectedLessonDetail.scheduledStart).format('DD/MM/YYYY')}
                                </span>
                            </div>
                            <div className={styles.lessonPopupRow}>
                                <span className={styles.lessonPopupLabel}>Trạng thái</span>
                                <span className={styles.lessonPopupStatus} style={{ color: getLessonStatusInfo(selectedLessonDetail.status || null).color }}>
                                    {getLessonStatusInfo(selectedLessonDetail.status || null).label}
                                </span>
                            </div>
                            {selectedLessonDetail.lessonPrice != null && (
                                <div className={styles.lessonPopupRow}>
                                    <span className={styles.lessonPopupLabel}>Giá buổi học</span>
                                    <span className={styles.lessonPopupValue} style={{ fontWeight: 600 }}>
                                        {selectedLessonDetail.lessonPrice.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            )}
                            {selectedLessonDetail.meetingLink && (
                                <div className={styles.lessonPopupRow}>
                                    <span className={styles.lessonPopupLabel}>Link học</span>
                                    <a
                                        href={selectedLessonDetail.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.lessonPopupLink}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Tham gia Meet ↗
                                    </a>
                                </div>
                            )}
                            {selectedLessonDetail.bookingId && (
                                <button
                                    className={styles.lessonPopupDetailBtn}
                                    onClick={handleNavigateToClassDetail}
                                >
                                    Xem chi tiết lớp học →
                                </button>
                            )}
                        </div>
                    ) : null}
                </div>
            )}

            {/* FAB — Mobile only (hidden on desktop via CSS) */}
            <button className={styles.fab} onClick={handleAddAvailabilityClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            </button>

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
