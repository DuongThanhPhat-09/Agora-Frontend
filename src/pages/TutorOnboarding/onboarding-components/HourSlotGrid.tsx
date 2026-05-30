import React from 'react';
import styles from '../styles.module.css';
import { DAY_COLUMNS, HOURS, formatHour } from './constants';

interface HourSlotGridProps {
    // Render the inner content/handlers of a single cell (day × hour).
    renderCell: (dayOfWeek: number, hour: number) => React.ReactNode;
    // Optional per-day quick action shown under each day header (e.g. "Cả ngày").
    wholeDayLabel?: string;
    onWholeDayClick?: (dayOfWeek: number) => void;
}

// Presentational layout shared by Step 2 (chọn khung giờ rảnh) and
// Step 3 (đặt giá). Lưới ngày × giờ, bước 1 giờ. Cell appearance/behaviour
// is delegated to the parent via `renderCell`.
const HourSlotGrid: React.FC<HourSlotGridProps> = ({ renderCell, wholeDayLabel, onWholeDayClick }) => {
    return (
        <div className={styles.gridCard}>
            <div className={styles.grid}>
                {/* Header row */}
                <div className={styles.gridCorner} />
                {DAY_COLUMNS.map((col) => (
                    <div key={`head-${col.dayOfWeek}`} className={styles.colHead}>
                        <div className={styles.colHeadDay}>{col.label}</div>
                        {wholeDayLabel && onWholeDayClick && (
                            <button
                                type="button"
                                className={styles.wholeDayBtn}
                                onClick={() => onWholeDayClick(col.dayOfWeek)}
                            >
                                {wholeDayLabel}
                            </button>
                        )}
                    </div>
                ))}

                {/* Body rows: one per hour */}
                {HOURS.map((hour) => (
                    <React.Fragment key={`row-${hour}`}>
                        <div className={styles.rowTime}>{formatHour(hour)}</div>
                        {DAY_COLUMNS.map((col) => (
                            <React.Fragment key={`cell-${col.dayOfWeek}-${hour}`}>
                                {renderCell(col.dayOfWeek, hour)}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default HourSlotGrid;
