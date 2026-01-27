import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/pages/tutor-portal-class-detail.module.css';

// Icons
const BackIcon = () => (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 5L3 10.5L8 16M3 10.5H18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="6" r="4.5" />
        <path d="M9.5 9.5L13 13" strokeLinecap="round" />
    </svg>
);

const MessageIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 3.5L7 7.5L13 3.5M1 10.5V3.5C1 2.94772 1.44772 2.5 2 2.5H12C12.5523 2.5 13 2.94772 13 3.5V10.5C13 11.0523 12.5523 11.5 12 11.5H2C1.44772 11.5 1 11.0523 1 10.5Z" strokeLinecap="round" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 2V12M2 7H12" strokeLinecap="round" />
    </svg>
);

const ExportIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 10V2M7 2L4 5M7 2L10 5M2 12H12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const NoteIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 1.5H3.5C2.94772 1.5 2.5 1.94772 2.5 2.5V11.5C2.5 12.0523 2.94772 12.5 3.5 12.5H10.5C11.0523 12.5 11.5 12.0523 11.5 11.5V5M8 1.5L11.5 5M8 1.5V5H11.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BookIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 2V12M7 2C7 2 6 3 4 3C2 3 1 2 1 2V10C1 10 2 11 4 11C6 11 7 10 7 10M7 2C7 2 8 3 10 3C12 3 13 2 13 2V10C13 10 12 11 10 11C8 11 7 10 7 10M7 12C7 12 8 11 10 11C12 11 13 12 13 12M7 12C7 12 6 11 4 11C2 11 1 12 1 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MoreIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="6" cy="1.5" r="1.5" />
        <circle cx="6" cy="6" r="1.5" />
    </svg>
);

// Sample data
const classData = {
    id: '1',
    name: 'Mathematics',
    subject: 'Mathematics',
    grade: 'Grade 11',
    nextLesson: 'Monday, Jan 20 at 14:00'
};

const studentsData = [
    {
        id: 1,
        name: 'Emma Johnson',
        email: 'emma.johnson@email.com',
        avatar: 'https://ui-avatars.com/api/?name=Emma+Johnson&background=3d4a3e&color=f2f0e4&size=128',
        status: 'Active',
        lastLesson: 'Wed, Jan\n15',
        homeworkStatus: { count: 2, label: 'Overdue', type: 'overdue' },
        avgScore: '87%',
        grade: 'Grade 11'
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=3d4a3e&color=f2f0e4&size=128',
        status: 'Active',
        lastLesson: 'Wed, Jan\n15',
        homeworkStatus: { label: 'On Track', type: 'ontrack' },
        avgScore: '92%',
        grade: 'Grade 11'
    },
    {
        id: 3,
        name: 'Sarah Williams',
        email: 'sarah.williams@email.com',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=3d4a3e&color=f2f0e4&size=128',
        status: 'Paused',
        lastLesson: 'Mon, Jan\n13',
        homeworkStatus: { label: 'On Track', type: 'ontrack' },
        avgScore: '85%',
        grade: 'Grade 11'
    }
];

const TutorPortalClassDetail: React.FC = () => {
    const navigate = useNavigate();
    const { classId } = useParams();
    const [activeTab, setActiveTab] = useState<'students' | 'homework' | 'materials'>('students');
    const [selectedStudent, setSelectedStudent] = useState<typeof studentsData[0] | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleBack = () => {
        navigate('/tutor-portal/classes');
    };

    const toggleStudentSelection = (studentId: number) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedStudents.length === studentsData.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(studentsData.map(s => s.id));
        }
    };

    const handleOpenStudentDetails = (student: typeof studentsData[0]) => {
        setSelectedStudent(student);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleViewProfile = () => {
        if (selectedStudent) {
            navigate(`/tutor-portal/students/${selectedStudent.id}?classId=${classId}`);
        }
    };

    return (
        <div className={styles.classDetail}>
            <div className={`${styles.mainContent} ${isSidebarOpen ? styles.withSidebar : ''}`}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <div className={styles.headerLeft}>
                            <button className={styles.backBtn} onClick={handleBack}>
                                <BackIcon />
                            </button>
                            <div className={styles.classInfo}>
                                <div className={styles.classHeader}>
                                    <h1 className={styles.className}>{classData.name}</h1>
                                    <span className={styles.subjectTag}>{classData.subject}</span>
                                    <span className={styles.gradeTag}>{classData.grade}</span>
                                </div>
                                <p className={styles.nextLesson}>Next lesson: {classData.nextLesson}</p>
                            </div>
                        </div>
                        <div className={styles.headerActions}>
                            <button className={styles.actionBtn}>
                                <MessageIcon />
                                <span>Message Class</span>
                            </button>
                            <button className={styles.actionBtn}>
                                <PlusIcon />
                                <span>Add Student</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'students' ? styles.active : ''}`}
                            onClick={() => setActiveTab('students')}
                        >
                            Students
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'homework' ? styles.active : ''}`}
                            onClick={() => setActiveTab('homework')}
                        >
                            Homework
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'materials' ? styles.active : ''}`}
                            onClick={() => setActiveTab('materials')}
                        >
                            Materials
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.contentContainer}>
                        {/* Toolbar */}
                        <div className={styles.toolbar}>
                            <div className={styles.searchWrapper}>
                                <SearchIcon />
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Search students..."
                                />
                            </div>
                            <div className={styles.toolbarActions}>
                                <button className={styles.toolbarBtn}>
                                    <MessageIcon />
                                    <span>Message Selected</span>
                                </button>
                                <button className={styles.toolbarBtn}>
                                    <ExportIcon />
                                    <span>Export List</span>
                                </button>
                            </div>
                        </div>

                        {/* Students Table */}
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.length === studentsData.length}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th>STUDENT</th>
                                        <th>STATUS</th>
                                        <th>LAST<br />LESSON</th>
                                        <th>HOMEWORK<br />STATUS</th>
                                        <th>AVG<br />SCORE</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsData.map((student) => (
                                        <tr
                                            key={student.id}
                                            className={selectedStudent?.id === student.id ? styles.selected : ''}
                                        >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleStudentSelection(student.id);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <div className={styles.studentCell}>
                                                    <img src={student.avatar} alt={student.name} className={styles.avatar} />
                                                    <div className={styles.studentInfo}>
                                                        <div className={styles.studentName}>{student.name}</div>
                                                        <div className={styles.studentEmail}>{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${styles[student.status.toLowerCase()]}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className={styles.lessonDate}>
                                                {student.lastLesson.split('\n').map((line, i) => (
                                                    <div key={i}>{line}</div>
                                                ))}
                                            </td>
                                            <td>
                                                {student.homeworkStatus.count ? (
                                                    <span className={`${styles.hwStatusBadge} ${styles[student.homeworkStatus.type]}`}>
                                                        <span className={styles.hwCount}>{student.homeworkStatus.count}</span>
                                                        <span className={styles.hwLabel}>{student.homeworkStatus.label}</span>
                                                    </span>
                                                ) : (
                                                    <span className={`${styles.statusBadge} ${styles[student.homeworkStatus.type]}`}>
                                                        {student.homeworkStatus.label}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={styles.avgScore}>{student.avgScore}</td>
                                            <td>
                                                <div className={styles.rowActions}>
                                                    <button
                                                        className={styles.iconBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenStudentDetails(student);
                                                        }}
                                                    >
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
                </div>
            </div>

            {/* Right Sidebar - Student Details */}
            {selectedStudent && (
                <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <img src={selectedStudent.avatar} alt={selectedStudent.name} className={styles.sidebarAvatar} />
                    <div className={styles.sidebarStudentInfo}>
                        <h3 className={styles.sidebarStudentName}>{selectedStudent.name}</h3>
                        <div className={styles.sidebarStudentTags}>
                            <span className={styles.sidebarTag}>{selectedStudent.grade}</span>
                            <span className={`${styles.sidebarTag} ${styles.statusTag}`}>{selectedStudent.status}</span>
                        </div>
                    </div>
                    <button className={styles.sidebarCloseBtn} onClick={handleCloseSidebar}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className={styles.sidebarContent}>
                    {/* Quick Actions */}
                    <div className={styles.quickActions}>
                        <button className={styles.quickActionBtn}>
                            <MessageIcon />
                            <span>Message</span>
                        </button>
                        <button className={styles.quickActionBtn}>
                            <NoteIcon />
                            <span>Add Note</span>
                        </button>
                        <button className={styles.quickActionBtn}>
                            <BookIcon />
                            <span>Assign HW</span>
                        </button>
                    </div>

                    {/* Overview */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Overview</h4>
                        <div className={styles.overviewCard}>
                            <div className={styles.overviewRow}>
                                <span className={styles.overviewLabel}>Email</span>
                                <span className={styles.overviewValue}>{selectedStudent.email}</span>
                            </div>
                            <div className={styles.overviewRow}>
                                <span className={styles.overviewLabel}>Last Lesson</span>
                                <span className={styles.overviewValue}>Wed, Jan 15</span>
                            </div>
                            <div className={styles.overviewRow}>
                                <span className={styles.overviewLabel}>Next Lesson</span>
                                <span className={styles.overviewValue}>Mon, Jan 20 at 14:00</span>
                            </div>
                        </div>
                    </div>

                    {/* Attendance */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Attendance (Last 4 sessions)</h4>
                        <div className={styles.attendanceGrid}>
                            <div className={styles.attendanceItem}>
                                <div className={styles.attendanceDate}>Wed 15</div>
                                <div className={`${styles.attendanceStatus} ${styles.present}`}>Present</div>
                            </div>
                            <div className={styles.attendanceItem}>
                                <div className={styles.attendanceDate}>Mon 13</div>
                                <div className={`${styles.attendanceStatus} ${styles.present}`}>Present</div>
                            </div>
                            <div className={styles.attendanceItem}>
                                <div className={styles.attendanceDate}>Wed 8</div>
                                <div className={`${styles.attendanceStatus} ${styles.absent}`}>Absent</div>
                            </div>
                            <div className={styles.attendanceItem}>
                                <div className={styles.attendanceDate}>Mon 6</div>
                                <div className={`${styles.attendanceStatus} ${styles.present}`}>Present</div>
                            </div>
                        </div>
                    </div>

                    {/* Homework Status */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Homework Status</h4>
                        <div className={styles.homeworkList}>
                            <div className={styles.homeworkItem}>
                                <div className={styles.homeworkInfo}>
                                    <div className={styles.homeworkTitle}>Chapter 5 Problems</div>
                                    <div className={styles.homeworkDue}>Due: Jan 16</div>
                                </div>
                                <span className={`${styles.homeworkBadge} ${styles.overdueBadge}`}>Overdue</span>
                            </div>
                            <div className={styles.homeworkItem}>
                                <div className={styles.homeworkInfo}>
                                    <div className={styles.homeworkTitle}>Practice Test 3</div>
                                    <div className={styles.homeworkDue}>Due: Jan 18</div>
                                </div>
                                <span className={`${styles.homeworkBadge} ${styles.inProgressBadge}`}>In Progress</span>
                            </div>
                        </div>
                    </div>

                    {/* View Profile Button */}
                    <button className={styles.viewProfileBtn} onClick={handleViewProfile}>VIEW PROFILE</button>
                </div>
            </aside>
            )}

            {/* Overlay - only show when sidebar is open on smaller screens */}
            {isSidebarOpen && selectedStudent && (
                <div className={styles.sidebarOverlay} onClick={handleCloseSidebar} />
            )}
        </div>
    );
};

export default TutorPortalClassDetail;
