import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import {
    useOnboardingState,
    OnboardingStepper,
    StepSubjects,
    StepSubjectPricing,
    StepAvailability,
    StepCombos,
    OnboardingSummary,
    type OnboardingStep,
} from './onboarding-components';

const TutorOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const onboarding = useOnboardingState();
    const { state, canProceedStep1, canProceedStep2, canProceedStep3, canFinish, goNext, goBack, goToStep } = onboarding;
    const [finished, setFinished] = useState(false);

    const isStepEnabled = (step: OnboardingStep) => {
        if (step === 1) return true;
        if (step === 2) return canProceedStep1;
        if (step === 3) return canProceedStep1 && canProceedStep2;
        return canProceedStep1 && canProceedStep2 && canProceedStep3; // step 4
    };

    const canProceedCurrent = (() => {
        switch (state.currentStep) {
            case 1:
                return canProceedStep1;
            case 2:
                return canProceedStep2;
            case 3:
                return canProceedStep3;
            case 4:
                return canFinish;
        }
    })();

    const blockingReason = (() => {
        if (canProceedCurrent) return null;
        switch (state.currentStep) {
            case 1:
                return 'Chọn ít nhất 1 môn học để tiếp tục.';
            case 2: {
                const noPrice = state.subjects.filter((s) => s.hourlyRate == null || s.hourlyRate <= 0).map((s) => s.subjectName);
                return noPrice.length ? `Cần đặt giá/giờ cho: ${noPrice.join(', ')}.` : null;
            }
            case 3:
                return 'Cần đánh dấu ít nhất 1 khung giờ rảnh.';
            case 4:
                return null;
        }
    })();

    const handleNext = () => {
        if (state.currentStep < 4) {
            goNext();
            return;
        }
        // eslint-disable-next-line no-console
        console.log('[Onboarding] Tutor setup payload (demo):', {
            subjects: state.subjects,
            availability: state.availability,
            combos: state.combos,
        });
        toast.success('Đã lưu thiết lập (demo). Sẽ đồng bộ với hệ thống khi backend sẵn sàng.');
        setFinished(true);
    };

    if (finished) {
        return (
            <OnboardingSummary
                subjects={state.subjects}
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
                <h1 className={styles.headerTitle}>Thiết lập lịch dạy & combo</h1>
                <p className={styles.headerSubtitle}>
                    Chọn môn → đặt giá/giờ → đánh dấu lịch rảnh → tạo combo học. Cuối cùng phụ huynh đặt lịch theo combo
                    hoặc theo giờ lẻ.
                </p>
                <OnboardingStepper currentStep={state.currentStep} onStepClick={goToStep} isStepEnabled={isStepEnabled} />
            </div>

            <div className={styles.body}>
                {state.currentStep === 1 && <StepSubjects onboarding={onboarding} />}
                {state.currentStep === 2 && <StepSubjectPricing onboarding={onboarding} />}
                {state.currentStep === 3 && <StepAvailability onboarding={onboarding} />}
                {state.currentStep === 4 && <StepCombos onboarding={onboarding} />}
            </div>

            <div className={styles.footer}>
                <div className={styles.footerInfo}>
                    {blockingReason ? (
                        <span className={styles.footerWarn}>{blockingReason}</span>
                    ) : (
                        `Bước ${state.currentStep} / 4`
                    )}
                </div>
                <div className={styles.footerBtns}>
                    {state.currentStep > 1 && (
                        <button type="button" className={styles.btnGhost} onClick={goBack}>
                            Quay lại
                        </button>
                    )}
                    <button type="button" className={styles.btnPrimary} onClick={handleNext} disabled={!canProceedCurrent}>
                        {state.currentStep === 4 ? 'Hoàn tất' : 'Tiếp tục'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorOnboarding;
