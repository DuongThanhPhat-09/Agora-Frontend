import React, { useEffect, useMemo, useRef } from 'react';
import { CheckCircleOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import styles from '../styles.module.css';
import { DAY_COLUMNS } from './constants';
import HourSlotGrid from './HourSlotGrid';
import type { UseOnboardingState } from './hooks/useOnboardingState';

interface StepAvailabilityProps {
  onboarding: UseOnboardingState;
}

type PaintMode = 'add' | 'remove';

const slotId = (dayOfWeek: number, hour: number) => `${dayOfWeek}-${hour}`;

const StepAvailability: React.FC<StepAvailabilityProps> = ({ onboarding }) => {
  const { state, setAvailable, toggleAvailabilityDay, clearAvailability } = onboarding;
  const paintModeRef = useRef<PaintMode | null>(null);
  const paintedIdsRef = useRef(new Set<string>());

  const availabilityIds = useMemo(() => new Set(state.availability.map((slot) => slot.id)), [state.availability]);
  const selectedDayCount = useMemo(
    () => new Set(state.availability.map((slot) => slot.dayOfWeek)).size,
    [state.availability],
  );

  useEffect(() => {
    const stopPainting = () => {
      paintModeRef.current = null;
      paintedIdsRef.current.clear();
    };

    window.addEventListener('pointerup', stopPainting);
    window.addEventListener('pointercancel', stopPainting);
    return () => {
      window.removeEventListener('pointerup', stopPainting);
      window.removeEventListener('pointercancel', stopPainting);
    };
  }, []);

  const paintCell = (dayOfWeek: number, hour: number, mode: PaintMode) => {
    const id = slotId(dayOfWeek, hour);
    if (paintedIdsRef.current.has(id)) return;

    paintedIdsRef.current.add(id);
    setAvailable(dayOfWeek, hour, mode === 'add');
  };

  const startPainting = (dayOfWeek: number, hour: number, isAvailable: boolean) => {
    const mode: PaintMode = isAvailable ? 'remove' : 'add';
    paintModeRef.current = mode;
    paintedIdsRef.current.clear();
    paintCell(dayOfWeek, hour, mode);
  };

  const extendPainting = (dayOfWeek: number, hour: number) => {
    if (!paintModeRef.current) return;
    paintCell(dayOfWeek, hour, paintModeRef.current);
  };

  const extendPaintingAtPoint = (clientX: number, clientY: number) => {
    const target = document
      .elementFromPoint(clientX, clientY)
      ?.closest<HTMLElement>('[data-availability-day][data-availability-hour]');
    if (!target) return;

    const dayOfWeek = Number(target.dataset.availabilityDay);
    const hour = Number(target.dataset.availabilityHour);
    extendPainting(dayOfWeek, hour);
  };

  const renderCell = (dayOfWeek: number, hour: number) => {
    const id = slotId(dayOfWeek, hour);
    const isAvailable = availabilityIds.has(id);
    const day = DAY_COLUMNS.find((column) => column.dayOfWeek === dayOfWeek)?.full ?? `Ngày ${dayOfWeek}`;

    return (
      <button
        type="button"
        className={`${styles.cell} ${isAvailable ? styles.available : ''}`}
        data-availability-day={dayOfWeek}
        data-availability-hour={hour}
        aria-label={`${day}, ${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`}
        aria-pressed={isAvailable}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          startPainting(dayOfWeek, hour, isAvailable);
        }}
        onPointerEnter={() => extendPainting(dayOfWeek, hour)}
        onPointerMove={(event) => extendPaintingAtPoint(event.clientX, event.clientY)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          setAvailable(dayOfWeek, hour, !isAvailable);
        }}
      >
        {isAvailable ? <span className={styles.cellLabel}>Rảnh</span> : <span className={styles.cellAdd}>+</span>}
      </button>
    );
  };

  return (
    <div className={styles.availabilityStep}>
      <section className={styles.availabilityIntro}>
        <div>
          <span className={styles.availabilityEyebrow}>Bước bắt buộc</span>
          <h2 className={styles.stepHeading}>Thiết lập lịch rảnh hàng tuần</h2>
          <p>Nhấn vào từng ô hoặc giữ chuột và kéo để chọn nhanh các giờ bạn có thể nhận lớp.</p>
        </div>
        <span className={styles.availabilityCountBadge}>
          <CheckCircleOutlined />
          {state.availability.length} giờ đã chọn
        </span>
      </section>

      <div className={styles.availabilityToolbar}>
        <div className={styles.availabilityLegend}>
          <span className={`${styles.legendDot} ${styles.available}`} />
          Giờ rảnh sẽ được dùng để giới hạn lịch combo
        </div>
        <div className={styles.availabilityToolbarActions}>
          <span className={styles.availabilityDragHint}>
            <DragOutlined />
            Click hoặc kéo để chọn nhiều ô
          </span>
          {state.availability.length > 0 && (
            <button type="button" className={styles.availabilityClearBtn} onClick={clearAvailability}>
              <DeleteOutlined />
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      <HourSlotGrid renderCell={renderCell} wholeDayLabel="Cả ngày" onWholeDayClick={toggleAvailabilityDay} />

      <div className={styles.availabilitySelectionSummary}>
        <CheckCircleOutlined />
        {state.availability.length === 0
          ? 'Chưa chọn lịch rảnh. Hãy chọn ít nhất một ô để tiếp tục.'
          : `${selectedDayCount} ngày · ${state.availability.length} giờ rảnh đã chọn`}
      </div>
    </div>
  );
};

export default StepAvailability;
