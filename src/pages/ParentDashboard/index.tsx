import styles from './styles.module.css';

// Icon components for stats cards
const AttendanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" />
    <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GradeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M4 17V3h12v14l-6-3-6 3z" strokeLinejoin="round" />
    <path d="M8 8h4M8 11h2" strokeLinecap="round" />
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <rect x="2" y="4" width="16" height="13" rx="2" />
    <path d="M2 8h16" />
    <circle cx="14" cy="12" r="1" fill="#1a2238" />
  </svg>
);

const SessionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <circle cx="10" cy="10" r="8" />
    <path d="M10 6v4l3 2" strokeLinecap="round" />
  </svg>
);

// Quick action icons
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M2 5l8 5 8-5M2 15V5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" strokeLinecap="round" />
  </svg>
);

const ChildrenActionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" strokeLinecap="round" />
  </svg>
);

const FinanceActionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <rect x="2" y="4" width="16" height="13" rx="2" />
    <path d="M10 8v5M7.5 10.5h5" strokeLinecap="round" />
  </svg>
);

// Lesson subject icons
const MathIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M4 9h10M9 4v10" strokeLinecap="round" />
  </svg>
);

const PhysicsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <circle cx="9" cy="9" r="3" />
    <ellipse cx="9" cy="9" rx="8" ry="4" />
  </svg>
);

const EnglishIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M4 3v12M4 3h6a3 3 0 010 6H4m0 0h7a3 3 0 010 6H4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChemistryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1a2238" strokeWidth="1.5">
    <path d="M7 2v5L3 14a2 2 0 001.7 3h8.6a2 2 0 001.7-3l-4-7V2M6 2h6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Warning icon for Needs Attention
const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 1L1 16h16L9 1z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
    <path d="M9 7v4M9 13v1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const lessons = [
  {
    subject: 'Math - Algebra',
    time: 'Today, 4:00 PM',
    tutor: 'Tutor Sarah',
    status: 'Confirmed' as const,
    icon: MathIcon,
    highlighted: true,
  },
  {
    subject: 'Physics - Motion',
    time: 'Tomorrow, 2:00 PM',
    tutor: 'Mr. Davis',
    status: 'Scheduled' as const,
    icon: PhysicsIcon,
    highlighted: false,
  },
  {
    subject: 'English - Essay Writing',
    time: 'Jan 22, 3:30 PM',
    tutor: 'Ms. Wilson',
    status: 'Scheduled' as const,
    icon: EnglishIcon,
    highlighted: false,
  },
  {
    subject: 'Chemistry - Organic',
    time: 'Jan 23, 10:00 AM',
    tutor: 'Dr. Lee',
    status: 'Scheduled' as const,
    icon: ChemistryIcon,
    highlighted: false,
  },
];

const ParentDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Welcome Banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>Welcome back, Jennifer</h1>
            <p className={styles.welcomeSubtitle}>
              Here's how Emma is doing this week
            </p>
            <span className={styles.welcomeDate}>Jan 20 - Jan 26, 2025</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {/* Attendance */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIconWrap}>
                <AttendanceIcon />
              </div>
              <span className={`${styles.statBadge} ${styles.badgeGreen}`}>80%</span>
            </div>
            <div className={styles.statValue}>4/5</div>
            <div className={styles.statLabel}>Attendance</div>
            <div className={styles.statSubtitle}>This Week</div>
          </div>

          {/* Average Grade */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIconWrap}>
                <GradeIcon />
              </div>
              <span className={`${styles.statBadge} ${styles.badgeGreen}`}>&uarr; 1.2</span>
            </div>
            <div className={styles.statValue}>B+</div>
            <div className={styles.statLabel}>Average Grade</div>
            <div className={styles.statSubtitle}>From last month</div>
          </div>

          {/* Wallet Balance */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIconWrap}>
                <WalletIcon />
              </div>
              <span className={`${styles.statBadge} ${styles.badgeGreen}`}>Funded</span>
            </div>
            <div className={styles.statValue}>$240</div>
            <div className={styles.statLabel}>Wallet Balance</div>
            <div className={styles.statSubtitle}>Next due covered</div>
          </div>

          {/* Sessions */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIconWrap}>
                <SessionsIcon />
              </div>
              <span className={`${styles.statBadge} ${styles.badgeBlue}`}>Active</span>
            </div>
            <div className={styles.statValue}>5</div>
            <div className={styles.statLabel}>Sessions</div>
            <div className={styles.statSubtitle}>Scheduled this week</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn}>
            <MessageIcon />
            <span>Message</span>
          </button>
          <button className={styles.quickActionBtn}>
            <ChildrenActionIcon />
            <span>View Children</span>
          </button>
          <button className={styles.quickActionBtn}>
            <FinanceActionIcon />
            <span>Finance</span>
          </button>
        </div>

        {/* Main Content Grid (2 columns) */}
        <div className={styles.contentGrid}>
          {/* Left: Upcoming Lessons */}
          <div className={styles.lessonsCard}>
            <div className={styles.lessonsHeader}>
              <h3>Upcoming Lessons</h3>
              <a href="#" className={styles.viewAllLink}>View full schedule &rarr;</a>
            </div>
            <div className={styles.lessonsList}>
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className={`${styles.lessonItem} ${lesson.highlighted ? styles.lessonHighlighted : ''}`}
                >
                  <div className={styles.lessonLeft}>
                    <div className={styles.lessonIcon}>
                      <lesson.icon />
                    </div>
                    <div className={styles.lessonInfo}>
                      <span className={styles.lessonSubject}>{lesson.subject}</span>
                      <span className={styles.lessonTime}>{lesson.time} &bull; {lesson.tutor}</span>
                    </div>
                  </div>
                  <div className={styles.lessonRight}>
                    <span className={`${styles.lessonBadge} ${lesson.status === 'Confirmed' ? styles.badgeConfirmed : styles.badgeScheduled}`}>
                      {lesson.status}
                    </span>
                    <button className={styles.lessonViewBtn}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Latest Session + Needs Attention */}
          <div className={styles.rightColumn}>
            {/* Latest Session Card */}
            <div className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <h3>Latest Session</h3>
                <span className={styles.sessionDate}>Jan 18</span>
              </div>
              <div className={styles.sessionContent}>
                <p className={styles.sessionDescription}>
                  Emma showed excellent improvement in algebra problem-solving. Completed all practice problems.
                </p>
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionInfoLabel}>Homework assigned</span>
                  <span className={styles.sessionInfoValue}>Yes</span>
                </div>
                <button className={styles.sessionBtn}>View Full Report</button>
              </div>
            </div>

            {/* Needs Attention Card */}
            <div className={styles.attentionCard}>
              <h3>Needs Attention</h3>
              <div className={styles.attentionContent}>
                <div className={styles.attentionIcon}>
                  <WarningIcon />
                </div>
                <div className={styles.attentionDetails}>
                  <span className={styles.attentionTitle}>Payment Due Soon</span>
                  <span className={styles.attentionDesc}>Next payment due Jan 30</span>
                  <a href="#" className={styles.attentionLink}>Pay Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
