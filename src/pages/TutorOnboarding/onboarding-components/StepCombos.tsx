import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
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
          <span className={styles.comboEyebrow}>Bước gợi ý, không bắt buộc</span>
          <h2 className={styles.stepHeading}>Tạo gói lịch học để phụ huynh chọn nhanh hơn</h2>
        </div>
      </div>

      <div className={styles.comboRuleNotice}>
        <span className={styles.comboRuleNoticeIcon}>
          <InfoCircleOutlined />
        </span>
        <p>
          <strong>1 gói = 1 booking tháng</strong>, hệ thống tự tạo lịch theo gói. Phụ huynh vẫn đặt được theo lịch
          rảnh.
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
