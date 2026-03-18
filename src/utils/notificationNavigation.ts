import type { NotificationDTO } from '../services/notification.service';

export function getPortalPrefix(): string {
    const parts = window.location.pathname.split('/');
    const portals = ['tutor-portal', 'parent-portal', 'student-portal'];
    const found = parts.find(p => portals.includes(p));
    return found ? `/${found}` : '/parent-portal';
}

export function getNotificationTargetPath(notification: NotificationDTO): string {
    const prefix = getPortalPrefix();
    const title = notification.title.toLowerCase();
    const message = notification.message.toLowerCase();
    const combined = title + ' ' + message;

    if (combined.includes('booking') || combined.includes('request') || combined.includes('đặt lịch') || combined.includes('cọc')) {
        if (prefix === '/tutor-portal') return `${prefix}/bookings`;
        return `${prefix}/booking`;
    }
    if (combined.includes('message') || combined.includes('tin nhắn')) {
        return `${prefix}/messages`;
    }
    if (combined.includes('payment') || combined.includes('paid') || combined.includes('wallet') || combined.includes('thanh toán')) {
        if (prefix === '/tutor-portal') return `${prefix}/finance`;
        if (prefix === '/parent-portal') return `${prefix}/wallet`;
        return `${prefix}/dashboard`;
    }
    if (combined.includes('schedule') || combined.includes('session') || combined.includes('lịch') || combined.includes('buổi')) {
        if (prefix === '/tutor-portal') return `${prefix}/schedule`;
        return `${prefix}/calendar`;
    }

    return `${prefix}/notifications`;
}
