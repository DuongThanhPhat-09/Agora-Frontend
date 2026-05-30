import React from 'react';
import styles from '../styles.module.css';
import HourSlotGrid from './HourSlotGrid';
import type { AvailabilitySlot, Combo } from './types';

interface ComboPreviewProps {
    combo: Combo;
    availability: AvailabilitySlot[];
}

// Lịch mô phỏng combo — hiển thị trực quan cho tutor lúc đang tạo combo.
// Fixed: tô các session combo + làm mờ các giờ rảnh còn lại (bối cảnh).
// Flex: highlight lịch rảnh để cho thấy "phụ huynh sẽ chọn N buổi/tuần từ đây".
const ComboPreview: React.FC<ComboPreviewProps> = ({ combo, availability }) => {
    const availSet = new Set(availability.map((s) => s.id));

    // Map key ô → (sessionIdx, isStart) cho combo cố định
    const comboCells = new Map<string, { sessionIdx: number; isStart: boolean }>();
    if (combo.type === 'fixed') {
        combo.sessions.forEach((s, idx) => {
            for (let i = 0; i < s.durationHours; i++) {
                comboCells.set(`${s.dayOfWeek}-${s.startHour + i}`, {
                    sessionIdx: idx,
                    isStart: i === 0,
                });
            }
        });
    }

    const renderCell = (dayOfWeek: number, hour: number) => {
        const key = `${dayOfWeek}-${hour}`;
        const isAvail = availSet.has(key);

        if (combo.type === 'fixed') {
            const inCombo = comboCells.get(key);
            if (inCombo) {
                return (
                    <div className={`${styles.cell} ${styles.cellStatic} ${styles.comboPreviewSelected}`}>
                        {inCombo.isStart && <span className={styles.previewLabel}>{inCombo.sessionIdx + 1}</span>}
                    </div>
                );
            }
            return (
                <div
                    className={`${styles.cell} ${styles.cellStatic} ${isAvail ? styles.comboPreviewAvail : ''}`}
                />
            );
        }
        // flex: tô các ô rảnh — đó là "khung phụ huynh có thể chọn"
        return (
            <div className={`${styles.cell} ${styles.cellStatic} ${isAvail ? styles.available : ''}`} />
        );
    };

    const title =
        combo.type === 'fixed'
            ? combo.sessions.length === 0
                ? 'Lịch combo — chưa có buổi nào'
                : `Lịch combo (${combo.sessions.length} buổi / tuần)`
            : `Phụ huynh chọn ${combo.sessionsPerWeek} buổi/tuần × ${combo.hoursPerSession}h trong lịch rảnh sau`;

    return (
        <div className={styles.comboPreview}>
            <h4 className={styles.comboPreviewTitle}>Lịch mô phỏng</h4>
            <p className={styles.comboPreviewSubtitle}>{title}</p>
            <HourSlotGrid renderCell={renderCell} />
        </div>
    );
};

export default ComboPreview;
