import type { NotificationDTO } from '../../services/notification.service';
import styles from './NotificationItem.module.css';
import { BookOpen, MessageSquare, CreditCard, Calendar } from 'lucide-react';

interface NotificationItemProps {
    notification: NotificationDTO;
    onMarkAsRead?: (id: number) => void;
    onDelete?: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead, onDelete }) => {
    const getNotificationIcon = () => {
        const title = notification.title.toLowerCase();
        if (title.includes('booking') || title.includes('request')) {
            return <BookOpen className={styles.icon} />;
        }
        if (title.includes('message')) {
            return <MessageSquare className={styles.icon} />;
        }
        if (title.includes('payment') || title.includes('paid')) {
            return <CreditCard className={styles.icon} />;
        }
        if (title.includes('schedule') || title.includes('session')) {
            return <Calendar className={styles.icon} />;
        }
        return <MessageSquare className={styles.icon} />;
    };

    const getTimeAgo = () => {
        if (!notification.createdat) return '';
        const now = new Date();
        const created = new Date(notification.createdat);
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return created.toLocaleDateString();
    };

    return (
        <div className={`${styles.notificationItem} ${!notification.isread ? styles.unread : ''}`}>
            <div className={styles.iconWrapper}>
                {getNotificationIcon()}
            </div>
            <div className={styles.content}>
                <h4 className={styles.title}>{notification.title}</h4>
                <p className={styles.message}>{notification.message}</p>
                <span className={styles.time}>{getTimeAgo()}</span>
            </div>
            <div className={styles.actions}>
                {!notification.isread && onMarkAsRead && (
                    <button
                        className={styles.markReadBtn}
                        onClick={() => onMarkAsRead(notification.notificationid)}
                        title="Mark as read"
                    >
                        <span className="material-symbols-outlined">check</span>
                    </button>
                )}
                {onDelete && (
                    <button
                        className={styles.deleteBtn}
                        onClick={() => onDelete(notification.notificationid)}
                        title="Delete"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
