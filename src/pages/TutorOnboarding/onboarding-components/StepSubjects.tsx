import React from 'react';
import styles from '../styles.module.css';
import { SUBJECTS } from './constants';
import type { UseOnboardingState } from './hooks/useOnboardingState';

interface StepSubjectsProps {
    onboarding: UseOnboardingState;
}

const StepSubjects: React.FC<StepSubjectsProps> = ({ onboarding }) => {
    const { state, toggleSubject } = onboarding;
    const selectedIds = new Set(state.subjects.map((s) => s.subjectId));

    return (
        <div>
            <h2 className={styles.stepHeading}>Chọn môn học</h2>

            <div className={styles.subjectChips}>
                {SUBJECTS.map((subject) => {
                    const selected = selectedIds.has(subject.id);
                    return (
                        <button
                            key={subject.id}
                            type="button"
                            className={`${styles.subjectChip} ${selected ? styles.chipSelected : ''}`}
                            onClick={() => toggleSubject(subject.id, subject.name)}
                        >
                            {subject.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StepSubjects;
