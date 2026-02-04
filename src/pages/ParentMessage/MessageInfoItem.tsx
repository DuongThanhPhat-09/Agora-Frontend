import styles from './styles.module.css';

type MessageInfoItemProps = {
    avatar: string;
    name: string;
    timestamp: string;
    role: string;
    session: string;
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
    badge,
    preview,
    active = false,
    unread = false,
}: MessageInfoItemProps) => {
    return (
        <button className={`${styles.messageItem} ${active ? styles.messageItemActive : ''}`} type="button">
            <img alt="" className={styles.messageAvatar} src={avatar} />
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
                {badge ? (
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
