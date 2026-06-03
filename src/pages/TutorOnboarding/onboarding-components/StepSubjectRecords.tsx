import React, { useMemo, useState } from 'react';
import { Select, Button, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from '../styles.module.css';
import { SUBJECTS, GRADE_LEVELS, formatPrice } from './constants';
import type { UseOnboardingState } from './hooks/useOnboardingState';
import PriceInput from './PriceInput';

interface StepSubjectRecordsProps {
  onboarding: UseOnboardingState;
}

// Ngưỡng cảnh báo giá: tutor thường không cao quá 1tr/giờ. > 2tr coi như nhập nhầm.
const PRICE_WARN_HIGH = 2_000_000;

const StepSubjectRecords: React.FC<StepSubjectRecordsProps> = ({ onboarding }) => {
  const { state, addSubjectRecord, removeSubjectRecord } = onboarding;

  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number | null>(200000);

  const subjectName = useMemo(
    () => (subjectId == null ? '' : (SUBJECTS.find((s) => s.id === subjectId)?.name ?? '')),
    [subjectId],
  );

  const canAdd = subjectId != null && gradeLevel != null && hourlyRate != null && hourlyRate > 0;
  const isPriceTooHigh = hourlyRate != null && hourlyRate > PRICE_WARN_HIGH;

  const handleAdd = () => {
    if (!canAdd) return;
    const ok = addSubjectRecord({
      subjectId: subjectId as number,
      subjectName,
      gradeLevel: gradeLevel as string,
      hourlyRate: hourlyRate as number,
    });
    if (!ok) {
      toast.warning('Đã có record cho cặp môn-khối này. Hãy xoá rồi thêm lại nếu muốn đổi giá.');
      return;
    }
    setSubjectId(null);
    setGradeLevel(null);
    setHourlyRate(200000);
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
                    Mức giá <strong>{formatPrice(hourlyRate ?? 0)}đ/giờ</strong> khá cao so với mặt bằng chung. Hãy
                    kiểm tra lại trước khi lưu.
                  </span>
                </div>
              )}
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
              {state.subjectRecords.map((r) => (
                <li key={r.id} className={styles.recordsAsideItem}>
                  <div className={styles.recordsAsideItemMain}>
                    <strong>{r.subjectName}</strong>
                    <span>{GRADE_LEVELS.find((g) => g.value === r.gradeLevel)?.label ?? r.gradeLevel}</span>
                  </div>
                  <div className={styles.recordsAsideItemPrice}>{formatPrice(r.hourlyRate)}đ</div>
                  <Popconfirm
                    title="Xoá cấu hình này?"
                    onConfirm={() => removeSubjectRecord(r.id)}
                    okText="Xoá"
                    cancelText="Huỷ"
                    okButtonProps={{ danger: true }}
                  >
                    <Button size="small" danger type="text" icon={<DeleteOutlined />} />
                  </Popconfirm>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
};

export default StepSubjectRecords;
