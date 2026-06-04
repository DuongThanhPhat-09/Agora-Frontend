import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Select, Button } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import styles from '../styles.module.css';
import { DAY_COLUMNS, END_HOUR, START_HOUR, formatHourMinute, minutesOf } from './constants';

export interface BulkSlot {
  dayOfWeek: number;
  hour: number;
  minute: 0 | 30;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (slots: BulkSlot[]) => void;
}

// Tất cả mốc 30 phút từ 06:00 → 22:00 (33 mốc, bao gồm 22:00 cho end time).
const ALL_HALF_HOUR_TIMES: Array<{ hour: number; minute: 0 | 30 }> = (() => {
  const out: Array<{ hour: number; minute: 0 | 30 }> = [];
  for (let h = START_HOUR; h <= END_HOUR; h += 1) {
    out.push({ hour: h, minute: 0 });
    if (h !== END_HOUR) out.push({ hour: h, minute: 30 });
  }
  return out;
})();

const timeKey = (hour: number, minute: 0 | 30) => `${hour}:${minute}`;

const BulkAvailabilityModal: React.FC<Props> = ({ open, onClose, onApply }) => {
  // Khởi tạo không chọn ngày nào — user tự pick mỗi lần mở.
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startKey, setStartKey] = useState<string>('8:0');
  const [endKey, setEndKey] = useState<string>('10:0');

  // Khi mở lại modal → reset hoàn toàn để tránh state cũ gây bối rối.
  useEffect(() => {
    if (open) {
      setSelectedDays([]);
      setStartKey('8:0');
      setEndKey('10:0');
    }
  }, [open]);

  const startOptions = useMemo(
    () =>
      ALL_HALF_HOUR_TIMES.slice(0, -1).map((t) => ({
        value: timeKey(t.hour, t.minute),
        label: formatHourMinute(t.hour, t.minute),
      })),
    [],
  );

  const [startH, startM] = startKey.split(':').map(Number);
  const startTotal = minutesOf(startH, startM);

  const endOptions = useMemo(
    () =>
      ALL_HALF_HOUR_TIMES.filter((t) => minutesOf(t.hour, t.minute) > startTotal).map((t) => ({
        value: timeKey(t.hour, t.minute),
        label: formatHourMinute(t.hour, t.minute),
      })),
    [startTotal],
  );

  const [endH, endM] = endKey.split(':').map(Number);
  const endTotal = minutesOf(endH, endM);

  // Nếu end ≤ start (vd user vừa đổi start sau end) → snap lên start+30 phút.
  useEffect(() => {
    if (endTotal <= startTotal) {
      const next = ALL_HALF_HOUR_TIMES.find((t) => minutesOf(t.hour, t.minute) > startTotal);
      if (next) setEndKey(timeKey(next.hour, next.minute));
    }
  }, [startTotal, endTotal]);

  const slotsPerDay = Math.max(0, Math.floor((endTotal - startTotal) / 30));
  const canApply = selectedDays.length > 0 && slotsPerDay > 0;

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleApply = () => {
    if (!canApply) return;
    const slots: BulkSlot[] = [];
    selectedDays.forEach((day) => {
      for (let cur = startTotal; cur < endTotal; cur += 30) {
        const h = Math.floor(cur / 60);
        const m = (cur % 60) as 0 | 30;
        slots.push({ dayOfWeek: day, hour: h, minute: m });
      }
    });
    onApply(slots);
    onClose();
  };

  return (
    <Modal
      className={styles.bulkAvailModal}
      open={open}
      onCancel={onClose}
      title={
        <div className={styles.bulkAvailTitle}>
          <CalendarOutlined />
          <span>Thêm khung giờ rảnh nhanh</span>
        </div>
      }
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply} disabled={!canApply}>
          Thêm vào lịch
        </Button>,
      ]}
      width={520}
      destroyOnClose
    >
      <div className={styles.bulkAvailForm}>
        {/* Day chips */}
        <div className={styles.bulkAvailField}>
          <div className={styles.bulkAvailFieldHead}>
            <span className={styles.bulkAvailFieldLabel}>Áp dụng cho ngày</span>
            <div className={styles.bulkAvailQuick}>
              <button type="button" onClick={() => setSelectedDays(DAY_COLUMNS.map((c) => c.dayOfWeek))}>
                Cả tuần
              </button>
              <button type="button" onClick={() => setSelectedDays([])}>
                Bỏ chọn
              </button>
            </div>
          </div>
          <div className={styles.bulkAvailDays}>
            {DAY_COLUMNS.map((col) => {
              const isSelected = selectedDays.includes(col.dayOfWeek);
              return (
                <button
                  key={col.dayOfWeek}
                  type="button"
                  className={`${styles.bulkAvailDay} ${isSelected ? styles.bulkAvailDaySelected : ''}`}
                  onClick={() => toggleDay(col.dayOfWeek)}
                  aria-pressed={isSelected}
                >
                  {col.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time range */}
        <div className={styles.bulkAvailField}>
          <span className={styles.bulkAvailFieldLabel}>Khung giờ</span>
          <div className={styles.bulkAvailTimeRow}>
            <label className={styles.bulkAvailTimeField}>
              <span>Từ</span>
              <Select value={startKey} onChange={setStartKey} options={startOptions} style={{ width: '100%' }} />
            </label>
            <span className={styles.bulkAvailTimeArrow}>→</span>
            <label className={styles.bulkAvailTimeField}>
              <span>Đến</span>
              <Select value={endKey} onChange={setEndKey} options={endOptions} style={{ width: '100%' }} />
            </label>
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default BulkAvailabilityModal;
