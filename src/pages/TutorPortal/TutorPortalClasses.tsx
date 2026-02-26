import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTutorLessons, type LessonResponse } from '../../services/lesson.service';
import { message as antMessage } from 'antd';
import styles from '../../styles/pages/tutor-portal-classes.module.css';

// Icons
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="6" r="4.5" />
        <path d="M9.5 9.5L13 13" strokeLinecap="round" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 2V12M2 7H12" strokeLinecap="round" />
    </svg>
);

const SortIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 4H12M4 7H10M6 10H8" strokeLinecap="round" />
    </svg>
);

const MoreIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <circle cx="7" cy="2.5" r="1.5" />
        <circle cx="7" cy="7" r="1.5" />
        <circle cx="7" cy="11.5" r="1.5" />
    </svg>
);

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 1L13 4L5 12H2V9L10 1Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ChevronRightIcon - commented out (only used in commented-out sidebar)
// const ChevronRightIcon = () => (
//     <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
//         <path d="M5 3L9 7L5 11" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
// );

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const day = weekdays[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const dateNum = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}, Thg ${month}\n${dateNum} ${hours}:${minutes}`;
};

// Sample data - commented out (only used in commented-out sidebar)
// const attentionClasses = [
//     { id: 1, name: 'Đại số cơ bản', homework: '8 BTVN', scores: '4 Điểm', nextLesson: 'Tiếp theo: T4 15:00' },
//     { id: 2, name: 'Toán học nâng cao A', homework: '8 BTVN', scores: '4 Điểm', nextLesson: 'Tiếp theo: T4 15:00' },
//     { id: 3, name: 'Vật lý cơ bản', homework: '8 BTVN', scores: '4 Điểm', nextLesson: 'Tiếp theo: T4 15:00' }
// ];

// Sample data - commented out (only used in commented-out sidebar)
// const recentActivities = [
//     { id: 1, text: 'Học sinh mới tham gia lớp Vật lý', time: '2 giờ trước', type: 'student' },
//     { id: 2, text: 'Đã chấm bài tập Hóa học', time: '5 giờ trước', type: 'homework' },
//     { id: 3, text: 'Đã nhập điểm cho lớp luyện thi', time: '1 ngày trước', type: 'scores' }
// ];

// Interface for grouped class data
interface ClassData {
    bookingId: number;
    subjectName: string;
    studentName: string;
    studentId: string;
    totalLessons: number;
    completedLessons: number;
    nextLesson?: LessonResponse;
    schedule: string; // e.g., "T2, T4 10:00"
    hasHomework: boolean;
    hasNotes: boolean;
}

const TutorPortalClasses: React.FC = () => {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLessons();
    }, [statusFilter]);

    const fetchLessons = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching tutor lessons...');
            const response = await getTutorLessons(1, 100, undefined, statusFilter || undefined);

            console.log('📦 API Response:', response);
            console.log('📦 Response content:', response.content);

            // Handle both array and PagedList response
            let lessonsData: LessonResponse[] = [];

            if (Array.isArray(response.content)) {
                lessonsData = response.content;
                console.log('✅ Lessons found (array):', lessonsData.length);
            } else if (response.content && response.content.items) {
                lessonsData = response.content.items;
                console.log('✅ Lessons found (PagedList):', lessonsData.length);
            } else {
                console.log('⚠️ No items in response');
            }

            console.log('📚 Lessons data:', lessonsData);
            setLessons(lessonsData);
        } catch (error: any) {
            console.error('❌ Error fetching lessons:', error);
            console.error('❌ Error response:', error.response?.data);
            antMessage.error('Không thể tải danh sách lớp học: ' + (error.message || 'Lỗi không xác định'));
        } finally {
            setLoading(false);
        }
    };

    // Group lessons by bookingId to create classes
    const classes: ClassData[] = React.useMemo(() => {
        const grouped = new Map<number, LessonResponse[]>();

        // Group lessons by bookingId
        lessons.forEach(lesson => {
            if (!lesson.bookingId) return;
            if (!grouped.has(lesson.bookingId)) {
                grouped.set(lesson.bookingId, []);
            }
            grouped.get(lesson.bookingId)!.push(lesson);
        });

        // Convert to ClassData array
        return Array.from(grouped.entries()).map(([bookingId, classLessons]) => {
            // Sort lessons by date
            const sortedLessons = [...classLessons].sort((a, b) =>
                new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime()
            );

            // Find next upcoming lesson
            const now = new Date();
            const nextLesson = sortedLessons.find(l => new Date(l.scheduledStart) > now);

            // Count completed lessons
            const completedLessons = sortedLessons.filter(l =>
                l.status === 'completed' || l.status === 'pending_parent_confirmation'
            ).length;

            // Get schedule pattern from lessons
            const scheduleSet = new Set<string>();
            sortedLessons.forEach(lesson => {
                const date = new Date(lesson.scheduledStart);
                const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                const day = weekdays[date.getDay()];
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                scheduleSet.add(`${day} ${hours}:${minutes}`);
            });
            const schedule = Array.from(scheduleSet).slice(0, 3).join(', ');

            // Check if class has homework/notes
            const hasHomework = sortedLessons.some(l => l.homework);
            const hasNotes = sortedLessons.some(l => l.tutorNotes);

            // Get first lesson for student/subject info
            const firstLesson = sortedLessons[0];

            return {
                bookingId,
                subjectName: firstLesson.subject?.subjectName || 'N/A',
                studentName: firstLesson.student?.fullName || 'Unknown',
                studentId: firstLesson.student?.studentId || '',
                totalLessons: sortedLessons.length,
                completedLessons,
                nextLesson,
                schedule,
                hasHomework,
                hasNotes
            };
        });
    }, [lessons]);

    const handleOpenClass = (bookingId: number) => {
        navigate(`/tutor-portal/classes/${bookingId}`);
    };

    // Filter classes by search term
    const filteredClasses = classes.filter(classData => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        const studentMatch = classData.studentName.toLowerCase().includes(searchLower);
        const subjectMatch = classData.subjectName.toLowerCase().includes(searchLower);

        return studentMatch || subjectMatch;
    });

    console.log('🔍 Render state:', {
        loading,
        lessonsCount: lessons.length,
        classesCount: classes.length,
        filteredClassesCount: filteredClasses.length,
        searchTerm
    });

    return (
        <div className={styles.classManagement}>
            <div className={styles.mainContent}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Quản lý lớp học</h1>
                    <button className={styles.createBtn}>
                        <PlusIcon />
                        <span>Tạo lớp học</span>
                    </button>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.searchWrapper}>
                        <SearchIcon />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Tìm kiếm lớp học hoặc học sinh..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className={styles.filterBtn}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Trạng thái: Tất cả</option>
                        <option value="scheduled">Đã lên lịch</option>
                        <option value="in_progress">Đang học</option>
                        <option value="pending_report">Chờ báo cáo</option>
                        <option value="pending_parent_confirmation">Chờ xác nhận</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <button className={styles.sortBtn}>
                        <SortIcon />
                        <span>Sắp xếp: Buổi học tiếp theo</span>
                    </button>
                </div>

                {/* Table */}
                <div className={styles.tableContainer}>
                    {loading ? (
                        <>
                            {console.log('🔄 Showing loading state')}
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div className={styles.spinner}></div>
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        </>
                    ) : filteredClasses.length === 0 ? (
                        <>
                            {console.log('⚠️ Showing empty state')}
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>Không tìm thấy lớp học nào</p>
                            </div>
                        </>
                    ) : (
                        <>
                            {console.log('✅ Rendering table with', filteredClasses.length, 'classes')}
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>LỚP HỌC</th>
                                        <th>LỊCH HỌC</th>
                                        <th>HỌC SINH</th>
                                        <th>BUỔI<br />TIẾP THEO</th>
                                        <th>TIẾN ĐỘ</th>
                                        <th className={styles.alignRight}>HÀNH ĐỘNG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClasses.map((classData) => (
                                        <tr key={classData.bookingId}>
                                            <td>
                                                <div className={styles.classInfo}>
                                                    <div className={styles.className}>{classData.subjectName}</div>
                                                    <div className={styles.classTags}>
                                                        <span className={styles.tag}>{classData.totalLessons} buổi</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.scheduleText}>
                                                    {classData.schedule}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.studentsList}>
                                                    <div className={styles.studentAvatar}>
                                                        {classData.studentName.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span style={{ marginLeft: '8px', fontSize: '13px' }}>
                                                        {classData.studentName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {classData.nextLesson ? (
                                                    <div className={styles.nextLessonText}>
                                                        {formatDate(classData.nextLesson.scheduledStart).split('\n').map((line, i) => (
                                                            <div key={i}>{line}</div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className={styles.nextLessonText}>
                                                        Không có
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <div className={styles.healthBadges}>
                                                    <span className={styles.hwBadge}>
                                                        {classData.completedLessons}/{classData.totalLessons}<br />Hoàn thành
                                                    </span>
                                                    <span className={styles.scoresBadge}>
                                                        {classData.hasHomework ? '✓' : '-'}<br />BTVN
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button
                                                        className={styles.openBtn}
                                                        onClick={() => handleOpenClass(classData.bookingId)}
                                                    >
                                                        Mở
                                                    </button>
                                                    <button className={styles.iconBtn}>
                                                        <EditIcon />
                                                    </button>
                                                    <button className={styles.iconBtn}>
                                                        <MoreIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Temporarily hidden (using mock data) */}
            {/* <aside className={styles.sidebar}>
                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarHeader}>
                        <h3 className={styles.sidebarTitle}>Lớp học cần<br />chú ý</h3>
                        <span className={styles.classesCount}>3 lớp học</span>
                    </div>
                    <div className={styles.attentionList}>
                        {attentionClasses.map((classItem) => (
                            <div key={classItem.id} className={styles.attentionCard}>
                                <div className={styles.attentionHeader}>
                                    <span className={styles.attentionName}>{classItem.name}</span>
                                    <ChevronRightIcon />
                                </div>
                                <div className={styles.attentionBadges}>
                                    <span className={styles.attentionHw}>{classItem.homework}</span>
                                    <span className={styles.attentionScores}>{classItem.scores}</span>
                                </div>
                                <div className={styles.attentionNext}>{classItem.nextLesson}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.sidebarSection}>
                    <h3 className={styles.sidebarTitle}>Hoạt động gần đây</h3>
                    <div className={styles.activityList}>
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className={styles.activityItem}>
                                <div className={`${styles.activityDot} ${styles[activity.type]}`} />
                                <div className={styles.activityContent}>
                                    <div className={styles.activityText}>{activity.text}</div>
                                    <div className={styles.activityTime}>{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside> */}
        </div>
    );
};

export default TutorPortalClasses;
