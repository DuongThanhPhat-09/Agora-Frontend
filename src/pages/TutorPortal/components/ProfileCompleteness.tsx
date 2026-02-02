import React, { useMemo } from 'react';
import styles from './ProfileCompleteness.module.css';

// Icons
const CheckCircleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.83333" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.66667 7L6.41667 8.75L9.33333 5.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CircleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.83333" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
    </svg>
);

interface ProfileData {
    avatarUrl: string;
    headline: string;
    teachingAreaCity: string;
    teachingAreaDistrict: string;
    videoIntroUrl: string | null;
    bio: string;
    credentials: Array<{ id: number }>;
    availability: Array<{ dayOfWeek: number }>;
    identityVerification: {
        verificationStatus: 'not_submitted' | 'pending' | 'verified' | 'rejected';
    };
}

interface ProfileCompletenessProps {
    profileData: ProfileData;
    onSectionClick?: (section: string) => void;
}

interface CompletionItem {
    key: string;
    label: string;
    completed: boolean;
    percentage: number;
}

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({
    profileData,
    onSectionClick
}) => {
    // Calculate completion for each section
    const completionItems = useMemo<CompletionItem[]>(() => {
        const items: CompletionItem[] = [];

        // Basic Info (avatar + headline + location): 15%
        const hasBasicInfo =
            !!profileData.avatarUrl &&
            !!profileData.headline &&
            profileData.headline.length >= 10 &&
            !!profileData.teachingAreaCity &&
            !!profileData.teachingAreaDistrict;
        items.push({
            key: 'basicInfo',
            label: 'Thông tin cơ bản',
            completed: hasBasicInfo,
            percentage: 15
        });

        // Identity Verification: 20%
        const hasIdentity = profileData.identityVerification?.verificationStatus === 'verified';
        items.push({
            key: 'identity',
            label: 'Xac minh danh tinh',
            completed: hasIdentity,
            percentage: 20
        });

        // Introduction video: 10%
        const hasVideo = !!profileData.videoIntroUrl;
        items.push({
            key: 'video',
            label: 'Video gioi thieu',
            completed: hasVideo,
            percentage: 10
        });

        // About Me (bio >= 100 chars): 15%
        const hasBio = profileData.bio && profileData.bio.length >= 100;
        items.push({
            key: 'about',
            label: 'Gioi thieu ban than',
            completed: hasBio,
            percentage: 15
        });

        // Academic Credentials (>= 1): 15%
        const hasCredentials = profileData.credentials && profileData.credentials.length >= 1;
        items.push({
            key: 'credentials',
            label: 'Bang cap, chung chi',
            completed: hasCredentials,
            percentage: 15
        });

        // Teaching Schedule (>= 3 slots): 15%
        const hasSchedule = profileData.availability && profileData.availability.length >= 3;
        items.push({
            key: 'schedule',
            label: 'Lich day (3+ khung gio)',
            completed: hasSchedule,
            percentage: 15
        });

        // Student Outcomes: 10% (optional Phase 2)
        // For now, we'll show it but mark as optional
        items.push({
            key: 'outcomes',
            label: 'Thanh tich hoc sinh',
            completed: false,
            percentage: 10
        });

        return items;
    }, [profileData]);

    // Calculate total percentage
    const totalPercentage = useMemo(() => {
        return completionItems.reduce((sum, item) => {
            return sum + (item.completed ? item.percentage : 0);
        }, 0);
    }, [completionItems]);

    // Get incomplete items for recommendation
    const incompleteItems = completionItems.filter(item => !item.completed);

    const handleItemClick = (key: string) => {
        if (onSectionClick) {
            onSectionClick(key);
        }
    };

    return (
        <div className={styles.card}>
            {/* Header */}
            <div className={styles.header}>
                <span className={styles.label}>Muc do hoan thien</span>
                <span className={styles.percent}>{totalPercentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${totalPercentage}%` }}
                />
            </div>

            {/* Status Message */}
            <div className={styles.statusMessage}>
                {totalPercentage === 100 ? (
                    <span className={styles.complete}>Ho so cua ban da hoan thien!</span>
                ) : totalPercentage >= 70 ? (
                    <span className={styles.good}>Sap hoan thien! Con {100 - totalPercentage}% nua.</span>
                ) : (
                    <span className={styles.needsWork}>Hoan thien them de thu hut hoc sinh</span>
                )}
            </div>

            {/* Checklist */}
            <div className={styles.checklist}>
                {completionItems.map((item) => (
                    <div
                        key={item.key}
                        className={`${styles.checklistItem} ${item.completed ? styles.completed : ''}`}
                        onClick={() => handleItemClick(item.key)}
                    >
                        {item.completed ? <CheckCircleIcon /> : <CircleIcon />}
                        <span className={styles.itemLabel}>{item.label}</span>
                        <span className={styles.itemPercent}>+{item.percentage}%</span>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            {incompleteItems.length > 0 && (
                <button
                    className={styles.actionBtn}
                    onClick={() => handleItemClick(incompleteItems[0].key)}
                >
                    Hoan thien: {incompleteItems[0].label}
                </button>
            )}
        </div>
    );
};

export default ProfileCompleteness;
