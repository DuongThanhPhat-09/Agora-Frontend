import styles from './styles.module.css';
import GradeTrendChart from './GradeTrendChart';
import SubjectDistributionChart from './SubjectDistributionChart';
import AttendanceChart from './AttendanceChart';
import HomeworkStatusCard from './HomeworkStatusCard';

const imgInsightMath = 'https://www.figma.com/api/mcp/asset/5123df64-b6d7-4a8c-af8f-074edaed4ca3';
const imgInsightAttendance = 'https://www.figma.com/api/mcp/asset/87697f6a-d1b7-464a-bef0-af754a406175';
const imgInsightHomework = 'https://www.figma.com/api/mcp/asset/a944dab6-15f4-4526-8763-1bde6a23060b';
const imgInsightNextLesson = 'https://www.figma.com/api/mcp/asset/8090933f-c8a8-466b-bcd2-b32d981f8406';
const imgReportHomework = 'https://www.figma.com/api/mcp/asset/1de41265-1b6b-4954-8f26-b7a4ce283cff';
const imgReportNoHomework = 'https://www.figma.com/api/mcp/asset/dee844f2-3665-428a-9ea5-fffd22abfc9f';

const reports = [
    {
        date: 'Jan 20, 2025 • Math',
        tutor: 'with Sarah Mitchell',
        summary: 'Covered quadratic equations. Emma showed good understanding of factoring methods and completed practice problems efficiently.',
        grade: 'Grade: B+',
        homework: 'Homework assigned',
        icon: imgReportHomework,
    },
    {
        date: 'Jan 18, 2025 • Physics',
        tutor: 'with Mr. Davis',
        summary: "Newton's laws of motion. Good participation in discussions. Needs more practice with force diagrams.",
        grade: 'Grade: B',
        homework: 'Homework assigned',
        icon: imgReportHomework,
    },
    {
        date: 'Jan 15, 2025 • Math',
        tutor: 'with Sarah Mitchell',
        summary: 'Review session for upcoming test. Focused on areas of weakness identified in previous assessments.',
        grade: 'Grade: A-',
        homework: 'No homework',
        icon: imgReportNoHomework,
    },
];

const ChildrenDetail = () => {
    return (
        <div className={styles.container} data-name="Container" data-node-id="2253:13059">
            <div className={styles.insightStrip} data-name="Insight Summary Strip" data-node-id="2253:13060">
                <div className={styles.insightCard} data-node-id="2253:13061">
                    <img src={imgInsightMath} alt="" className={styles.insightIcon} />
                    <span className={styles.insightText}>Math improved +1.2 in 4 weeks</span>
                </div>
                <div className={styles.insightCard} data-node-id="2253:13071">
                    <img src={imgInsightAttendance} alt="" className={styles.insightIcon} />
                    <span className={styles.insightText}>Attendance 4/5 this week</span>
                </div>
                <div className={styles.insightCard} data-node-id="2253:13077">
                    <img src={imgInsightHomework} alt="" className={styles.insightIcon} />
                    <span className={styles.insightText}>1 homework overdue</span>
                </div>
                <div className={styles.insightCard} data-node-id="2253:13083">
                    <img src={imgInsightNextLesson} alt="" className={styles.insightIcon} />
                    <span className={styles.insightText}>Next lesson Tue 4:00 PM</span>
                </div>
            </div>

            <div className={styles.chartsGrid} data-name="Charts Grid" data-node-id="2253:13089">
                <GradeTrendChart />
                <SubjectDistributionChart />
                <AttendanceChart />
                <HomeworkStatusCard />
            </div>

            <div className={styles.reportsCard} data-name="Recent Session Reports" data-node-id="2253:13192">
                <div className={styles.reportsHeader}>
                    <div className={styles.reportsTitle}>Recent Session Reports</div>
                </div>
                <div className={styles.reportsBody}>
                    {reports.map((report, index) => (
                        <div key={report.date} className={styles.reportItem}>
                            <div className={styles.reportMain}>
                                <div className={styles.reportLine}>
                                    <span className={styles.reportDate}>{report.date}</span>
                                    <span className={styles.reportTutor}>{report.tutor}</span>
                                </div>
                                <div className={styles.reportSummary}>{report.summary}</div>
                            </div>
                            <button className={styles.reportLink}>View Report</button>
                            <div className={styles.reportMetaRow}>
                                <div className={styles.reportMetaItem}>
                                    <img src={report.icon} alt="" className={styles.reportMetaIcon} />
                                    <span className={styles.reportMetaText}>{report.homework}</span>
                                </div>
                                <span className={styles.reportGrade}>{report.grade}</span>
                            </div>
                            {index < reports.length - 1 && <div className={styles.reportDivider} />}
                        </div>
                    ))}
                </div>
                <div className={styles.reportsFooter}>
                    <button className={styles.reportLink}>View all session reports</button>
                </div>
            </div>
        </div>
    );
};

export default ChildrenDetail;
