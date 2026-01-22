import React, { useState } from 'react';
import styles from '../../styles/pages/tutor-portal-profile.module.css';
import EditHeroModal from './components/EditHeroModal';

const TutorPortalProfile: React.FC = () => {
    const [isEditMode, setIsEditMode] = useState(true);
    const [isEditHeroModalOpen, setIsEditHeroModalOpen] = useState(false);

    return (
        <div>
            {/* Edit Bar - Sticky Top */}
            <div className={styles.editBarStickyTop}>
                <div className={styles.editBarLeft}>
                    {/* Preview/Edit Toggle */}
                    <div className={styles.toggleGroup}>
                        <button
                            className={`${styles.toggleBtn} ${!isEditMode ? styles.active : ''}`}
                            onClick={() => setIsEditMode(false)}
                        >
                            Preview
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${isEditMode ? styles.active : ''}`}
                            onClick={() => setIsEditMode(true)}
                        >
                            Edit
                        </button>
                    </div>

                    {/* Editing Status */}
                    <div className={styles.editingStatus}>
                        <span className={styles.editingDot}></span>
                        <span className={styles.editingText}>Editing</span>
                    </div>

                    {/* Saved Status */}
                    <div className={styles.savedStatus}>
                        <svg className={styles.savedIcon} viewBox="0 0 10 10" fill="currentColor">
                            <path d="M8.5 2.5L4 7L1.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={styles.savedText}>Saved just now</span>
                    </div>
                </div>

                <div className={styles.editBarRight}>
                    {/* Share Button */}
                    <button className={styles.shareBtn}>
                        <svg className={styles.shareIcon} viewBox="0 0 15 12" fill="currentColor">
                            <path d="M6 4L9 1L12 4M9 1V8M2 6V10C2 10.5523 2.44772 11 3 11H15C15.5523 11 16 10.5523 16 10V6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Share
                    </button>

                    <div className={styles.verticalDivider}></div>

                    {/* Save Draft Button */}
                    <button className={styles.saveDraftBtn}>Save Draft</button>

                    {/* Publish Button */}
                    <button className={styles.publishBtn}>Publish Changes</button>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        {/* Left Column */}
                        <div className={styles.heroLeft}>
                            {/* Video Placeholder */}
                            <div className={styles.videoPlaceholder}>
                                <div className={styles.playButton}>
                                    <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5V19L19 12L8 5Z" />
                                    </svg>
                                </div>
                                <span className={styles.videoText}>Watch introduction video (2:45)</span>
                            </div>

                            {/* Tutor Info Card */}
                            <div className={styles.tutorInfoCard}>
                                <div className={styles.tutorAvatar}></div>
                                <div className={styles.tutorDetails}>
                                    {/* Edit Hero Button */}
                                    {isEditMode && (
                                        <button
                                            className={styles.editHeroBtn}
                                            onClick={() => setIsEditHeroModalOpen(true)}
                                        >
                                            <svg className={styles.editIcon} viewBox="0 0 12 12" fill="currentColor">
                                                <path d="M9.586 1.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM7.379 3.793L0 11.172V14h2.828l7.38-7.379-2.83-2.828z" />
                                            </svg>
                                            Edit Hero Section
                                        </button>
                                    )}
                                    <div className={styles.tutorNameRow}>
                                        <h1 className={styles.tutorName}>Sarah Mitchell</h1>
                                        <svg className={styles.verifiedBadge} viewBox="0 0 18 18" fill="#3b82f6">
                                            <path d="M9 0L11.5 2.5L15 2L14.5 5.5L17 8L14.5 10.5L15 14L11.5 13.5L9 16L6.5 13.5L3 14L3.5 10.5L1 8L3.5 5.5L3 2L6.5 2.5L9 0Z" />
                                            <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className={styles.tutorHeadline}>Mathematics & Physics Expert | 10+ Years Experience</p>

                                    {/* Meta Info */}
                                    <div className={styles.tutorMeta}>
                                        <div className={styles.metaItem}>
                                            <svg className={styles.ratingIcon} viewBox="0 0 14 14" fill="#fbbf24">
                                                <path d="M7 0L8.5 4.5H13L9.5 7.5L10.5 12L7 9.5L3.5 12L4.5 7.5L1 4.5H5.5L7 0Z" />
                                            </svg>
                                            <span className={styles.ratingValue}>4.9</span>
                                            <span className={styles.ratingCount}>(127 reviews)</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <svg className={styles.metaIcon} viewBox="0 0 12 12" fill="currentColor">
                                                <path d="M6 0C3.24 0 1 2.24 1 5C1 8.5 6 12 6 12C6 12 11 8.5 11 5C11 2.24 8.76 0 6 0ZM6 7C4.9 7 4 6.1 4 5C4 3.9 4.9 3 6 3C7.1 3 8 3.9 8 5C8 6.1 7.1 7 6 7Z" />
                                            </svg>
                                            <span className={styles.metaText}>Boston, MA</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <svg className={styles.metaIcon} viewBox="0 0 14 12" fill="currentColor">
                                                <path d="M13 4L7 8L1 4V10C1 10.5523 1.44772 11 2 11H12C12.5523 11 13 10.5523 13 10V4Z" />
                                                <path d="M1 3L7 7L13 3V2C13 1.44772 12.5523 1 12 1H2C1.44772 1 1 1.44772 1 2V3Z" />
                                            </svg>
                                            <span className={styles.metaText}>Online & In-person</span>
                                        </div>
                                    </div>

                                    {/* Subject Tags */}
                                    <div className={styles.subjectTags}>
                                        <span className={styles.subjectTag}>Mathematics</span>
                                        <span className={styles.subjectTag}>Physics</span>
                                        <span className={styles.subjectTag}>Grade 8-12</span>
                                        <span className={styles.subjectTag}>AP/IB</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Bar */}
                            <div className={styles.statsBar}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Response Time</span>
                                    <div className={styles.statValue}>
                                        Within 2 hours
                                        <svg className={styles.statIcon} viewBox="0 0 8 9" fill="#22c55e">
                                            <path d="M4 0L7 4H5V9H3V4H1L4 0Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Lessons Taught</span>
                                    <div className={styles.statValue}>
                                        850+ sessions
                                        <svg className={styles.statIcon} viewBox="0 0 8 9" fill="#22c55e">
                                            <path d="M4 0L7 4H5V9H3V4H1L4 0Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Success Rate</span>
                                    <div className={styles.statValue}>
                                        95% goals met
                                        <svg className={styles.statIcon} viewBox="0 0 8 9" fill="#22c55e">
                                            <path d="M4 0L7 4H5V9H3V4H1L4 0Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Verified</span>
                                    <div className={styles.statValue}>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="#22c55e">
                                            <path d="M7 0L8.5 1.5H11V4L12.5 5.5L11 7V9.5H8.5L7 11L5.5 9.5H3V7L1.5 5.5L3 4V1.5H5.5L7 0Z" />
                                            <path d="M5 5.5L6.5 7L9 4.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        ID & Education
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className={styles.heroRight}>
                            {/* Pricing Card */}
                            <div className={styles.pricingCard}>
                                <div>
                                    <div className={styles.priceRow}>
                                        <span className={styles.priceAmount}>$65</span>
                                        <span className={styles.priceUnit}>/hour</span>
                                    </div>
                                    <p className={styles.trialPrice}>Trial lesson: $45</p>
                                </div>

                                <div className={styles.availabilitySection}>
                                    <span className={styles.availabilityLabel}>Next Available</span>
                                    <div className={styles.availabilitySlots}>
                                        <div className={styles.slotRow}>
                                            <span className={styles.slotTime}>Tomorrow, 2:00 PM</span>
                                            <button className={styles.slotSelect}>Select</button>
                                        </div>
                                        <div className={styles.slotRow}>
                                            <span className={styles.slotTime}>Tomorrow, 4:30 PM</span>
                                            <button className={styles.slotSelect}>Select</button>
                                        </div>
                                    </div>
                                </div>

                                <button className={styles.bookTrialBtn}>Book Trial Lesson</button>

                                <button className={styles.sendMessageBtn}>
                                    <svg className={styles.messageIcon} viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                        <path d="M1 3L6 6.5L11 3M1 9V3C1 2.44772 1.44772 2 2 2H10C10.5523 2 11 2.44772 11 3V9C11 9.55228 10.5523 10 10 10H2C1.44772 10 1 9.55228 1 9Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Send Message
                                </button>

                                <div className={styles.cancellationNote}>
                                    <svg className={styles.cancellationIcon} viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                        <circle cx="6" cy="6" r="5" strokeWidth="1.5" />
                                        <path d="M6 4V6.5L7.5 8" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Free cancellation up to 24h
                                </div>
                            </div>

                            {/* Profile Completeness Card */}
                            <div className={styles.completenessCard}>
                                <div className={styles.completenessHeader}>
                                    <span className={styles.completenessLabel}>Profile Completeness</span>
                                    <span className={styles.completenessPercent}>82%</span>
                                </div>

                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: '82%' }}></div>
                                </div>

                                <div className={styles.checklistItems}>
                                    <div className={`${styles.checklistItem} ${styles.completed}`}>
                                        <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="#22c55e">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Basic info
                                    </div>
                                    <div className={`${styles.checklistItem} ${styles.completed}`}>
                                        <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="#22c55e">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Introduction video
                                    </div>
                                    <div className={`${styles.checklistItem} ${styles.incomplete}`}>
                                        <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="none" stroke="#a3a3a3">
                                            <circle cx="6" cy="6" r="5" strokeWidth="1.5" />
                                        </svg>
                                        Add 2 more success stories
                                    </div>
                                    <div className={`${styles.checklistItem} ${styles.incomplete}`}>
                                        <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="none" stroke="#a3a3a3">
                                            <circle cx="6" cy="6" r="5" strokeWidth="1.5" />
                                        </svg>
                                        Upload certificate
                                    </div>
                                </div>

                                <button className={styles.completeProfileBtn}>Complete profile</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className={styles.contentSections}>
                    {/* About Me Section */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>About Me</h2>
                        </div>
                        <div className={styles.sectionContent}>
                            <p>
                                I'm a passionate educator with over 10 years of experience teaching Mathematics and Physics to high school students.
                                I hold a Master's degree in Applied Mathematics from MIT and have helped hundreds of students achieve their academic goals.
                            </p>
                            <p>
                                My teaching philosophy centers on building strong foundations and developing problem-solving skills.
                                I believe every student can excel in STEM subjects with the right guidance and approach.
                            </p>
                        </div>
                        {isEditMode && (
                            <button className={styles.editSectionBtn}>
                                <svg className={styles.editIcon} viewBox="0 0 12 12" fill="currentColor">
                                    <path d="M9.586 1.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM7.379 3.793L0 11.172V14h2.828l7.38-7.379-2.83-2.828z" />
                                </svg>
                                Edit About
                            </button>
                        )}
                    </div>

                    {/* Academic Credentials Section */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Academic Credentials</h2>
                        </div>
                        <div className={styles.credentialsList}>
                            <div className={styles.credentialItem}>
                                <div className={styles.credentialIcon}>🎓</div>
                                <div className={styles.credentialDetails}>
                                    <h4 className={styles.credentialTitle}>Master of Science in Applied Mathematics</h4>
                                    <p className={styles.credentialInstitution}>Massachusetts Institute of Technology (MIT)</p>
                                    <span className={styles.credentialDate}>2010 - 2012</span>
                                </div>
                            </div>
                            <div className={styles.credentialItem}>
                                <div className={styles.credentialIcon}>📜</div>
                                <div className={styles.credentialDetails}>
                                    <h4 className={styles.credentialTitle}>Teaching License - Massachusetts</h4>
                                    <p className={styles.credentialInstitution}>State Board of Education</p>
                                    <span className={styles.credentialDate}>Issued 2013</span>
                                </div>
                            </div>
                        </div>
                        {isEditMode && (
                            <div className={styles.credentialsActions}>
                                <button className={styles.addCredentialBtn}>
                                    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                                        <path d="M5 0V12M0 6H10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                    </svg>
                                    Add Credential
                                </button>
                                <button className={styles.editCredentialBtn}>
                                    <svg className={styles.editIcon} viewBox="0 0 12 12" fill="currentColor">
                                        <path d="M9.586 1.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM7.379 3.793L0 11.172V14h2.828l7.38-7.379-2.83-2.828z" />
                                    </svg>
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Student Outcomes Section */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Student Outcomes</h2>
                        </div>
                        <div className={styles.outcomeCard}>
                            <span className={styles.outcomeValue}>95%</span>
                            <span className={styles.outcomeLabel}>Students improved by 1+ grade</span>
                        </div>
                        {isEditMode && (
                            <button className={styles.editSectionBtn}>
                                <svg className={styles.editIcon} viewBox="0 0 12 12" fill="currentColor">
                                    <path d="M9.586 1.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM7.379 3.793L0 11.172V14h2.828l7.38-7.379-2.83-2.828z" />
                                </svg>
                                Edit Metrics
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Hero Modal with eKYC Verification */}
            <EditHeroModal
                isOpen={isEditHeroModalOpen}
                onClose={() => setIsEditHeroModalOpen(false)}
                onSuccess={() => {
                    // Handle successful verification (e.g., refresh user data)
                    console.log('Verification submitted successfully');
                }}
            />
        </div>
    );
};

export default TutorPortalProfile;
