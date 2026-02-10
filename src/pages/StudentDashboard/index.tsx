import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { fetchStudentDashboardData } from './mockData';
import QuickStatsBar from './QuickStatsBar';
import FocusHero from './FocusHero';
import CoursesOverview from './CoursesOverview';
import TasksSection from './TasksSection';
import ProgressPanel from './ProgressPanel';
import RecentSessions from './RecentSessions';
import type { StudentDashboardData } from './types';

const StudentDashboard = () => {
  const [data, setData] = useState<StudentDashboardData | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchStudentDashboardData().then((response) => {
      if (isMounted) {
        setData(response);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <QuickStatsBar items={data.quickStats} />
      <div className={styles.content}>
        <FocusHero focus={data.focus} />
        <div className={styles.mainGrid}>
          <div className={styles.leftColumn}>
            <CoursesOverview courses={data.courses} />
            <TasksSection tasks={data.tasks} />
          </div>
          <div className={styles.rightColumn}>
            <ProgressPanel progress={data.progress} />
            <RecentSessions sessions={data.recentSessions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
