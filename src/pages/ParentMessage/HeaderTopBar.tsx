import styles from './styles.module.css';

// Icons
const DropdownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const ReportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="12" height="11" rx="2" />
    <path d="M5 7h6M5 10h4" strokeLinecap="round" />
    <path d="M6 3V1M10 3V1" strokeLinecap="round" />
  </svg>
);

const NewMessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 6V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h4" strokeLinecap="round" />
    <path d="M2 3l6 4 6-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 14v-4M9 12h4" strokeLinecap="round" />
  </svg>
);

const HeaderTopBar = () => {
    // TODO: Replace with actual student data from API/Context
    // This should load the selected student's information
    const studentData = {
        name: 'Student',
        grade: 'Grade 8',
        initials: 'S'
    };

    return (
        <header className={styles.topBar}>
            <div className={styles.topBarLeft}>
                <h1 className={styles.pageTitle}>Messages</h1>
                <button className={styles.childSelector} type="button">
                    <div className={styles.childAvatar}>
                        <span>{studentData.initials}</span>
                    </div>
                    <span className={styles.childName}>{studentData.name} • {studentData.grade}</span>
                    <DropdownIcon />
                </button>
            </div>
            <div className={styles.topBarActions}>
                <button className={styles.secondaryButton} type="button">
                    <ReportIcon />
                    Auto-Reports
                </button>
                <button className={styles.primaryButton} type="button">
                    <NewMessageIcon />
                    New Message
                </button>
            </div>
        </header>
    );
};

export default HeaderTopBar;
