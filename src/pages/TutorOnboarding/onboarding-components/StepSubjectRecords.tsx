import React, { useMemo, useState } from 'react';
import { Select, Button, Popconfirm, InputNumber } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from '../styles.module.css';
import { SUBJECTS, GRADE_LEVELS, formatPrice, formatDuration } from './constants';
import type { UseOnboardingState } from './hooks/useOnboardingState';
import type { SubjectRecord } from './types';
import PriceInput from './PriceInput';

interface StepSubjectRecordsProps {
  onboarding: UseOnboardingState;
}

// Ngưỡng cảnh báo giá: tutor thường không cao quá 1tr/giờ. > 2tr coi như nhập nhầm.
const PRICE_WARN_HIGH = 2_000_000;

// Số giờ/buổi gia sư có thể chọn cho môn.
const DURATION_OPTIONS = [1, 1.5, 2, 2.5, 3];
// Số buổi/tuần đề xuất cho cấu hình.
const SESSIONS_PER_WEEK_OPTIONS = [1, 2, 3, 4, 5];

const StepSubjectRecords: React.FC<StepSubjectRecordsProps> = ({ onboarding }) => {
  const { state, addSubjectRecord, removeSubjectRecord, updateSubjectRecord } = onboarding;

  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number | null>(200000);
  const [hoursPerSession, setHoursPerSession] = useState(1.5);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(2);

  // Sửa giá inline cho record đã thêm (thay vì phải xoá rồi thêm lại).
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRate, setEditingRate] = useState<number | null>(null);

  const startEditRate = (record: SubjectRecord) => {
    setEditingId(record.id);
    setEditingRate(record.hourlyRate);
  };
  const cancelEditRate = () => {
    setEditingId(null);
    setEditingRate(null);
  };
  const saveEditRate = () => {
    if (editingId && editingRate != null && editingRate > 0) {
      updateSubjectRecord(editingId, { hourlyRate: editingRate });
      toast.success('Đã cập nhật giá');
    }
    cancelEditRate();
  };

  const subjectName = useMemo(
    () => (subjectId == null ? '' : (SUBJECTS.find((s) => s.id === subjectId)?.name ?? '')),
    [subjectId],
  );

  const canAdd =
    subjectId != null &&
    gradeLevel != null &&
    hourlyRate != null &&
    hourlyRate > 0 &&
    hoursPerSession > 0 &&
    sessionsPerWeek > 0;
  const isPriceTooHigh = hourlyRate != null && hourlyRate > PRICE_WARN_HIGH;

  const handleAdd = () => {
    if (!canAdd) return;
    const ok = addSubjectRecord({
      subjectId: subjectId as number,
      subjectName,
      gradeLevel: gradeLevel as string,
      hourlyRate: hourlyRate as number,
      hoursPerSession,
      sessionsPerWeek,
    });
    if (!ok) {
      toast.warning('Đã có record cho cặp môn-khối này. Hãy xoá rồi thêm lại nếu muốn đổi giá.');
      return;
    }
    setSubjectId(null);
    setGradeLevel(null);
    setHourlyRate(200000);
    setHoursPerSession(1.5);
    setSessionsPerWeek(2);
    toast.success('Đã thêm 1 cấu hình');
  };

  return (
    <div className={styles.subjectRecordsStep}>
      <section className={styles.subjectRecordsIntro}>
        <div className={styles.subjectRecordsIntroMain}>
          <span className={styles.subjectRecordsEyebrow}>Bước bắt buộc</span>
          <h2 className={styles.stepHeading}>Môn học & giá theo khối lớp</h2>
        </div>
      </section>

      {/* 2-column layout: form bên trái, list cấu hình đã thêm bên phải */}
      <div className={styles.recordsLayout}>
        <div className={styles.recordsMain}>
          <div className={styles.recordForm}>
            <div className={styles.recordFormHead}>
              <h3 className={styles.recordFormTitle}>Thêm cấu hình giảng dạy</h3>
              <span className={styles.recordFormStep}>Cấu hình mới</span>
            </div>

            <div className={styles.recordSelectGrid}>
              <label className={styles.recordField}>
                <span className={styles.recordFieldLabel}>1. Môn học</span>
                <Select
                  placeholder="Chọn môn bạn giảng dạy"
                  value={subjectId}
                  onChange={(v) => setSubjectId(v)}
                  options={SUBJECTS.map((s) => ({ value: s.id, label: s.name }))}
                  style={{ width: '100%' }}
                />
              </label>
              <label className={styles.recordField}>
                <span className={styles.recordFieldLabel}>2. Khối lớp</span>
                <Select
                  placeholder="Chọn khối lớp"
                  value={gradeLevel}
                  onChange={(v) => setGradeLevel(v)}
                  options={GRADE_LEVELS.map((g) => ({ value: g.value, label: g.label }))}
                  style={{ width: '100%' }}
                />
              </label>
            </div>

            <div className={styles.recordPricingSection}>
              <div className={styles.recordPricingHead}>
                <span className={styles.recordFieldLabel}>3. Giá cho mỗi giờ học</span>
              </div>
              <PriceInput
                value={hourlyRate}
                onChange={setHourlyRate}
                presets={[100_000, 150_000, 200_000, 250_000, 300_000, 400_000, 500_000]}
              />
              {isPriceTooHigh && (
                <div className={styles.recordPriceWarn}>
                  <WarningOutlined />
                  <span>
                    Mức giá <strong>{formatPrice(hourlyRate ?? 0)}đ/giờ</strong> khá cao so với mặt bằng chung. Hãy kiểm
                    tra lại trước khi lưu.
                  </span>
                </div>
              )}
            </div>

            <div className={styles.recordPricingSection}>
              <div className={styles.recordPricingHead}>
                <span className={styles.recordFieldLabel}>4. Thời gian mỗi buổi học</span>
              </div>
              <div className={styles.pricePresetRow}>
                <span className={styles.priceInputLabel}>Chọn nhanh:</span>
                <div className={styles.pricePresetList}>
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`${styles.pricePresetBtn} ${hoursPerSession === d ? styles.activePricePreset : ''}`}
                      onClick={() => setHoursPerSession(d)}
                    >
                      {formatDuration(d)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.recordPricingSection}>
              <div className={styles.recordPricingHead}>
                <span className={styles.recordFieldLabel}>5. Số buổi mỗi tuần</span>
              </div>
              <div className={styles.pricePresetRow}>
                <span className={styles.priceInputLabel}>Chọn nhanh:</span>
                <div className={styles.pricePresetList}>
                  {SESSIONS_PER_WEEK_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.pricePresetBtn} ${sessionsPerWeek === n ? styles.activePricePreset : ''}`}
                      onClick={() => setSessionsPerWeek(n)}
                    >
                      {n} buổi
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.recordFormActions} style={{ justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                disabled={!canAdd}
                className={styles.recordAddBtn}
              >
                Thêm cấu hình
              </Button>
            </div>
          </div>
        </div>

        <aside className={styles.recordsAside}>
          <div className={styles.recordsAsideHead}>
            <h3 className={styles.recordsSectionTitle}>Cấu hình đã thêm</h3>
            <span className={styles.recordsCount}>{state.subjectRecords.length}</span>
          </div>

          {state.subjectRecords.length === 0 ? (
            <div className={styles.recordsAsideEmpty}>Chưa có cấu hình nào.</div>
          ) : (
            <ul className={styles.recordsAsideList}>
              {state.subjectRecords.map((r) => {
                const isEditing = editingId === r.id;
                return (
                  <li key={r.id} className={styles.recordsAsideItem}>
                    <div className={styles.recordsAsideItemMain}>
                      <strong>{r.subjectName}</strong>
                      <span>
                        {GRADE_LEVELS.find((g) => g.value === r.gradeLevel)?.label ?? r.gradeLevel} ·{' '}
                        {formatDuration(r.hoursPerSession)}/buổi · {r.sessionsPerWeek} buổi/tuần
                      </span>
                    </div>
                    {isEditing ? (
                      <div className={styles.recordsAsideEdit}>
                        <InputNumber<number>
                          size="small"
                          min={1000}
                          step={10000}
                          value={editingRate ?? undefined}
                          onChange={(v) => setEditingRate(v ?? null)}
                          formatter={(v) => (v ? formatPrice(Number(v)) : '')}
                          parser={(v) => (v ? Number(v.replace(/\D/g, '')) : 0)}
                          onPressEnter={saveEditRate}
                          autoFocus
                          style={{ width: 116 }}
                        />
                        <Button
                          size="small"
                          type="text"
                          icon={<CheckOutlined />}
                          onClick={saveEditRate}
                          aria-label="Lưu giá"
                          title="Lưu giá"
                        />
                        <Button
                          size="small"
                          type="text"
                          icon={<CloseOutlined />}
                          onClick={cancelEditRate}
                          aria-label="Huỷ sửa giá"
                          title="Huỷ"
                        />
                      </div>
                    ) : (
                      <>
                        <div className={styles.recordsAsideItemPrice}>{formatPrice(r.hourlyRate)}đ</div>
                        <div className={styles.recordsAsideItemActions}>
                          <Button
                            size="small"
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => startEditRate(r)}
                            aria-label={`Sửa giá ${r.subjectName}`}
                            title="Sửa giá"
                          />
                          <Popconfirm
                            title="Xoá cấu hình này?"
                            onConfirm={() => removeSubjectRecord(r.id)}
                            okText="Xoá"
                            cancelText="Huỷ"
                            okButtonProps={{ danger: true }}
                          >
                            <Button
                              size="small"
                              danger
                              type="text"
                              icon={<DeleteOutlined />}
                              aria-label={`Xoá ${r.subjectName}`}
                            />
                          </Popconfirm>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
};

export default StepSubjectRecords;
