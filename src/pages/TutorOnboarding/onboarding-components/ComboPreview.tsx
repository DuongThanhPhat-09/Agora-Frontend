import React from 'react';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from '../styles.module.css';
import HourSlotGrid from './HourSlotGrid';
import { isHourFullyAvailable } from './availability-utils';
import type { Combo, TutorAvailabilitySlot } from './types';

interface ComboPreviewProps {
  combo: Combo;
  availability: TutorAvailabilitySlot[];
}

const ComboPreview: React.FC<ComboPreviewProps> = ({ combo, availability }) => {
  if (combo.type === 'flex') {
    return (
      <div className={styles.comboPreview}>
        <div className={styles.comboPreviewHead}>
          <span className={styles.comboPreviewIcon}>
            <CalendarOutlined />
          </span>
          <div>
            <h4 className={styles.comboPreviewTitle}>Tóm tắt combo</h4>
            <p className={styles.comboPreviewSubtitle}>Lịch linh hoạt theo nhu cầu phụ huynh</p>
          </div>
        </div>
        <div className={styles.comboPreviewStats}>
          <div>
            <strong>{combo.sessionsPerWeek}</strong>
            <span>buổi / tuần</span>
          </div>
          <div>
            <strong>{combo.sessionsPerMonth}</strong>
            <span>buổi / tháng</span>
          </div>
          <div>
            <strong>{combo.hoursPerSession}h</strong>
            <span>mỗi buổi</span>
          </div>
        </div>
        <p className={styles.comboPreviewNote}>
          Phụ huynh sẽ chủ động chọn trong {availability.length} khung giờ rảnh bạn đã thiết lập.
        </p>
      </div>
    );
  }

  const comboCells = new Map<string, { sessionIdx: number; isStart: boolean }>();
  combo.sessions.forEach((session, index) => {
    for (let offset = 0; offset < session.durationHours; offset++) {
      comboCells.set(`${session.dayOfWeek}-${session.startHour + offset}`, {
        sessionIdx: index,
        isStart: offset === 0,
      });
    }
  });

  const renderCell = (dayOfWeek: number, hour: number) => {
    const inCombo = comboCells.get(`${dayOfWeek}-${hour}`);
    if (inCombo) {
      return (
        <div className={`${styles.cell} ${styles.cellStatic} ${styles.comboPreviewSelected}`}>
          {inCombo.isStart && <span className={styles.previewLabel}>{inCombo.sessionIdx + 1}</span>}
        </div>
      );
    }
    if (isHourFullyAvailable(dayOfWeek, hour, availability)) {
      return <div className={`${styles.cell} ${styles.cellStatic} ${styles.comboPreviewAvail}`} />;
    }
    return <div className={`${styles.cell} ${styles.cellStatic}`} />;
  };

  const totalHours = combo.sessions.reduce((sum, session) => sum + session.durationHours, 0);

  return (
    <div className={styles.comboPreview}>
      <div className={styles.comboPreviewHead}>
        <span className={styles.comboPreviewIcon}>
          <CalendarOutlined />
        </span>
        <div>
          <h4 className={styles.comboPreviewTitle}>Lịch tuần mô phỏng</h4>
          <p className={styles.comboPreviewSubtitle}>
            {combo.sessions.length === 0
              ? 'Thêm buổi học để xem lịch'
              : `${combo.sessions.length} buổi · ${totalHours} giờ mỗi tuần`}
          </p>
        </div>
      </div>
      <div className={styles.comboPreviewLegend}>
        <span>
          <i className={styles.comboPreviewAvailableDot} />
          Lịch rảnh
        </span>
        <span>
          <i />
          Buổi học trong combo
        </span>
        <span>
          <ClockCircleOutlined />
          06:00 - 22:00
        </span>
      </div>
      <HourSlotGrid renderCell={renderCell} />
    </div>
  );
};

export default ComboPreview;
