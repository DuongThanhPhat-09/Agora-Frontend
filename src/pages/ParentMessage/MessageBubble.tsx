import styles from './styles.module.css';

type MessageBubbleProps = {
    message: string;
    time: string;
    avatar?: string;
    isSender?: boolean;
};

const MessageBubble = ({ message, time, avatar, isSender = false }: MessageBubbleProps) => {
    return (
        <div className={`${styles.messageBubbleRow} ${isSender ? styles.messageBubbleRowSender : ''}`}>
            {!isSender && avatar ? <img alt="" className={styles.messageBubbleAvatar} src={avatar} /> : null}
            <div className={styles.messageBubbleContent}>
                <div className={`${styles.messageBubble} ${isSender ? styles.messageBubbleSender : ''}`}>
                    {message}
                </div>
                <span className={`${styles.messageBubbleTime} ${isSender ? styles.messageBubbleTimeSender : ''}`}>
                    {time}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
