import '../../styles/pages/admin-dashboard.css';
import UnderDevelopment from '../../components/UnderDevelopment/UnderDevelopment';
import { StatCard, StatusBadge, DataTable, SectionCard } from '../../components/shared';
import type { DataTableColumn } from '../../components/shared';

// ─── Types ───

interface PriorityAction {
    id: string;
    typeIcon: string;
    typeText: string;
    userName: string;
    userSubtitle: string;
    userAvatar?: string;
    userInitials?: string;
    date: string;
    status: string;
    statusVariant: 'warning' | 'error' | 'info';
    actionLabel: string;
}

// ─── Static Data ───

const priorityActions: PriorityAction[] = [
    {
        id: '#VR-2049',
        typeIcon: 'school',
        typeText: 'Duyệt gia sư',
        userName: 'Sarah Jenkins',
        userSubtitle: 'Chuyên gia Giải tích II',
        userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwdaLq0QwR3f-212AWuMogOewV64mByEfiW58arWuED5tdockBnq2MF3sIQ_d5qV3C8MHXh44bRN1lg19mUlXV9V-atTF3SMkTR0Qp6SVkVleuiNPZOT1T9YuwVLY4OT9Fm8IQeSDeDV50il_GgcmwCDbR1-td-AWvRFEealeYnkqJKMxKTIJb6M3nlbu5f7XV6WUD7MZbNaj-sq9aRQgIwCuT0gJHvmjhpXUMXS-1sfYR9v9KmjA16o5enro7c-N6jozVK7Re7U0',
        date: '24 Th10, 2023',
        status: 'Chờ xem xét',
        statusVariant: 'warning',
        actionLabel: 'Xem xét',
    },
    {
        id: '#VR-2048',
        typeIcon: 'school',
        typeText: 'Duyệt gia sư',
        userName: 'Emily Chen',
        userSubtitle: 'Tiến sĩ Vật lý',
        userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2DRECcchBetpTF1-OjBxMCp6P_GOojpMy5X1Ewrn3OABnY6SJPwkUNA19SQWfcvA43tu_L8io6AQMLgAp26WGt2bdcuSMjAaDE_A9nh6xoxRHf9g1GgZuQT0z0f8l8fUIqNAUHhqO3IGJ3pp7z-XrgUoVP8sXckKrIgtM7m9GATCSzcWsVBEgrcNEpHixOUfRxfw_YU2nxkznaZ3rJ-21sJld5qhy-3Yuod1ejjvrwcxFWJW0-fjO5W0DaJuQl8FSNnUKyrcbiNM',
        date: '23 Th10, 2023',
        status: 'Chờ xem xét',
        statusVariant: 'warning',
        actionLabel: 'Xem xét',
    },
    {
        id: '#FN-3320',
        typeIcon: 'receipt_long',
        typeText: 'Yêu cầu thanh toán',
        userName: 'John Doe',
        userSubtitle: 'ID: 88291',
        userInitials: 'JD',
        date: '22 Th10, 2023',
        status: 'Đang xử lý',
        statusVariant: 'info',
        actionLabel: 'Chi tiết',
    },
];

// ─── Table Columns ───

const columns: DataTableColumn<PriorityAction>[] = [
    {
        key: 'id',
        title: 'ID',
        render: (row) => <span className="admin-table-id">{row.id}</span>,
        width: 100,
        hideOnMobile: true,
    },
    {
        key: 'type',
        title: 'Loại',
        render: (row) => (
            <div className="admin-table-type">
                <span className="material-symbols-outlined admin-type-icon">{row.typeIcon}</span>
                <span className="admin-type-text">{row.typeText}</span>
            </div>
        ),
        hideOnMobile: true,
    },
    {
        key: 'user',
        title: 'Người dùng / Chủ đề',
        render: (row) => (
            <div className="admin-table-user">
                {row.userAvatar ? (
                    <div className="admin-user-thumbnail" style={{ backgroundImage: `url('${row.userAvatar}')` }} />
                ) : (
                    <div className="admin-user-thumbnail admin-user-thumbnail-initials">{row.userInitials}</div>
                )}
                <div className="admin-user-details">
                    <p className="admin-user-name-text">{row.userName}</p>
                    <p className="admin-user-subtitle">{row.userSubtitle}</p>
                </div>
            </div>
        ),
    },
    {
        key: 'date',
        title: 'Ngày',
        dataIndex: 'date',
        hideOnMobile: true,
    },
    {
        key: 'status',
        title: 'Trạng thái',
        render: (row) => (
            <StatusBadge variant={row.statusVariant}>{row.status}</StatusBadge>
        ),
    },
    {
        key: 'action',
        title: 'Hành động',
        align: 'right',
        render: (row) => (
            <button className="admin-action-btn admin-action-btn-outline">{row.actionLabel}</button>
        ),
    },
];

// ─── Component ───

const AdminDashboardPage = () => {
    return (
        <div className="admin-content">
            <div className="admin-content-inner">
                {/* GREETING */}
                <div className="admin-greeting">
                    <h2 className="admin-greeting-title">Chào buổi sáng, Quản trị viên</h2>
                    <p className="admin-greeting-text">Đây là những gì đang diễn ra tại TUTORA hôm nay.</p>
                </div>

                <UnderDevelopment featureName="bảng điều khiển" />

                {/* STATS GRID */}
                <div className="admin-stats-grid">
                    <StatCard
                        icon={<span className="material-symbols-outlined">group</span>}
                        value="12,450"
                        label="Tổng số người dùng"
                        subLabel="so với 30 ngày qua"
                        badge="+12%"
                        badgeVariant="green"
                        className="admin-stat-card"
                    />
                    <StatCard
                        icon={<span className="material-symbols-outlined">verified_user</span>}
                        value="42"
                        label="Đang chờ duyệt"
                        subLabel="đơn"
                        badge="Khẩn cấp: 5"
                        badgeVariant="orange"
                        className="admin-stat-card"
                    />
                    <StatCard
                        icon={<span className="material-symbols-outlined">payments</span>}
                        value="$142.3k"
                        label="Doanh thu tháng này"
                        subLabel="so với tháng trước"
                        badge="+5.2%"
                        badgeVariant="green"
                        className="admin-stat-card"
                    />
                </div>

                {/* PRIORITY ACTIONS TABLE */}
                <SectionCard
                    title="Hành động ưu tiên cần thiết"
                    headerAction={
                        <button className="admin-view-all-btn">
                            Xem tất cả
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    }
                >
                    <DataTable
                        columns={columns}
                        data={priorityActions}
                        rowKey="id"
                        emptyText="Không có hành động nào cần xử lý"
                        minWidth={600}
                    />
                </SectionCard>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
