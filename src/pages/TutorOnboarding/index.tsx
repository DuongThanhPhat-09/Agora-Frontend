import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import {
  useOnboardingState,
  OnboardingStepper,
  StepSubjectRecords,
  StepAvailability,
  StepCombos,
  OnboardingSummary,
  type OnboardingStep,
} from './onboarding-components';

const TutorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const onboarding = useOnboardingState();
  const { state, canProceedStep1, canProceedStep2, combosMatchAvailability, canFinish, goNext, goBack, goToStep } =
    onboarding;
  const [finished, setFinished] = useState(false);

  const isStepEnabled = (step: OnboardingStep) => {
    if (step === 1) return true;
    if (step === 2) return canProceedStep1;
    return canProceedStep1 && canProceedStep2; // step 3
  };

  const canProceedCurrent =
    state.currentStep === 1 ? canProceedStep1 : state.currentStep === 2 ? canProceedStep2 : canFinish;

  const blockingReason = (() => {
    if (canProceedCurrent) return null;
    if (state.currentStep === 1) {
      return 'Cần thêm ít nhất 1 record (môn × khối × giá) để tiếp tục.';
    }
    if (state.currentStep === 2) {
      return 'Cần thêm ít nhất 1 khung giờ rảnh để tiếp tục.';
    }
    if (!combosMatchAvailability) {
      return 'Có gói lịch học cố định không còn nằm trong lịch rảnh. Hãy cập nhật gói trước khi hoàn tất.';
    }
    return null;
  })();

  const footerStatusText =
    state.currentStep === 3 && !blockingReason && state.combos.length === 0
      ? 'Bạn có thể hoàn tất ngay; gói lịch học chỉ là lựa chọn gợi ý cho phụ huynh.'
      : `Bước ${state.currentStep} / 3`;

  const handleNext = () => {
    if (state.currentStep < 3) {
      goNext();
      return;
    }
    // eslint-disable-next-line no-console
    console.log('[Onboarding] Final state (demo):', {
      subjectRecords: state.subjectRecords,
      availability: state.availability,
      combos: state.combos,
    });
    toast.success('Đã hoàn tất thiết lập (demo)!');
    setFinished(true);
  };

  if (finished) {
    return (
      <OnboardingSummary
        subjectRecords={state.subjectRecords}
        availability={state.availability}
        combos={state.combos}
        onBack={() => setFinished(false)}
        onFinish={() => navigate('/tutor-portal/dashboard')}
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Thiết lập môn học, lịch rảnh & gói lịch học</h1>
        <p className={styles.headerSubtitle}>
          Bước 1: cấu hình môn và giá. Bước 2: thiết lập lịch rảnh để nhận booking. Bước 3: tạo gói lịch học gợi ý,
          không bắt buộc.
        </p>
        <OnboardingStepper currentStep={state.currentStep} onStepClick={goToStep} isStepEnabled={isStepEnabled} />
      </div>

      <div className={styles.body}>
        {state.currentStep === 1 && <StepSubjectRecords onboarding={onboarding} />}
        {state.currentStep === 2 && <StepAvailability onboarding={onboarding} />}
        {state.currentStep === 3 && <StepCombos onboarding={onboarding} />}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          {blockingReason ? <span className={styles.footerWarn}>{blockingReason}</span> : footerStatusText}
        </div>
        <div className={styles.footerBtns}>
          {state.currentStep > 1 && (
            <button type="button" className={styles.btnGhost} onClick={goBack}>
              Quay lại
            </button>
          )}
          <button type="button" className={styles.btnPrimary} onClick={handleNext} disabled={!canProceedCurrent}>
            {state.currentStep === 3 ? 'Hoàn tất' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorOnboarding;
