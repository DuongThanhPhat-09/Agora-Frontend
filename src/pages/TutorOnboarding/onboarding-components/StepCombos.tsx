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
          <p className={styles.comboIntroText}>
            Sau khi thiết lập lịch rảnh, bạn đã có thể nhận booking từ phụ huynh. Gói lịch học chỉ là lựa chọn
            được tạo sẵn từ lịch rảnh để phụ huynh dễ chọn hơn.
          </p>
        </div>
        <span className={styles.comboIntroBadge}>
          <InfoCircleOutlined />
          Có thể bỏ qua
        </span>
      </div>

      <div className={styles.comboRuleNotice}>
        <span className={styles.comboRuleNoticeIcon}>
          <InfoCircleOutlined />
        </span>
        <p>
          <strong>Nếu phụ huynh chọn gói lịch học:</strong> 1 booking = 1 tháng và hệ thống tự động tạo lịch học
          theo gói trong tháng đó. Nếu không tạo gói, phụ huynh vẫn đặt lịch theo các khung rảnh của bạn.
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
