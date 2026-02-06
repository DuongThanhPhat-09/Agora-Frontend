import styles from './ChildCard.module.css';

// Image assets from Figma
const imgAvatarEmma = 'https://www.figma.com/api/mcp/asset/0fa7b0e1-9fe5-4e49-b384-5a30d16ca000';
const imgAvatarAlex = 'https://www.figma.com/api/mcp/asset/ea9649f1-06e8-41ab-8ef5-e7606621e01c';
const imgIconAdd = 'https://www.figma.com/api/mcp/asset/0a06b396-7708-4576-bd99-faae833182d3';
const imgIconMore = 'https://www.figma.com/api/mcp/asset/03177b63-6342-40c1-b62e-cc53b09b0ded';
const imgIconShare = 'https://www.figma.com/api/mcp/asset/8cc0205a-f189-4047-afcc-b81e816be63b';

export interface ChildCardProps {
    child: {
        name: string;
        grade: string;
        status: 'linked' | 'pending';
        avatar?: string;
        nextLesson?: string;
        primaryTutor?: string;
        activeClasses?: string;
        attendance?: string;
        homework?: string;
        dashboardVariant?: 'primary' | 'muted';
        inviteDate?: string;
        inviteMessage?: string;
    };
}

const ChildCard = ({ child }: ChildCardProps) => {
    const { name, grade, status, avatar, nextLesson, primaryTutor, activeClasses, attendance, homework, dashboardVariant, inviteDate, inviteMessage } = child;

    const getAvatar = () => {
        if (status === 'pending') return imgIconAdd;
        if (name.includes('Emma')) return imgAvatarEmma;
        if (name.includes('Alex')) return imgAvatarAlex;
        return imgIconAdd;
    };

    return (
        <div className={`${styles.childCard} ${styles[`status-${status}`]}`}>
            {/* Header */}
            <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                    <div className={styles.avatar}>
                        <img src={avatar || getAvatar()} alt="" className={styles.avatarImage} />
                    </div>
                    <div className={styles.cardHeaderInfo}>
                        <p className={styles.name}>{name}</p>
                        <p className={styles.grade}>{grade}</p>
                    </div>
                </div>
                <div className={`${styles.statusBadge} ${styles[`badge-${status}`]}`}>
                    <p className={styles.statusText}>{status === 'linked' ? 'Linked' : 'Pending Invite'}</p>
                </div>
            </div>

            {/* Info Rows - Only for linked children */}
            {status === 'linked' && (
                <div className={styles.cardInfoRows}>
                    {nextLesson && (
                        <div className={styles.infoRow}>
                            <p className={styles.infoLabel}>Next lesson</p>
                            <p className={styles.infoValue}>{nextLesson}</p>
                        </div>
                    )}
                    {primaryTutor && (
                        <div className={styles.infoRow}>
                            <p className={styles.infoLabel}>Primary tutor</p>
                            <p className={styles.infoValue}>{primaryTutor}</p>
                        </div>
                    )}
                    {activeClasses && (
                        <div className={styles.infoRow}>
                            <p className={styles.infoLabel}>Active classes</p>
                            <p className={styles.infoValue}>{activeClasses}</p>
                        </div>
                    )}
                    {attendance && (
                        <div className={styles.infoRow}>
                            <p className={styles.infoLabel}>Attendance</p>
                            <p className={styles.infoValue}>{attendance}</p>
                        </div>
                    )}
                    {homework && (
                        <div className={styles.infoRow}>
                            <p className={styles.infoLabel}>Homework</p>
                            <p className={`${styles.infoValue} ${styles.homework}`}>{homework}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pending Info - Only for pending children */}
            {status === 'pending' && inviteDate && inviteMessage && (
                <div className={styles.pendingInfo}>
                    <p className={styles.pendingDate}>{inviteDate}</p>
                    <p className={styles.pendingMessage}>{inviteMessage}</p>
                </div>
            )}

            {/* Actions */}
            <div className={styles.cardActions}>
                {status === 'linked' ? (
                    <>
                        <button className={dashboardVariant === 'muted' ? styles.buttonPrimaryMuted : styles.buttonPrimary}>
                            <p className={styles.buttonTextPrimary}>View Dashboard</p>
                        </button>
                        <div className={styles.actionButtonMargin}>
                            <button className={styles.buttonSecondary}>
                                <p className={styles.buttonTextSecondary}>Set as Default</p>
                            </button>
                        </div>
                        <div className={styles.moreButtonContainer}>
                            <div className={styles.moreButtonWrapper}>
                                <button className={styles.buttonMore}>
                                    <img src={imgIconMore} alt="" className={styles.iconMore} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.pendingActionsTop}>
                            <button className={styles.buttonMuted}>
                                <p className={styles.buttonTextSecondaryDark}>Copy Link</p>
                            </button>
                            <div className={styles.actionButtonMargin}>
                                <button className={`${styles.buttonMuted} ${styles.buttonMutedIcon}`}>
                                    <img src={imgIconShare} alt="" className={styles.iconShare} />
                                </button>
                            </div>
                        </div>
                        <div className={styles.pendingActionsBottom}>
                            <button className={styles.buttonSecondary}>
                                <p className={styles.buttonTextSecondaryDark}>Resend Invite</p>
                            </button>
                            <button className={`${styles.buttonSecondary} ${styles.buttonSecondaryCompact}`}>
                                <p className={styles.buttonTextSecondary}>Cancel</p>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChildCard;
