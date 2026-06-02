import React from 'react';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styles from '../styles.module.css';
import HourSlotGrid from './HourSlotGrid';
import { isHourFullyAvailable } from './availability-utils';
import type { Combo, TutorAvailabilitySlot } from './types';

export interface ExternalBusyInfo {
  comboName: string;
}

interface ComboPreviewProps {
  combo: Combo;
  availability: TutorAvailabilitySlot[];
  // (dayOfWeek-hour) → combo khác đang chiếm khung giờ. Map rỗng khi tạo combo đầu tiên.
  externalBusyCells?: Map<string, ExternalBusyInfo>;
}

const ComboPreview: React.FC<ComboPreviewProps> = ({ combo, availability, externalBusyCells }) => {
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
    const key = `${dayOfWeek}-${hour}`;
    const inCombo = comboCells.get(key);
    const externalBusy = externalBusyCells?.get(key);

    // Xung đột: combo hiện tại VÀ combo khác cùng claim ô này.
    if (inCombo && externalBusy) {
      return (
        <div
          className={`${styles.cell} ${styles.cellStatic} ${styles.comboPreviewConflict}`}
          title={`Trùng với "${externalBusy.comboName}"`}
        >
          {inCombo.isStart && <span className={styles.previewLabel}>!</span>}
        </div>
      );
    }

    // Combo hiện tại đang dùng ô này.
    if (inCombo) {
      return (
        <div className={`${styles.cell} ${styles.cellStatic} ${styles.comboPreviewSelected}`}>
          {inCombo.isStart && <span className={styles.previewLabel}>{inCombo.sessionIdx + 1}</span>}
        </div>
      );
    }

    // Combo khác đang chiếm (không xung đột vì combo hiện tại không dùng giờ này, nhưng vẫn show để tutor biết).
    if (externalBusy) {
      return (
        <div
          className={`${styles.cell} ${styles.cellStatic} ${styles.comboPreviewBusy}`}
          title={`Đã dùng cho "${externalBusy.comboName}"`}
        />
      );
    }

    // Ô rảnh — nền nhạt.
    if (isHourFullyAvailable(dayOfWeek, hour, availability)) {
      return <div className={`${styles.cell} ${styles.cellStatic} ${styles.comboPreviewAvail}`} />;
    }
    return <div className={`${styles.cell} ${styles.cellStatic}`} />;
  };

  const totalHours = combo.sessions.reduce((sum, session) => sum + session.durationHours, 0);
  const hasExternal = (externalBusyCells?.size ?? 0) > 0;

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
        {hasExternal && (
          <>
            <span>
              <i className={styles.comboPreviewBusyDot} />
              Combo khác
            </span>
            <span>
              <i className={styles.comboPreviewConflictDot} />
              Trùng giờ
            </span>
          </>
        )}
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
