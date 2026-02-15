import styles from './styles.module.css';

type MessageInfoItemProps = {
    avatar: string;
    name: string;
    timestamp: string;
    role: string;
    session: string;
    status?: string;
    badge?: {
        label: string;
        icon: string;
        muted?: boolean;
    };
    preview: string;
    active?: boolean;
    unread?: boolean;
};

const MessageInfoItem = ({
    avatar,
    name,
    timestamp,
    role,
    session,
    status,
    badge,
    preview,
    active = false,
    unread = false,
}: MessageInfoItemProps) => {
    const isBookingRequest = status === 'pending_tutor';

    return (
        <button className={`${styles.messageItem} ${active ? styles.messageItemActive : ''}`} type="button">
            <div className={styles.avatarContainer}>
                <img alt="" className={styles.messageAvatar} src={avatar} />
                {isBookingRequest && <div className={styles.requestIndicator} />}
            </div>
            <div className={styles.messageItemContent}>
                <div className={styles.messageItemTop}>
                    <span className={styles.messageName}>{name}</span>
                    <span className={styles.messageTime}>{timestamp}</span>
                </div>
                <div className={styles.messageMetaRow}>
                    <span className={styles.messageRole}>{role}</span>
                    <span className={styles.messageDot}>•</span>
                    <span className={styles.messageSession}>{session}</span>
                </div>
                {isBookingRequest ? (
                    <div className={styles.bookingRequestBadge}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
                            <path d="M6 3v3h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                        <span>Booking Request</span>
                    </div>
                ) : badge ? (
                    <div className={`${styles.messageBadge} ${badge.muted ? styles.messageBadgeMuted : ''}`}>
                        <img alt="" className={styles.messageBadgeIcon} src={badge.icon} />
                        <span>{badge.label}</span>
                    </div>
                ) : null}
                <span className={styles.messagePreview}>{preview}</span>
            </div>
            {unread ? <span className={styles.unreadDot} /> : null}
        </button>
    );
};

export default MessageInfoItem;
