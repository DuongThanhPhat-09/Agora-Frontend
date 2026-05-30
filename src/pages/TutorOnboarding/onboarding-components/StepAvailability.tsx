import React, { useEffect, useRef } from 'react';
import styles from '../styles.module.css';
import HourSlotGrid from './HourSlotGrid';
import type { UseOnboardingState } from './hooks/useOnboardingState';

interface StepAvailabilityProps {
    onboarding: UseOnboardingState;
}

const StepAvailability: React.FC<StepAvailabilityProps> = ({ onboarding }) => {
    const { state, setAvailable, toggleWholeDay } = onboarding;

    const availSet = new Set(state.availability.map((s) => s.id));

    // Drag-paint: bắt đầu ở ô trống → quét bật; ô đang rảnh → quét tắt.
    const dragModeRef = useRef<'add' | 'remove' | null>(null);
    useEffect(() => {
        const stop = () => {
            dragModeRef.current = null;
        };
        window.addEventListener('mouseup', stop);
        return () => window.removeEventListener('mouseup', stop);
    }, []);

    const startDrag = (dayOfWeek: number, hour: number, isAvail: boolean) => {
        const mode = isAvail ? 'remove' : 'add';
        dragModeRef.current = mode;
        setAvailable(dayOfWeek, hour, mode === 'add');
    };
    const extendDrag = (dayOfWeek: number, hour: number) => {
        if (!dragModeRef.current) return;
        setAvailable(dayOfWeek, hour, dragModeRef.current === 'add');
    };

    const renderCell = (dayOfWeek: number, hour: number) => {
        const isAvail = availSet.has(`${dayOfWeek}-${hour}`);
        return (
            <button
                type="button"
                className={`${styles.cell} ${isAvail ? styles.available : ''}`}
                onMouseDown={(e) => {
                    e.preventDefault();
                    startDrag(dayOfWeek, hour, isAvail);
                }}
                onMouseEnter={() => extendDrag(dayOfWeek, hour)}
            >
                {isAvail ? <span className={styles.cellLabel}>Rảnh</span> : <span className={styles.cellHour}>+</span>}
            </button>
        );
    };

    return (
        <div>
            <h2 className={styles.stepHeading}>Lịch rảnh trong tuần</h2>
            <p className={styles.stepHint}>
                Nhấn hoặc <strong>kéo chuột</strong> để đánh dấu khung giờ rảnh. Lịch này dùng chung cho mọi môn — khi tạo
                combo cố định ở bước 4, bạn chỉ chọn được từ các khung này.
            </p>

            <div className={`${styles.legend} ${styles.legendTop}`}>
                <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.available}`} /> Khung giờ rảnh
                </div>
            </div>

            <HourSlotGrid renderCell={renderCell} wholeDayLabel="Cả ngày" onWholeDayClick={toggleWholeDay} />
        </div>
    );
};

export default StepAvailability;
