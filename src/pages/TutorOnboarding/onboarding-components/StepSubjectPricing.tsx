import React from 'react';
import styles from '../styles.module.css';
import PriceInput from './PriceInput';
import { formatPrice } from './constants';
import type { UseOnboardingState } from './hooks/useOnboardingState';

interface StepSubjectPricingProps {
    onboarding: UseOnboardingState;
}

const StepSubjectPricing: React.FC<StepSubjectPricingProps> = ({ onboarding }) => {
    const { state, setSubjectHourlyRate } = onboarding;

    if (!state.subjects.length) {
        return <div className={styles.empty}>Hãy quay lại bước 1 và chọn ít nhất một môn học.</div>;
    }

    return (
        <div>
            <h2 className={styles.stepHeading}>Đặt giá theo môn</h2>
            <p className={styles.stepHint}>
                Đặt giá/giờ nền cho từng môn. Combo cố định và linh hoạt ở bước 4 sẽ tham chiếu giá này khi gợi ý.
            </p>

            <div className={styles.subjectPriceList}>
                {state.subjects.map((s) => (
                    <div key={s.subjectId} className={styles.subjectPriceCard}>
                        <div className={styles.subjectPriceHead}>
                            <h3 className={styles.subjectPriceName}>{s.subjectName}</h3>
                            {s.hourlyRate && s.hourlyRate > 0 ? (
                                <span className={styles.subjectPriceBadge}>
                                    {formatPrice(s.hourlyRate)}đ / giờ
                                </span>
                            ) : (
                                <span className={`${styles.subjectPriceBadge} ${styles.priceBadgeWarn}`}>
                                    Chưa đặt giá
                                </span>
                            )}
                        </div>

                        <PriceInput
                            value={s.hourlyRate}
                            onChange={(v) => setSubjectHourlyRate(s.subjectId, v)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepSubjectPricing;
