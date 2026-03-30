import React from 'react';
import { PortalLayout } from '../../components/shared/PortalLayout';
import type { NavItem } from '../../components/shared/PortalLayout';

import {
    DashboardIcon, MessagesIcon, BookingIcon,
    AccountIcon, LessonsIcon, CalendarIcon, LinkIcon,
} from '../shared/icons';

const studentNavItems: NavItem[] = [
    { path: '/student-portal/dashboard', label: 'Tổng quan', icon: DashboardIcon },
    { path: '/student-portal/booking', label: 'Đặt lịch', icon: BookingIcon },
    { path: '/student-portal/lessons', label: 'Buổi học', icon: LessonsIcon },
    { path: '/student-portal/calendar', label: 'Thời khóa biểu', icon: CalendarIcon },
    { path: '/student-portal/messages', label: 'Tin nhắn', icon: MessagesIcon },
    { path: '/student-portal/link-account', label: 'Liên kết tài khoản', icon: LinkIcon },
    { path: '/student-portal/account', label: 'Tài khoản', icon: AccountIcon },
];

interface StudentLayoutProps {
    children?: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => (
    <PortalLayout
        navItems={studentNavItems}
        userRole="STUDENT"
        showSidebarUserCard={false}
        showAvatarImage={false}
    >
        {children}
    </PortalLayout>
);

export default StudentLayout;
