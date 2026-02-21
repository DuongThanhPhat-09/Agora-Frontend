import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatDateTime } from '../../utils/formatters';
import {
    mockGetAllUsers,
    mockBlockUser,
    mockUnblockUser,
    mockIssueWarning,
    mockSuspendUser,
    mockResetPassword,
} from './mockData';
import type { FlatUserDetail } from './mockData';
import UserDetailModal from './components/UserDetailModal';
import BlockUserModal from './components/BlockUserModal';
import IssueWarningModal from './components/IssueWarningModal';
import SuspendUserModal from './components/SuspendUserModal';
import '../../styles/pages/admin-user-management.css';
import '../../styles/pages/admin-vetting-modal.css';

const UserManagementPage = () => {
    // State
    const [users, setUsers] = useState<FlatUserDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // Filters
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [selectedUser, setSelectedUser] = useState<FlatUserDetail | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

    // Fetch users on mount and filter changes
    useEffect(() => {
        fetchUsers();
    }, [page, roleFilter, statusFilter, searchQuery]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const offset = (page - 1) * limit;
            const { users: data, total: totalCount } = await mockGetAllUsers(
                roleFilter,
                statusFilter,
                searchQuery,
                limit,
                offset
            );

            setUsers(data);
            setTotal(totalCount);
        } catch (err) {
            console.error('Error fetching users:', err);
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleUserClick = (user: FlatUserDetail) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleBlockUser = async (userId: string, reason: string) => {
        await mockBlockUser(userId, reason);
        setIsBlockModalOpen(false);
        setIsDetailModalOpen(false);
        await fetchUsers();
    };

    const handleUnblockUser = async () => {
        if (!selectedUser) return;
        await mockUnblockUser(selectedUser.userid);
        toast.success(`Đã mở khóa tài khoản ${selectedUser.fullname}`);
        setIsDetailModalOpen(false);
        await fetchUsers();
    };

    const handleIssueWarning = async (userId: string, reason: string, severity: string, relatedBookingId?: string) => {
        await mockIssueWarning(userId, reason, severity, relatedBookingId);
        setIsWarningModalOpen(false);
        await fetchUsers();
    };

    const handleSuspendUser = async (userId: string, reason: string, durationDays: number) => {
        await mockSuspendUser(userId, reason, durationDays);
        setIsSuspendModalOpen(false);
        setIsDetailModalOpen(false);
        await fetchUsers();
    };

    const handleResetPassword = async () => {
        if (!selectedUser) return;
        await mockResetPassword(selectedUser.userid);
        toast.success(`Email đặt lại mật khẩu đã được gửi đến ${selectedUser.email}`);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to first page when searching
    };

    // Get status badge color
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'active':
                return 'user-mgmt-status-active';
            case 'suspended':
                return 'user-mgmt-status-suspended';
            case 'blocked':
                return 'user-mgmt-status-blocked';
            default:
                return 'user-mgmt-status-pending';
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <>
            {/* MAIN CONTENT */}
            <main className="user-mgmt-main">
                {/* HEADER AREA */}
                <header className="user-mgmt-header">
                    {/* Breadcrumbs */}
                    <div className="user-mgmt-breadcrumbs">
                        <a href="#" className="breadcrumb-link">
                            Trang chủ
                        </a>
                        <span className="breadcrumb-separator">/</span>
                        <a href="#" className="breadcrumb-link">
                            Quản trị
                        </a>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">Danh sách người dùng</span>
                    </div>

                    {/* Page Title */}
                    <div className="user-mgmt-title-section">
                        <div>
                            <h2 className="user-mgmt-title">Danh sách người dùng</h2>
                            <p className="user-mgmt-subtitle">
                                Quản lý {total.toLocaleString()} tài khoản trên toàn nền tảng.
                            </p>
                        </div>
                    </div>
                </header>

                {/* FILTER & TOOLBAR */}
                <div className="user-mgmt-toolbar">
                    <div className="user-mgmt-toolbar-inner">
                        {/* Search */}
                        <div className="user-mgmt-search-wrapper">
                            <input
                                className="user-mgmt-search-input"
                                placeholder="Tìm kiếm tên, email, hoặc UID..."
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            <span className="material-symbols-outlined user-mgmt-search-icon">search</span>
                        </div>

                        {/* Filters Group */}
                        <div className="user-mgmt-filters">
                            {/* Role Dropdown */}
                            <div className="user-mgmt-filter-group">
                                <select
                                    className="user-mgmt-filter-btn"
                                    value={roleFilter}
                                    onChange={(e) => {
                                        setRoleFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="all">Vai trò: Tất cả</option>
                                    <option value="student">Học viên</option>
                                    <option value="tutor">Gia sư</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>

                            {/* Status Dropdown */}
                            <div className="user-mgmt-filter-group">
                                <select
                                    className="user-mgmt-filter-btn"
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="all">Trạng thái: Tất cả</option>
                                    <option value="active">Hoạt động</option>
                                    <option value="suspended">Tạm ngưng</option>
                                    <option value="blocked">Bị chặn</option>
                                </select>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="user-mgmt-divider"></div>

                        {/* Export Action */}
                        <button className="user-mgmt-export-btn" onClick={() => toast.info('Chức năng xuất CSV sẽ có trong tương lai')}>
                            <span className="material-symbols-outlined">download</span>
                            Xuất CSV
                        </button>
                    </div>
                </div>

                {/* TABLE CONTAINER */}
                <div className="user-mgmt-table-container">
                    <div className="user-mgmt-table-wrapper">
                        {/* Table Header */}
                        <div className="user-mgmt-table-header">
                            <div className="user-mgmt-col-identity">Thông tin người dùng</div>
                            <div className="user-mgmt-col-role">Vai trò</div>
                            <div className="user-mgmt-col-date">Ngày tham gia</div>
                            <div className="user-mgmt-col-performance">Lịch sử</div>
                            <div className="user-mgmt-col-status">Trạng thái</div>
                            <div className="user-mgmt-col-actions">Hành động</div>
                        </div>

                        {/* Table Body */}
                        {loading ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                                <p>Đang tải người dùng...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}>
                                    search_off
                                </span>
                                <p>Không tìm thấy người dùng nào</p>
                            </div>
                        ) : (
                            <div className="user-mgmt-table-body">
                                {users.map((user) => (
                                    <div key={user.userid} className="user-mgmt-row" onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
                                        <div className="user-mgmt-col-identity">
                                            <div className="user-mgmt-user-identity">
                                                <img
                                                    className="user-mgmt-avatar"
                                                    src={user.avatarurl}
                                                    alt={user.fullname}
                                                />
                                                <div className="user-mgmt-user-info">
                                                    <span className="user-mgmt-user-name">{user.fullname}</span>
                                                    <span className="user-mgmt-user-email">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="user-mgmt-col-role">
                                            <span
                                                className={`user-mgmt-badge ${user.primaryrole === 'tutor'
                                                    ? 'user-mgmt-badge-tutor'
                                                    : user.primaryrole === 'admin'
                                                        ? 'user-mgmt-badge-admin'
                                                        : 'user-mgmt-badge-student'
                                                    }`}
                                            >
                                                {user.primaryrole === 'tutor' ? 'Gia sư' : user.primaryrole === 'admin' ? 'Quản trị' : 'Học viên'}
                                            </span>
                                        </div>
                                        <div className="user-mgmt-col-date">
                                            {new Date(user.createdat).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="user-mgmt-col-performance">
                                            {user.warningcount > 0 ? (
                                                <div className="user-mgmt-performance">
                                                    <span className="material-symbols-outlined user-mgmt-warning icon-filled">warning</span>
                                                    <span className="user-mgmt-warning-text">{user.warningcount} Cảnh cáo</span>
                                                </div>
                                            ) : user.suspensioncount > 0 ? (
                                                <div className="user-mgmt-performance">
                                                    <span className="material-symbols-outlined user-mgmt-flag icon-filled">flag</span>
                                                    <span className="user-mgmt-flags">{user.suspensioncount} lần tạm ngưng</span>
                                                </div>
                                            ) : (
                                                <span className="user-mgmt-no-data">Tốt</span>
                                            )}
                                        </div>
                                        <div className="user-mgmt-col-status">
                                            <span className={`user-mgmt-status ${getStatusClass(user.accountstatus)}`}>
                                                {user.accountstatus === 'active'
                                                    ? 'Hoạt động'
                                                    : user.accountstatus === 'suspended'
                                                        ? 'Tạm ngưng'
                                                        : 'Bị chặn'}
                                            </span>
                                        </div>
                                        <div className="user-mgmt-col-actions">
                                            <button
                                                className="user-mgmt-action-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUserClick(user);
                                                }}
                                            >
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && users.length > 0 && (
                            <div className="user-mgmt-pagination">
                                <span className="user-mgmt-pagination-info">
                                    Hiển thị {(page - 1) * limit + 1}-{Math.min(page * limit, total)} trong số{' '}
                                    {total} người dùng
                                </span>
                                <div className="user-mgmt-pagination-controls">
                                    <button
                                        className="user-mgmt-page-btn"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        style={{ opacity: page === 1 ? 0.5 : 1 }}
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>

                                    {/* Page numbers */}
                                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`user-mgmt-page-number ${page === pageNum ? 'user-mgmt-page-active' : ''}`}
                                                onClick={() => setPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    {totalPages > 5 && (
                                        <>
                                            <span className="user-mgmt-pagination-ellipsis">...</span>
                                            <button className="user-mgmt-page-number" onClick={() => setPage(totalPages)}>
                                                {totalPages}
                                            </button>
                                        </>
                                    )}

                                    <button
                                        className="user-mgmt-page-btn"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        style={{ opacity: page === totalPages ? 0.5 : 1 }}
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onBlockUser={() => setIsBlockModalOpen(true)}
                onUnblockUser={handleUnblockUser}
                onIssueWarning={() => setIsWarningModalOpen(true)}
                onSuspendUser={() => setIsSuspendModalOpen(true)}
                onResetPassword={handleResetPassword}
            />

            <BlockUserModal
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                user={selectedUser}
                onBlock={handleBlockUser}
            />

            <IssueWarningModal
                isOpen={isWarningModalOpen}
                onClose={() => setIsWarningModalOpen(false)}
                user={selectedUser}
                onIssue={handleIssueWarning}
            />

            <SuspendUserModal
                isOpen={isSuspendModalOpen}
                onClose={() => setIsSuspendModalOpen(false)}
                user={selectedUser}
                onSuspend={handleSuspendUser}
            />
        </>
    );
};

export default UserManagementPage;
