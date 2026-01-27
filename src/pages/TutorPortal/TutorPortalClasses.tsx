import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3L9 7L5 11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Sample data for classes
const classesData = [
    {
        id: 1,
        name: 'AP Mathematics A',
        subject: 'Mathematics',
        grade: 'Grade 11',
        schedule: 'Mon, Wed\n14:00',
        students: ['JD', 'JD', 'JD', '+9'],
        nextLesson: 'Mon, Jan\n20 14:00',
        homework: 5,
        scores: 2,
        status: 'Open'
    },
    {
        id: 2,
        name: 'Algebra Basics',
        subject: 'Mathematics',
        grade: 'Grade 9',
        schedule: 'Tue, Thu\n10:00',
        students: ['JD', 'JD', 'JD', '+5'],
        nextLesson: 'Tue, Jan\n21 10:00',
        homework: 8,
        scores: 4,
        status: 'Open'
    },
    {
        id: 3,
        name: 'Physics\nFundamentals',
        subject: 'Physics',
        grade: 'Grade 10',
        schedule: 'Fri 16:00',
        students: ['JD', 'JD', 'JD', '+3'],
        nextLesson: 'Fri, Jan\n24 16:00',
        homework: 3,
        scores: 0,
        status: 'Open'
    }
];

// Sample data for classes needing attention
const attentionClasses = [
    {
        id: 1,
        name: 'Algebra Basics',
        homework: '8 HW',
        scores: '4 Scores',
        nextLesson: 'Next: Wed 15:00'
    },
    {
        id: 2,
        name: 'AP Mathematics A',
        homework: '8 HW',
        scores: '4 Scores',
        nextLesson: 'Next: Wed 15:00'
    },
    {
        id: 3,
        name: 'Physics Fundamentals',
        homework: '8 HW',
        scores: '4 Scores',
        nextLesson: 'Next: Wed 15:00'
    }
];

// Sample data for recent activity
const recentActivities = [
    {
        id: 1,
        text: 'New student added to Physics',
        time: '2 hours ago',
        type: 'student'
    },
    {
        id: 2,
        text: 'Homework reviewed in Chemistry',
        time: '5 hours ago',
        type: 'homework'
    },
    {
        id: 3,
        text: 'Scores entered for SAT Prep',
        time: '1 day ago',
        type: 'scores'
    }
];

const TutorPortalClasses: React.FC = () => {
    const navigate = useNavigate();

    const handleOpenClass = (classId: number) => {
        navigate(`/tutor-portal/classes/${classId}`);
    };

    return (
        <div className={styles.classManagement}>
            <div className={styles.mainContent}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Class Management</h1>
                    <button className={styles.createBtn}>
                        <PlusIcon />
                        <span>Create Class</span>
                    </button>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.searchWrapper}>
                        <SearchIcon />
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search class or student..."
                        />
                    </div>
                    <button className={styles.filterBtn}>
                        <span>Status: All</span>
                    </button>
                    <button className={styles.filterBtn}>
                        <span>Subject: All</span>
                    </button>
                    <button className={styles.sortBtn}>
                        <SortIcon />
                        <span>Sort: Next lesson</span>
                    </button>
                </div>

                {/* Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>CLASS</th>
                                <th>SCHEDULE</th>
                                <th>STUDENTS</th>
                                <th>NEXT<br />LESSON</th>
                                <th>HEALTH</th>
                                <th className={styles.alignRight}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classesData.map((classItem) => (
                                <tr key={classItem.id}>
                                    <td>
                                        <div className={styles.classInfo}>
                                            <div className={styles.className}>{classItem.name}</div>
                                            <div className={styles.classTags}>
                                                <span className={styles.tag}>{classItem.subject}</span>
                                                <span className={styles.tag}>{classItem.grade}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.scheduleText}>
                                            {classItem.schedule.split('\n').map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.studentsList}>
                                            {classItem.students.map((student, index) => (
                                                <div
                                                    key={index}
                                                    className={student.startsWith('+') ? styles.studentMore : styles.studentAvatar}
                                                >
                                                    {student}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.nextLessonText}>
                                            {classItem.nextLesson.split('\n').map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.healthBadges}>
                                            <span className={styles.hwBadge}>{classItem.homework}<br />HW</span>
                                            <span className={styles.scoresBadge}>{classItem.scores}<br />Scores</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.openBtn}
                                                onClick={() => handleOpenClass(classItem.id)}
                                            >
                                                Open
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
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className={styles.sidebar}>
                {/* Classes Needing Attention */}
                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarHeader}>
                        <h3 className={styles.sidebarTitle}>Classes Needing<br />Attention</h3>
                        <span className={styles.classesCount}>3 classes</span>
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

                {/* Recent Activity */}
                <div className={styles.sidebarSection}>
                    <h3 className={styles.sidebarTitle}>Recent Activity</h3>
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
            </aside>
        </div>
    );
};

export default TutorPortalClasses;
