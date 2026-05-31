import React, { useMemo, useState } from 'react';
import { Select, Button, Popconfirm } from 'antd';
import { BookOutlined, BulbOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import styles from '../styles.module.css';
import { SUBJECTS, GRADE_LEVELS, formatPrice } from './constants';
import type { UseOnboardingState } from './hooks/useOnboardingState';
import PriceInput from './PriceInput';

interface StepSubjectRecordsProps {
  onboarding: UseOnboardingState;
}

const StepSubjectRecords: React.FC<StepSubjectRecordsProps> = ({ onboarding }) => {
  const { state, addSubjectRecord, removeSubjectRecord } = onboarding;

  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number | null>(200000);

  const subjectName = useMemo(
    () => (subjectId == null ? '' : (SUBJECTS.find((s) => s.id === subjectId)?.name ?? '')),
    [subjectId],
  );
  const gradeName = useMemo(
    () => (gradeLevel == null ? '' : (GRADE_LEVELS.find((g) => g.value === gradeLevel)?.label ?? '')),
    [gradeLevel],
  );

  const canAdd = subjectId != null && gradeLevel != null && hourlyRate != null && hourlyRate > 0;

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
    // reset form
    setSubjectId(null);
    setGradeLevel(null);
    setHourlyRate(200000);
    toast.success('Đã thêm 1 record');
  };

  return (
    <div className={styles.subjectRecordsStep}>
      <section className={styles.subjectRecordsIntro}>
        <div className={styles.subjectRecordsIntroMain}>
          <span className={styles.subjectRecordsEyebrow}>Bước bắt buộc</span>
          <h2 className={styles.stepHeading}>Môn học & giá theo khối lớp</h2>
          <p className={styles.subjectRecordsIntroText}>Thêm từng môn và khối lớp để thiết lập mức giá/giờ phù hợp.</p>
        </div>
        <div className={styles.subjectRecordsRule}>
          <span className={styles.subjectRecordsRuleIcon}>
            <BookOutlined />
          </span>
          <strong>1 dòng = 1 mức giá</strong>
        </div>
      </section>

      <div className={styles.subjectRecordsExample}>
        <BulbOutlined />
        <span>
          <strong>Ví dụ:</strong> Toán Lớp 10 — 200.000đ/giờ, Toán Lớp 11 — 250.000đ/giờ.
        </span>
      </div>

      {/* Form thêm record */}
      <div className={styles.recordForm}>
        <div className={styles.recordFormHead}>
          <div>
            <h3 className={styles.recordFormTitle}>Thêm cấu hình giảng dạy</h3>
            <p className={styles.recordFormSubtitle}>
              Chọn môn và khối lớp trước, sau đó đặt mức giá phù hợp cho một giờ học.
            </p>
          </div>
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
            <div>
              <span className={styles.recordFieldLabel}>3. Giá cho mỗi giờ học</span>
              <p className={styles.recordPricingHint}>
                Kéo thanh trượt hoặc chọn nhanh một mức giá phổ biến. Bạn vẫn có thể nhập số chính xác.
              </p>
            </div>
            <span className={styles.recordPricingUnit}>VND / giờ</span>
          </div>
          <PriceInput
            value={hourlyRate}
            onChange={setHourlyRate}
            min={50000}
            max={2000000}
            step={10000}
            presets={[100000, 150000, 200000, 300000, 500000]}
          />
        </div>

        <div className={styles.recordFormActions}>
          <div className={styles.recordDraft}>
            <span className={styles.recordDraftLabel}>Cấu hình sắp thêm</span>
            <strong>
              {subjectName || 'Chưa chọn môn'} · {gradeName || 'Chưa chọn khối'} · {formatPrice(hourlyRate ?? 0)}đ/giờ
            </strong>
          </div>
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

      {/* List records */}
      {state.subjectRecords.length === 0 ? (
        <div className={styles.empty}>Chưa có record nào — thêm dòng đầu tiên ở trên.</div>
      ) : (
        <div className={styles.recordsSection}>
          <div className={styles.recordsSectionHead}>
            <div>
              <h3 className={styles.recordsSectionTitle}>Cấu hình đã thêm</h3>
              <p className={styles.recordsSectionSubtitle}>
                Mỗi cấu hình sẽ được dùng để tính giá khi phụ huynh đặt lịch.
              </p>
            </div>
            <span className={styles.recordsCount}>{state.subjectRecords.length} cấu hình</span>
          </div>
          <div className={styles.recordsTable}>
            <div className={`${styles.recordsRow} ${styles.recordsHead}`}>
              <span>Môn</span>
              <span>Khối lớp</span>
              <span>Giá / giờ</span>
              <span />
            </div>
            {state.subjectRecords.map((r) => (
              <div key={r.id} className={styles.recordsRow}>
                <span className={styles.recordSubject}>{r.subjectName}</span>
                <span className={styles.recordGrade}>
                  {GRADE_LEVELS.find((g) => g.value === r.gradeLevel)?.label ?? r.gradeLevel}
                </span>
                <span className={styles.recordRate}>{formatPrice(r.hourlyRate)}đ</span>
                <span className={styles.recordAction}>
                  <Popconfirm
                    title="Xoá record này?"
                    onConfirm={() => removeSubjectRecord(r.id)}
                    okText="Xoá"
                    cancelText="Huỷ"
                    okButtonProps={{ danger: true }}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepSubjectRecords;
