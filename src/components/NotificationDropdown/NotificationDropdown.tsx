import { useState, useEffect, useRef } from 'react';
import type { NotificationDTO } from '../../services/notification.service';
import { getUnreadNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../services/notification.service';
import NotificationItem from '../NotificationItem/NotificationItem';
import styles from './NotificationDropdown.module.css';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onCountUpdate?: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose, onCountUpdate }) => {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getUnreadNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await markAsRead(id);
            setNotifications(prev => prev.filter(n => n.notificationid !== id));
            onCountUpdate?.();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications([]);
            onCountUpdate?.();
            onClose();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.notificationid !== id));
            onCountUpdate?.();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div ref={dropdownRef} className={styles.dropdown}>
            <div className={styles.header}>
                <h3 className={styles.title}>Notifications</h3>
                {notifications.length > 0 && (
                    <button className={styles.markAllBtn} onClick={handleMarkAllAsRead}>
                        Mark all as read
                    </button>
                )}
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className={styles.empty}>
                        <span className="material-symbols-outlined">notifications_off</span>
                        <p>No new notifications</p>
                    </div>
                ) : (
                    <div className={styles.notificationList}>
                        {notifications.map(notification => (
                            <NotificationItem
                                key={notification.notificationid}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className={styles.footer}>
                    <button className={styles.viewAllBtn} onClick={onClose}>
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
