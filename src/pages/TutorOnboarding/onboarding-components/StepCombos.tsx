import React from 'react';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import styles from '../styles.module.css';
import ComboManager from './ComboManager';
import type { UseOnboardingState } from './hooks/useOnboardingState';

interface StepCombosProps {
  onboarding: UseOnboardingState;
}

const StepCombos: React.FC<StepCombosProps> = ({ onboarding }) => {
  const { state, addCombo, updateCombo, removeCombo } = onboarding;

  return (
    <div className={styles.comboStep}>
      <div className={styles.comboIntro}>
        <div className={styles.comboIntroMain}>
          <span className={styles.comboEyebrow}>Bước tùy chọn</span>
          <h2 className={styles.stepHeading}>Tạo combo học dễ đặt lịch hơn</h2>
          <p className={styles.comboIntroText}>
            Tạo khung lịch để phụ huynh đặt nhanh. Giá được tính theo cấu hình môn ở bước 1.
          </p>
        </div>
        <div className={styles.comboIntroBadge}>
          <CheckCircleOutlined />
          <span>
            {state.subjectRecords.length} cấu hình môn · {state.availability.length} giờ rảnh
          </span>
        </div>
      </div>

      <div className={styles.comboRuleNotice}>
        <span className={styles.comboRuleNoticeIcon}>
          <WarningOutlined />
        </span>
        <p>
          <strong>1 booking = 1 tháng.</strong> Hệ thống tự động tạo lịch học theo combo trong tháng đó.
        </p>
      </div>

      <ComboManager
        combos={state.combos}
        availability={state.availability}
        onAdd={addCombo}
        onUpdate={updateCombo}
        onRemove={removeCombo}
      />
    </div>
  );
};

export default StepCombos;
