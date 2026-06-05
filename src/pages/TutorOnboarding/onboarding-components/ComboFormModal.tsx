import React, { useMemo, useState } from 'react';
import { Input, InputNumber, Modal, Select } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import styles from '../styles.module.css';
import ComboPreview from './ComboPreview';
import {
  findFirstAvailableSession,
  getAvailableDurations,
  getAvailableStartTimes,
  hasAvailabilityForDuration,
  isSessionWithinAvailability,
} from './availability-utils';
import { DAY_COLUMNS, END_HOUR, formatHourMinute, minutesOf } from './constants';
import type { Combo, ComboSessionSlot, FixedCombo, FlexCombo, TutorAvailabilitySlot } from './types';

interface ComboFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (combo: Combo) => void;
  initial: Combo | null;
  availability: TutorAvailabilitySlot[];
  // Các gói khác đã có (đã loại bỏ gói đang edit) — dùng để cảnh báo trùng giờ giữa các gói.
  existingCombos: Combo[];
}

export interface ExternalBusyInfo {
  comboName: string;
}

const newComboId = () => `combo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const defaultFixed = (): FixedCombo => ({
  id: newComboId(),
  type: 'fixed',
  name: '',
  sessions: [],
});

const defaultFlex = (): FlexCombo => ({
  id: newComboId(),
  type: 'flex',
  name: '',
  sessionsPerWeek: 2,
  sessionsPerMonth: 8,
  hoursPerSession: 1.5,
  description: '',
});

// Helper: encode (hour, minute) → "h:m" string cho Select option (Antd Select không
// nhận object value tốt). Decode khi onChange.
const encodeStart = (hour: number, minute: 0 | 30) => `${hour}:${minute}`;
const decodeStart = (raw: string): { hour: number; minute: 0 | 30 } => {
  const [h, m] = raw.split(':').map(Number);
  return { hour: h, minute: (m === 30 ? 30 : 0) as 0 | 30 };
};

const sessionsOverlap = (sessions: FixedCombo['sessions'], targetIndex?: number) =>
  sessions.some((session, index) =>
    sessions.some((other, otherIndex) => {
      if (index === otherIndex) return false;
      if (targetIndex != null && index !== targetIndex && otherIndex !== targetIndex) return false;
      if (session.dayOfWeek !== other.dayOfWeek) return false;
      const sStart = minutesOf(session.startHour, session.startMinute);
      const sEnd = sStart + session.durationHours * 60;
      const oStart = minutesOf(other.startHour, other.startMinute);
      const oEnd = oStart + other.durationHours * 60;
      return sStart < oEnd && oStart < sEnd;
    }),
  );

const ComboFormModal: React.FC<ComboFormModalProps> = ({
  open,
  onClose,
  onSave,
  initial,
  availability,
  existingCombos,
}) => {
  const [combo, setCombo] = useState<Combo>(() => initial ?? defaultFixed());

  // Map "dayOfWeek-hour-minute" (30-phút granularity) → gói khác đang chiếm khung này.
  const externalBusyCells = useMemo(() => {
    const map = new Map<string, ExternalBusyInfo>();
    existingCombos.forEach((other) => {
      if (other.type !== 'fixed') return;
      other.sessions.forEach((session) => {
        const startMin = minutesOf(session.startHour, session.startMinute);
        const endMin = startMin + session.durationHours * 60;
        for (let cur = startMin; cur < endMin; cur += 30) {
          const h = Math.floor(cur / 60);
          const m = cur % 60;
          map.set(`${session.dayOfWeek}-${h}-${m}`, { comboName: other.name || 'Gói khác' });
        }
      });
    });
    return map;
  }, [existingCombos]);

  // Trả về thông tin gói khác đang chặn session này (nếu có).
  const findExternalConflict = (session: ComboSessionSlot): ExternalBusyInfo | null => {
    const startMin = minutesOf(session.startHour, session.startMinute);
    const endMin = startMin + session.durationHours * 60;
    for (let cur = startMin; cur < endMin; cur += 30) {
      const h = Math.floor(cur / 60);
      const m = cur % 60;
      const hit = externalBusyCells.get(`${session.dayOfWeek}-${h}-${m}`);
      if (hit) return hit;
    }
    return null;
  };

  const fixedHasExternalConflict = useMemo(
    () => combo.type === 'fixed' && combo.sessions.some((session) => findExternalConflict(session) !== null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [combo, externalBusyCells],
  );

  const fixedHasOverlap = useMemo(() => combo.type === 'fixed' && sessionsOverlap(combo.sessions), [combo]);
  const fixedHasOutOfRange = useMemo(
    () =>
      combo.type === 'fixed' &&
      combo.sessions.some(
        (session) => minutesOf(session.startHour, session.startMinute) + session.durationHours * 60 > END_HOUR * 60,
      ),
    [combo],
  );
  const fixedHasOutsideAvailability = useMemo(
    () =>
      combo.type === 'fixed' && combo.sessions.some((session) => !isSessionWithinAvailability(session, availability)),
    [availability, combo],
  );
  const nextAvailableSession = useMemo(
    () => (combo.type === 'fixed' ? findFirstAvailableSession(availability, combo.sessions) : null),
    [availability, combo],
  );
  const flexHasNoAvailableSlot = useMemo(
    () => combo.type === 'flex' && !hasAvailabilityForDuration(combo.hoursPerSession, availability),
    [availability, combo],
  );
  const availableDayOptions = useMemo(
    () =>
      DAY_COLUMNS.filter((column) => getAvailableStartTimes(column.dayOfWeek, availability).length > 0).map(
        (column) => ({
          value: column.dayOfWeek,
          label: column.full,
        }),
      ),
    [availability],
  );

  const isValid = (() => {
    if (!combo.name.trim()) return false;
    if (combo.type === 'fixed') {
      return (
        combo.sessions.length > 0 &&
        combo.sessions.every((session) => session.durationHours > 0) &&
        !fixedHasOverlap &&
        !fixedHasOutOfRange &&
        !fixedHasOutsideAvailability &&
        !fixedHasExternalConflict
      );
    }
    return (
      combo.sessionsPerWeek > 0 &&
      combo.sessionsPerMonth > 0 &&
      combo.hoursPerSession > 0 &&
      !flexHasNoAvailableSlot &&
      combo.description.trim().length > 0
    );
  })();

  const handleTypeChange = (type: 'fixed' | 'flex') => {
    if (type === combo.type) return;
    const next = type === 'fixed' ? defaultFixed() : defaultFlex();
    setCombo({ ...next, name: combo.name });
  };

  const addSession = () => {
    if (combo.type !== 'fixed' || !nextAvailableSession) return;
    setCombo({
      ...combo,
      sessions: [...combo.sessions, nextAvailableSession],
    });
  };

  const normalizeSession = (session: ComboSessionSlot): ComboSessionSlot => {
    const startTimes = getAvailableStartTimes(session.dayOfWeek, availability);
    const matchesCurrent = startTimes.some(
      (st) => st.hour === session.startHour && st.minute === session.startMinute,
    );
    const start = matchesCurrent
      ? { hour: session.startHour, minute: session.startMinute }
      : (startTimes[0] ?? { hour: session.startHour, minute: session.startMinute });
    const durations = getAvailableDurations(session.dayOfWeek, start.hour, start.minute, availability);

    return {
      ...session,
      startHour: start.hour,
      startMinute: start.minute,
      durationHours: durations.includes(session.durationHours) ? session.durationHours : (durations[0] ?? session.durationHours),
    };
  };

  const updateSession = (index: number, patch: Partial<ComboSessionSlot>) => {
    if (combo.type !== 'fixed') return;
    setCombo({
      ...combo,
      sessions: combo.sessions.map((session, sessionIndex) => {
        if (sessionIndex !== index) return session;
        const next = { ...session, ...patch };
        // Clamp duration để không vượt END_HOUR.
        const startTotal = minutesOf(next.startHour, next.startMinute);
        const maxDurationHours = (END_HOUR * 60 - startTotal) / 60;
        return normalizeSession({
          ...next,
          durationHours: Math.min(next.durationHours, maxDurationHours),
        });
      }),
    });
  };
  const removeSession = (index: number) => {
    if (combo.type !== 'fixed') return;
    setCombo({ ...combo, sessions: combo.sessions.filter((_, sessionIndex) => sessionIndex !== index) });
  };

  return (
    <Modal
      className={styles.comboModal}
      open={open}
      onCancel={onClose}
      onOk={() => onSave(combo)}
      okText={initial ? 'Cập nhật gói' : 'Tạo gói'}
      cancelText="Hủy"
      okButtonProps={{ disabled: !isValid }}
      title={
        <div className={styles.comboModalTitle}>
          <span className={styles.comboModalEyebrow}>{initial ? 'Chỉnh sửa gói lịch học' : 'Gói lịch học mới'}</span>
          <strong>{initial ? 'Cập nhật gói lịch học' : 'Tạo gói lịch học'}</strong>
        </div>
      }
      width={920}
      destroyOnClose
    >
      <div className={styles.comboForm}>
        <div className={styles.comboTypeGrid}>
          <button
            type="button"
            className={`${styles.comboTypeOption} ${combo.type === 'fixed' ? styles.activeComboType : ''}`}
            onClick={() => handleTypeChange('fixed')}
            aria-pressed={combo.type === 'fixed'}
          >
            <span className={styles.comboTypeIcon}>
              <CalendarOutlined />
            </span>
            <span>
              <strong>Lịch cố định</strong>
              <small>Chọn chính xác thứ, giờ bắt đầu và thời lượng mỗi buổi.</small>
            </span>
          </button>
          <button
            type="button"
            className={`${styles.comboTypeOption} ${combo.type === 'flex' ? styles.activeComboType : ''}`}
            onClick={() => handleTypeChange('flex')}
            aria-pressed={combo.type === 'flex'}
          >
            <span className={styles.comboTypeIcon}>
              <SwapOutlined />
            </span>
            <span>
              <strong>Lịch linh hoạt</strong>
              <small>Đặt số buổi và để phụ huynh tự thống nhất khung giờ phù hợp.</small>
            </span>
          </button>
        </div>

        <div className={styles.comboBuilderLayout}>
          <div className={styles.comboBuilderMain}>
            <section className={styles.comboBuilderSection}>
              <div className={styles.comboBuilderSectionHead}>
                <div>
                  <span className={styles.comboBuilderStep}>01</span>
                  <h4>Thông tin gói</h4>
                </div>
              </div>
              <label className={styles.comboFormField}>
                <span className={styles.comboFormLabel}>Tên gói</span>
                <Input
                  value={combo.name}
                  onChange={(event) => setCombo({ ...combo, name: event.target.value } as Combo)}
                  placeholder="Ví dụ: Gói 8 buổi tối Thứ 2 và Thứ 4"
                  size="large"
                />
              </label>
              <div className={styles.comboFormHint}>
                Giá gói sẽ được tính theo môn và khối lớp mà phụ huynh chọn khi đặt lịch.
              </div>
              <label className={styles.comboFormField}>
                <span className={styles.comboFormLabel}>
                  Mô tả gói{' '}
                  {combo.type === 'fixed' && (
                    <em style={{ fontWeight: 400, color: '#8a8a8a' }}>(tuỳ chọn)</em>
                  )}
                </span>
                <Input.TextArea
                  rows={3}
                  value={combo.description ?? ''}
                  onChange={(event) => setCombo({ ...combo, description: event.target.value } as Combo)}
                  placeholder={
                    combo.type === 'fixed'
                      ? 'Ví dụ: 2 buổi cố định mỗi tuần, phù hợp duy trì nhịp học đều đặn.'
                      : 'Ví dụ: Phụ huynh tự chọn lịch theo số buổi mỗi tuần. Ưu tiên cuối tuần hoặc buổi tối...'
                  }
                />
              </label>
            </section>

            {combo.type === 'fixed' ? (
              <section className={styles.comboBuilderSection}>
                <div className={styles.comboBuilderSectionHead}>
                  <div>
                    <span className={styles.comboBuilderStep}>02</span>
                    <h4>Lịch học lặp lại hàng tuần</h4>
                  </div>
                  {combo.sessions.length > 0 && (
                    <span className={styles.comboSessionCount}>{combo.sessions.length} buổi</span>
                  )}
                </div>

                {combo.sessions.length === 0 ? (
                  <div className={styles.sessionEmptyState}>
                    <CalendarOutlined />
                    <strong>Chưa có buổi học nào</strong>
                    <span>Thêm buổi đầu tiên để bắt đầu tạo gói lịch học.</span>
                    <button
                      type="button"
                      className={styles.sessionAddBtn}
                      onClick={addSession}
                      disabled={!nextAvailableSession}
                    >
                      <PlusOutlined />
                      <span>Thêm buổi học</span>
                    </button>
                  </div>
                ) : (
                  <div className={styles.sessionList}>
                    {combo.sessions.map((session, index) => {
                      const internalConflict = sessionsOverlap(combo.sessions, index);
                      const externalConflict = findExternalConflict(session);
                      const hasConflict = internalConflict || externalConflict !== null;

                      return (
                        <div
                          key={index}
                          className={`${styles.sessionRow} ${hasConflict ? styles.sessionRowError : ''}`}
                        >
                          <span className={styles.sessionIndex}>{index + 1}</span>
                          <div className={styles.sessionControlGrid}>
                            <label>
                              <span>Ngày học</span>
                              <Select
                                value={session.dayOfWeek}
                                onChange={(value) => updateSession(index, { dayOfWeek: value })}
                                options={availableDayOptions}
                                style={{ width: '100%' }}
                              />
                            </label>
                            <label>
                              <span>Bắt đầu</span>
                              <Select
                                value={encodeStart(session.startHour, session.startMinute)}
                                onChange={(value) => {
                                  const { hour, minute } = decodeStart(value);
                                  updateSession(index, { startHour: hour, startMinute: minute });
                                }}
                                options={getAvailableStartTimes(session.dayOfWeek, availability).map(
                                  ({ hour, minute }) => ({
                                    value: encodeStart(hour, minute),
                                    label: formatHourMinute(hour, minute),
                                  }),
                                )}
                                style={{ width: '100%' }}
                              />
                            </label>
                            <label>
                              <span>Thời lượng</span>
                              <Select
                                value={session.durationHours}
                                onChange={(value) => updateSession(index, { durationHours: value })}
                                options={getAvailableDurations(
                                  session.dayOfWeek,
                                  session.startHour,
                                  session.startMinute,
                                  availability,
                                ).map((duration) => ({
                                  value: duration,
                                  label: duration < 1 ? `${duration * 60} phút` : `${duration} giờ`,
                                }))}
                                style={{ width: '100%' }}
                              />
                            </label>
                          </div>
                          <button
                            type="button"
                            className={styles.sessionRemoveBtn}
                            onClick={() => removeSession(index)}
                            aria-label={`Xóa buổi ${index + 1}`}
                            title="Xóa buổi học"
                          >
                            <DeleteOutlined />
                          </button>
                          {externalConflict && (
                            <div
                              style={{
                                gridColumn: '2 / 3',
                                fontSize: 11.5,
                                fontWeight: 600,
                                color: '#631b1b',
                                lineHeight: 1.4,
                              }}
                            >
                              Trùng giờ với gói "{externalConflict.comboName}". Hãy chọn khung giờ khác.
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      className={styles.sessionAddBtn}
                      onClick={addSession}
                      disabled={!nextAvailableSession}
                    >
                      <PlusOutlined />
                      <span>Thêm buổi học</span>
                    </button>
                  </div>
                )}

                {!nextAvailableSession && (
                  <div className={styles.comboAvailabilityHint}>
                    Không còn khung giờ rảnh phù hợp để thêm buổi học mới.
                  </div>
                )}

                {(fixedHasOverlap || fixedHasOutOfRange || fixedHasOutsideAvailability) && (
                  <div className={styles.comboValidationWarn}>
                    <ClockCircleOutlined />
                    <span>
                      Các buổi học đang bị trùng nhau, vượt quá khung giờ cho phép hoặc nằm ngoài lịch rảnh đã thiết
                      lập. Hãy điều chỉnh trước khi lưu gói.
                    </span>
                  </div>
                )}

                {fixedHasExternalConflict && (
                  <div className={styles.comboValidationWarn}>
                    <ClockCircleOutlined />
                    <span>
                      Một số buổi học đang trùng giờ với gói khác bạn đã tạo trước đó. Hãy đổi khung giờ để tránh
                      đặt 2 lớp cùng lúc.
                    </span>
                  </div>
                )}
              </section>
            ) : (
              <section className={styles.comboBuilderSection}>
                <div className={styles.comboBuilderSectionHead}>
                  <div>
                    <span className={styles.comboBuilderStep}>02</span>
                    <h4>Thiết lập nhịp độ học</h4>
                    <p>Đặt số buổi và thời lượng để phụ huynh chủ động sắp xếp lịch.</p>
                  </div>
                </div>
                <div className={styles.comboFormRow}>
                  <label className={styles.comboFormField}>
                    <span className={styles.comboFormLabel}>Số buổi / tuần</span>
                    <InputNumber
                      value={combo.sessionsPerWeek}
                      min={1}
                      max={7}
                      onChange={(value) =>
                        setCombo({
                          ...combo,
                          sessionsPerWeek: (value as number) ?? 1,
                        } as Combo)
                      }
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </label>
                  <label className={styles.comboFormField}>
                    <span className={styles.comboFormLabel}>Số giờ / buổi</span>
                    <InputNumber
                      value={combo.hoursPerSession}
                      min={0.5}
                      max={8}
                      step={0.5}
                      onChange={(value) =>
                        setCombo({
                          ...combo,
                          hoursPerSession: (value as number) ?? 1,
                        } as Combo)
                      }
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </label>
                  <label className={styles.comboFormField}>
                    <span className={styles.comboFormLabel}>Số buổi / tháng</span>
                    <InputNumber
                      value={combo.sessionsPerMonth}
                      min={1}
                      max={31}
                      onChange={(value) =>
                        setCombo({
                          ...combo,
                          sessionsPerMonth: (value as number) ?? 1,
                        } as Combo)
                      }
                      style={{ width: '100%' }}
                      size="large"
                    />
                    <span className={styles.comboFormHint}>
                      Tổng số buổi tối đa/tháng. Phụ huynh chọn lịch theo tuần, hệ thống lặp đến đủ số buổi này rồi dừng.
                    </span>
                  </label>
                </div>
                {flexHasNoAvailableSlot && (
                  <div className={styles.comboValidationWarn}>
                    <ClockCircleOutlined />
                    <span>Không có khung giờ rảnh nào đủ dài cho thời lượng mỗi buổi đã chọn.</span>
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className={styles.comboPreviewPanel}>
            <ComboPreview combo={combo} availability={availability} externalBusyCells={externalBusyCells} />
          </aside>
        </div>
      </div>
    </Modal>
  );
};

export default ComboFormModal;
