import React from 'react';
import styles from '../styles.module.css';
import type { OnboardingSubject } from './types';

interface SubjectTabsProps {
    subjects: OnboardingSubject[];
    activeSubjectId: number | null;
    onChange: (subjectId: number) => void;
    // Optional badge per subject (e.g. số khung giờ / số slot đã có giá).
    renderBadge?: (subject: OnboardingSubject) => { text: string; warn?: boolean } | null;
}

const SubjectTabs: React.FC<SubjectTabsProps> = ({ subjects, activeSubjectId, onChange, renderBadge }) => {
    return (
        <div className={styles.subjectTabs} role="tablist">
            {subjects.map((subject) => {
                const isActive = subject.subjectId === activeSubjectId;
                const badge = renderBadge?.(subject) ?? null;
                return (
                    <button
                        key={subject.subjectId}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`${styles.subjectTab} ${isActive ? styles.activeTab : ''}`}
                        onClick={() => onChange(subject.subjectId)}
                    >
                        <span>{subject.subjectName}</span>
                        {badge && (
                            <span className={`${styles.subjectTabBadge} ${badge.warn ? styles.warn : ''}`}>
                                {badge.text}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default SubjectTabs;
