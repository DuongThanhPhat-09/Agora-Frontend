import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/pages/tutor-portal-student-profile.module.css';

// Icons
const MessageIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 3.5L7 7.5L13 3.5M1 10.5V3.5C1 2.94772 1.44772 2.5 2 2.5H12C12.5523 2.5 13 2.94772 13 3.5V10.5C13 11.0523 12.5523 11.5 12 11.5H2C1.44772 11.5 1 11.0523 1 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const NoteIcon = () => (
    <svg width="12.3" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1.5H3.5C2.94772 1.5 2.5 1.94772 2.5 2.5V11.5C2.5 12.0523 2.94772 12.5 3.5 12.5H10.5C11.0523 12.5 11.5 12.0523 11.5 11.5V5M8 1.5L11.5 5M8 1.5V5H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BookIcon = () => (
    <svg width="10.5" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 2V12M7 2C7 2 6 3 4 3C2 3 1 2 1 2V10C1 10 2 11 4 11C6 11 7 10 7 10M7 2C7 2 8 3 10 3C12 3 13 2 13 2V10C13 10 12 11 10 11C8 11 7 10 7 10M7 12C7 12 8 11 10 11C12 11 13 12 13 12M7 12C7 12 6 11 4 11C2 11 1 12 1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowUpIcon = () => (
    <svg width="13.5" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 2L10 5M7 2L4 5M7 2V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowDownIcon = () => (
    <svg width="13.5" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 12L10 9M7 12L4 9M7 12V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Sample data
const studentData = {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.johnson@email.com',
    phone: '+1 (555) 123-4567',
    class: 'AP Mathematics A',
    grade: 'Grade 11',
    status: 'Active',
    nextLesson: 'Monday, Jan 20 at 14:00',
    parent: 'Robert Johnson',
    parentEmail: 'robert.j@email.com',
    avgScore: 87,
    avgScoreChange: +2.4,
    attendanceRate: 85,
    attendanceChange: -1.2,
    overdueHw: 2
};

const attendanceData = [
    { date: 'Wednesday, January 15, 2025', time: '14:00 - 15:30 (90 min)', status: 'Present' },
    { date: 'Monday, January 13, 2025', time: '14:00 - 15:30 (90 min)', status: 'Present' },
    { date: 'Wednesday, January 8, 2025', time: '14:00 - 15:30 (90 min)', status: 'Absent' },
    { date: 'Monday, January 6, 2025', time: '14:00 - 15:30 (90 min)', status: 'Present' }
];

const homeworkData = [
    { id: 1, title: 'Chapter 5 Practice Problems', assigned: 'Jan 10', due: 'Jan 16', status: 'Overdue' },
    { id: 2, title: 'Practice Test 3', assigned: 'Jan 12', due: 'Jan 18', status: 'Overdue' },
    { id: 3, title: 'Calculus Worksheet 7', assigned: 'Jan 8', due: 'Jan 14', status: 'Submitted' }
];

const scoreData = [
    { id: 1, title: 'Mid-term Exam', date: 'January 10, 2025', score: 92 },
    { id: 2, title: 'Chapter 4 Quiz', date: 'January 5, 2025', score: 85 },
    { id: 3, title: 'Practice Test 2', date: 'December 28, 2024', score: 88 }
];

const learningGoals = [
    { id: 1, title: 'Master Calculus Fundamentals', progress: 75 },
    { id: 2, title: 'Improve Problem-Solving Speed', progress: 60 },
    { id: 3, title: 'AP Exam Preparation', progress: 45 }
];

const notes = [
    { id: 1, date: 'Jan 15, 2025', text: 'Excellent progress on derivatives. Focus on\nchain rule next.' },
    { id: 2, date: 'Jan 10, 2025', text: 'Student struggles with word problems.\nAssign more practice.' }
];

const TutorPortalStudentProfile: React.FC = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const searchParams = new URLSearchParams(window.location.search);
    const classId = searchParams.get('classId');
    const [newNote, setNewNote] = useState('');

    const handleBack = () => {
        if (classId) {
            navigate(`/tutor-portal/classes/${classId}`);
        } else {
            navigate('/tutor-portal/classes');
        }
    };

    const handleSaveNote = () => {
        if (newNote.trim()) {
            console.log('Save note:', newNote);
            setNewNote('');
        }
    };

    return (
        <div className={styles.scrollableContentArea}>
            {/* Student Header Section */}
            <div className={styles.sectionStudentHeader}>
                <div className={styles.container13}>
                    <div className={styles.buttonmarginIcon} onClick={handleBack} style={{ cursor: 'pointer' }}>
                        {/* Back arrow */}
                    </div>
                    <div className={styles.container14}>
                        <div className={styles.container15}>
                        <div className={styles.heading1}>
                            <b className={styles.emmaJohnson}>{studentData.name}</b>
                        </div>
                        <div className={styles.overlayborder}>
                            <b className={styles.grade11}>{studentData.grade}</b>
                        </div>
                        <div className={styles.overlayborder2}>
                            <b className={styles.active}>{studentData.status}</b>
                        </div>
                        </div>
                        <div className={styles.container16}>
                        <div className={styles.text9}>
                            <span className={styles.textTxt}>
                                <span className={styles.apMathematicsA}>{studentData.class} • </span>
                                <span className={styles.nextLesson}>Next lesson:</span>
                                <span className={styles.apMathematicsA}> {studentData.nextLesson}</span>
                            </span>
                        </div>
                        </div>
                    </div>
                </div>
                <div className={styles.container17}>
                    <div className={styles.button}>
                        <MessageIcon />
                        <b className={styles.message}>Message</b>
                    </div>
                    <div className={styles.button2}>
                        <NoteIcon />
                        <div className={styles.message}>Add Note</div>
                    </div>
                    <div className={styles.button2}>
                        <BookIcon />
                        <div className={styles.assignHw}>Assign HW</div>
                    </div>
                    <div className={styles.buttonIcon}>{/* More icon */}</div>
                </div>
            </div>

            {/* Main Container */}
            <div className={styles.container18}>
                {/* Left Column */}
                <div className={styles.leftColumnMain}>
                    {/* Overview Stats */}
                    <div className={styles.sectionOverviewStats}>
                        <div className={styles.backgroundbordershadow}>
                        <div className={styles.heading3}>
                            <div className={styles.averageScore}>Average Score</div>
                        </div>
                        <div className={styles.container19}>
                            <b className={styles.b}>{studentData.avgScore}%</b>
                            <div className={styles.container20}>
                                <ArrowUpIcon />
                                <div className={styles.div}>+{studentData.avgScoreChange}%</div>
                            </div>
                        </div>
                        </div>
                        <div className={styles.backgroundbordershadow}>
                        <div className={styles.heading3}>
                            <div className={styles.attendanceRate}>Attendance Rate</div>
                        </div>
                        <div className={styles.container19}>
                            <b className={styles.b2}>{studentData.attendanceRate}%</b>
                            <div className={styles.container22}>
                                <ArrowDownIcon />
                                <div className={styles.div2}>{studentData.attendanceChange}%</div>
                            </div>
                        </div>
                        </div>
                        <div className={styles.backgroundbordershadow}>
                        <div className={styles.heading3}>
                            <div className={styles.overdueHw}>Overdue HW</div>
                        </div>
                        <div className={styles.paragraph}>
                            <b className={styles.b3}>{studentData.overdueHw}</b>
                            <div className={styles.items}>items</div>
                        </div>
                        </div>
                    </div>

                    {/* Attendance History */}
                    <div className={styles.sectionAttendanceHistory}>
                        <div className={styles.overlayhorizontalborder}>
                            <div className={styles.container10}>
                                <b className={styles.attendanceHistory}>Attendance History</b>
                            </div>
                            <div className={styles.options}>
                                <div className={styles.container23}>
                                    <div className={styles.seniorTutor}>Last 30 days</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.container24}>
                            {attendanceData.map((attendance, index) => (
                                <div key={index} className={styles.item1}>
                                    <div className={styles.container25}>
                                        <div className={attendance.status === 'Present' ? styles.background2 : styles.overlay} />
                                        <div className={styles.container10}>
                                            <div className={styles.container27}>
                                                <b className={styles.masterCalculusFundamentals}>{attendance.date}</b>
                                            </div>
                                            <div className={styles.container28}>
                                                <div className={styles.min}>{attendance.time}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={attendance.status === 'Present' ? styles.overlayborder3 : styles.backgroundborder}>
                                        <div className={styles.min}>{attendance.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>

                        {/* Homework Section */}
                        <div className={styles.sectionHomework}>
                        <div className={styles.overlayhorizontalborder}>
                            <div className={styles.container10}>
                                <div className={styles.homeworkAssignments}>Homework & Assignments</div>
                            </div>
                            <div className={styles.button4}>
                                <BookIcon />
                                <div className={styles.assignHomework}>Assign Homework</div>
                            </div>
                        </div>
                        <div className={styles.container41}>
                            {homeworkData.map((homework, index) => (
                                <div key={homework.id} className={index === 0 ? styles.hwItem1 : styles.hwItem2}>
                                    <div className={styles.container14}>
                                        <div className={styles.container27}>
                                            <div className={styles.chapter5Practice}>{homework.title}</div>
                                        </div>
                                        <div className={styles.container43}>
                                            <div className={styles.assignedJan10Container}>
                                                <span className={styles.assignedJan10}>Assigned: {homework.assigned} • </span>
                                                <span className={styles.dueJan16}>Due: {homework.due}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.container44}>
                                        <div className={homework.status === 'Overdue' ? styles.overlayborder6 : styles.backgroundborder2}>
                                            <div className={styles.assignHomework}>{homework.status}</div>
                                        </div>
                                        <div className={styles.link}>
                                            <div className={styles.review}>{homework.status === 'Overdue' ? 'Review' : 'View'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>

                        {/* Score History */}
                        <div className={styles.sectionHomework}>
                        <div className={styles.overlayhorizontalborder3}>
                            <div className={styles.container10}>
                                <b className={styles.scoreHistory}>Score History</b>
                            </div>
                        </div>
                        <div className={styles.container41}>
                            {scoreData.map((score, index) => (
                                <div key={score.id} className={index === 0 ? styles.hwItem1 : styles.hwItem2}>
                                    <div className={styles.container14}>
                                        <div className={styles.container27}>
                                            <b className={styles.midTermExam}>{score.title}</b>
                                        </div>
                                        <div className={styles.container28}>
                                            <div className={styles.text12}>{score.date}</div>
                                        </div>
                                    </div>
                                    <div className={styles.container55}>
                                        <b className={styles.b4}>{score.score}%</b>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={styles.rightColumnSidebarWidgets}>
                        {/* Contact Information */}
                        <div className={styles.sectionContactInfo}>
                        <div className={styles.heading24}>
                            <b className={styles.attendanceHistory}>Contact Information</b>
                        </div>
                        <div className={styles.container62}>
                            <div className={styles.sectionStudentHeader}>
                                <div className={styles.email}>Email:</div>
                                <div className={styles.container64}>
                                    <div className={styles.emmajohnsonemailcom}>{studentData.email}</div>
                                </div>
                            </div>
                            <div className={styles.sectionStudentHeader}>
                                <div className={styles.phone}>Phone:</div>
                                <div className={styles.container64}>
                                    <div className={styles.div3}>{studentData.phone}</div>
                                </div>
                            </div>
                            <div className={styles.horizontalDivider} />
                            <div className={styles.sectionStudentHeader}>
                                <div className={styles.parent}>Parent:</div>
                                <div className={styles.container64}>
                                    <div className={styles.robertJohnson}>{studentData.parent}</div>
                                </div>
                            </div>
                            <div className={styles.sectionStudentHeader}>
                                <div className={styles.parentEmail}>Parent Email:</div>
                                <div className={styles.container64}>
                                    <div className={styles.robertjemailcom}>{studentData.parentEmail}</div>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Learning Goals */}
                        <div className={styles.sectionContactInfo}>
                        <div className={styles.heading24}>
                            <b className={styles.attendanceHistory}>Learning Goals</b>
                        </div>
                        <div className={styles.container71}>
                            {learningGoals.map((goal) => (
                                <div key={goal.id} className={styles.container72}>
                                    <div className={styles.sectionStudentHeader}>
                                        <div className={styles.container27}>
                                            <b className={styles.masterCalculusFundamentals}>{goal.title}</b>
                                        </div>
                                        <div className={styles.container57}>
                                            <div className={styles.min}>{goal.progress}%</div>
                                        </div>
                                    </div>
                                    <div className={styles.backgroundborder3}>
                                        <div
                                            className={goal.progress >= 70 ? styles.background5 : goal.progress >= 50 ? styles.background6 : styles.overlay2}
                                            style={{ width: `${goal.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>

                        {/* Notes */}
                        <div className={styles.sectionNotes}>
                        <div className={styles.heading26}>
                            <b className={styles.notes}>Notes</b>
                        </div>
                        <div className={styles.container84}>
                            {notes.map((note) => (
                                <div key={note.id} className={styles.overlayborder8}>
                                    <div className={styles.container85}>
                                        <div className={styles.excellentProgressOn}>
                                            {note.text.split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    {i < note.text.split('\n').length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.container86}>
                                        <div className={styles.text14}>{note.date}</div>
                                    </div>
                                </div>
                            ))}
                            <div className={styles.container89}>
                                <div className={styles.textarea}>
                                    <div className={styles.container90}>
                                        <input
                                            type="text"
                                            className={styles.addANew}
                                            placeholder="Add a new note..."
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.button5} onClick={handleSaveNote}>
                                    <div className={styles.saveNote}>Save Note</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorPortalStudentProfile;
