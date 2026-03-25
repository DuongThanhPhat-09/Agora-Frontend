import styles from './styles.module.css';

type MessageBubbleProps = {
    message: string;
    time: string;
    avatar?: string;
    isSender?: boolean;
    isRead?: boolean;
    messageType?: string;
};

/** Format ISO timestamp to readable time */
const formatTime = (isoString: string): string => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const now = new Date();
        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (isToday) {
            return `${hours}:${minutes}`;
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month} ${hours}:${minutes}`;
    } catch {
        return isoString;
    }
};

const MessageBubble = ({ message, time, avatar, isSender = false, isRead = false, messageType }: MessageBubbleProps) => {
    return (
        <div className={`${styles.messageBubbleRow} ${isSender ? styles.messageBubbleRowSender : ''}`}>
            {!isSender && avatar && <img alt="" className={styles.messageBubbleAvatar} src={avatar} />}
            <div className={styles.messageBubbleContent}>
                <div className={`${styles.messageBubble} ${isSender ? styles.messageBubbleSender : ''}`} style={messageType === 'image' ? { padding: 4, background: 'transparent' } : undefined}>
                    {messageType === 'image' ? (
                        <img
                            src={message}
                            alt="Hình ảnh"
                            style={{ maxWidth: 300, maxHeight: 300, borderRadius: 8, display: 'block', cursor: 'pointer' }}
                            onClick={() => window.open(message, '_blank')}
                        />
                    ) : (
                        message
                    )}
                </div>
                <span className={`${styles.messageBubbleTime} ${isSender ? styles.messageBubbleTimeSender : ''}`}>
                    {formatTime(time)}
                    {isSender && (
                        <span style={{ marginLeft: 4, fontSize: 12, color: isRead ? '#4F46E5' : '#9ca3af' }} title={isRead ? 'Đã đọc' : 'Đã gửi'}>
                            {isRead ? '✓✓' : '✓'}
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
