import { AdminSidebar } from '../../components/AdminSidebar';
import '../../styles/pages/admin-user-management.css';

const UserManagementPage = () => {
    return (
        <div className="admin-dashboard">
            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN CONTENT */}
            <main className="user-mgmt-main">
                {/* HEADER AREA */}
                <header className="user-mgmt-header">
                    {/* Breadcrumbs */}
                    <div className="user-mgmt-breadcrumbs">
                        <a href="#" className="breadcrumb-link">Trang chủ</a>
                        <span className="breadcrumb-separator">/</span>
                        <a href="#" className="breadcrumb-link">Quản trị</a>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">Danh sách người dùng</span>
                    </div>

                    {/* Page Title */}
                    <div className="user-mgmt-title-section">
                        <div>
                            <h2 className="user-mgmt-title">Danh sách người dùng</h2>
                            <p className="user-mgmt-subtitle">Quản lý tài khoản học viên và gia sư trên toàn nền tảng.</p>
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
                            />
                            <span className="material-symbols-outlined user-mgmt-search-icon">search</span>
                        </div>

                        {/* Filters Group */}
                        <div className="user-mgmt-filters">
                            {/* Role Dropdown */}
                            <div className="user-mgmt-filter-group">
                                <button className="user-mgmt-filter-btn">
                                    <span>Vai trò: Tất cả</span>
                                    <span className="material-symbols-outlined">expand_more</span>
                                </button>
                            </div>

                            {/* Status Dropdown */}
                            <div className="user-mgmt-filter-group">
                                <button className="user-mgmt-filter-btn">
                                    <span>Trạng thái: Tất cả</span>
                                    <span className="material-symbols-outlined">expand_more</span>
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="user-mgmt-divider"></div>

                        {/* Export Action */}
                        <button className="user-mgmt-export-btn">
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
                            <div className="user-mgmt-col-performance">Hiệu suất</div>
                            <div className="user-mgmt-col-status">Trạng thái</div>
                            <div className="user-mgmt-col-actions">Hành động</div>
                        </div>

                        {/* Table Body */}
                        <div className="user-mgmt-table-body">
                            {/* Row 1: Dr. Alistair Wright */}
                            <div className="user-mgmt-row">
                                <div className="user-mgmt-col-identity">
                                    <div className="user-mgmt-user-identity">
                                        <img
                                            className="user-mgmt-avatar"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiljTw_8is-lB9U4OJaeFx7xrRoF7kwxHoHKzm6LL3Ya_DMGG48NHDPhPKwPqQUXesZl9IV0cYqyQPfqXj8YlG_YXHG-fYrglmgBBG85OxPhxDN8oF-5SCXcWgNe2YzTC5jO-ojR0lr7w6yRn1d2xEds1ogN9hckvFFHdE-mJdQ6i2WEJp0wkYkDSCU6zQcbo--3ard1eM3ip-HJzJaXNqWI8cff7iCNb_tXUWUa3uniP0jLhXYEgd6YWWGK14Y3FSajccb_3Kx0Y"
                                            alt="Dr. Alistair Wright"
                                        />
                                        <div className="user-mgmt-user-info">
                                            <span className="user-mgmt-user-name">Dr. Alistair Wright</span>
                                            <span className="user-mgmt-user-email">alistair.w@agora.edu</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-role">
                                    <span className="user-mgmt-badge user-mgmt-badge-tutor">Gia sư cao cấp</span>
                                </div>
                                <div className="user-mgmt-col-date">10 Th1, 2023</div>
                                <div className="user-mgmt-col-performance">
                                    <div className="user-mgmt-performance">
                                        <span className="material-symbols-outlined user-mgmt-star icon-filled">star</span>
                                        <span className="user-mgmt-rating">4.9</span>
                                        <span className="user-mgmt-rating-max">/ 5.0</span>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-status">
                                    <span className="user-mgmt-status user-mgmt-status-active">Hoạt động</span>
                                </div>
                                <div className="user-mgmt-col-actions">
                                    <button className="user-mgmt-action-btn">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                            </div>

                            {/* Row 2: Sarah Jennings */}
                            <div className="user-mgmt-row">
                                <div className="user-mgmt-col-identity">
                                    <div className="user-mgmt-user-identity">
                                        <img
                                            className="user-mgmt-avatar user-mgmt-avatar-suspended"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJSiWVSd7brnAGYy_xiiyKvVvVOLOW0rBuz-XKEf4wRiPBOnczI50RLir8FQMPnvJ7VKh06YuugHVIzPBiaZW6sDmgtT8yKebi8vldCmgPJjh6oduQxAAFhPu2DVyHriKDPWcmQZ3naPu2KRoFutgO14arWLzT_kldqjPe6izVfjLwA6VRts1sJva3y9f7zsJgpdMIRWga0Y3fh30oECb0o_4MtaL4ZQuIYJG9HfCBmPiSRIB5wbSBQO8RqoxmXje4IIn6z094rNs"
                                            alt="Sarah Jennings"
                                        />
                                        <div className="user-mgmt-user-info">
                                            <span className="user-mgmt-user-name">Sarah Jennings</span>
                                            <span className="user-mgmt-user-email">s.jennings99@gmail.com</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-role">
                                    <span className="user-mgmt-badge user-mgmt-badge-student">Học viên</span>
                                </div>
                                <div className="user-mgmt-col-date">14 Th2, 2023</div>
                                <div className="user-mgmt-col-performance">
                                    <div className="user-mgmt-performance">
                                        <span className="material-symbols-outlined user-mgmt-flag icon-filled">flag</span>
                                        <span className="user-mgmt-flags">2 Cờ</span>
                                        <span className="user-mgmt-flags-detail">/ 1 Báo cáo</span>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-status">
                                    <span className="user-mgmt-status user-mgmt-status-suspended">Đình chỉ</span>
                                </div>
                                <div className="user-mgmt-col-actions">
                                    <button className="user-mgmt-action-btn">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                            </div>

                            {/* Row 3: James Miller */}
                            <div className="user-mgmt-row">
                                <div className="user-mgmt-col-identity">
                                    <div className="user-mgmt-user-identity">
                                        <div className="user-mgmt-avatar user-mgmt-avatar-initials">JM</div>
                                        <div className="user-mgmt-user-info">
                                            <span className="user-mgmt-user-name">James Miller</span>
                                            <span className="user-mgmt-user-email">j.miller.arch@yahoo.com</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-role">
                                    <span className="user-mgmt-badge user-mgmt-badge-student">Học viên</span>
                                </div>
                                <div className="user-mgmt-col-date">01 Th3, 2023</div>
                                <div className="user-mgmt-col-performance">
                                    <span className="user-mgmt-no-data">-</span>
                                </div>
                                <div className="user-mgmt-col-status">
                                    <span className="user-mgmt-status user-mgmt-status-pending">Đang chờ duyệt</span>
                                </div>
                                <div className="user-mgmt-col-actions">
                                    <button className="user-mgmt-action-btn">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                            </div>

                            {/* Row 4: Prof. Elena Rostova */}
                            <div className="user-mgmt-row">
                                <div className="user-mgmt-col-identity">
                                    <div className="user-mgmt-user-identity">
                                        <img
                                            className="user-mgmt-avatar"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ-RAFRcAs_e1yMz3kkrJTDBgTfmx8kEsZnRrnYfEzluw-rUM5JqvX74fGvrgX3Ct4QE5Ey9GhxpNRKoxG12h-4qG7DCh8BX4WBxqyOEatle3_5rKG3BgAlI0ttJX5C6_IpJO8YgfF3oVbfvcD6aQiXNGcNAvK5gUd3T0kYIfCf1_BtE7AHYmUfFTsI8fILz19-FEW0g9MqFZ-m9Ox2d1B-B8Yp51HMuMwkYK9A_dVn5FvJyc22E9qIth73gO7c5hZV0WwLWqrafM"
                                            alt="Prof. Elena Rostova"
                                        />
                                        <div className="user-mgmt-user-info">
                                            <span className="user-mgmt-user-name">Prof. Elena Rostova</span>
                                            <span className="user-mgmt-user-email">e.rostova@agora.edu</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-role">
                                    <span className="user-mgmt-badge user-mgmt-badge-tutor">Gia sư</span>
                                </div>
                                <div className="user-mgmt-col-date">22 Th11, 2022</div>
                                <div className="user-mgmt-col-performance">
                                    <div className="user-mgmt-performance">
                                        <span className="material-symbols-outlined user-mgmt-star icon-filled">star</span>
                                        <span className="user-mgmt-rating">5.0</span>
                                        <span className="user-mgmt-rating-max">/ 5.0</span>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-status">
                                    <span className="user-mgmt-status user-mgmt-status-active">Hoạt động</span>
                                </div>
                                <div className="user-mgmt-col-actions">
                                    <button className="user-mgmt-action-btn">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                            </div>

                            {/* Row 5: Marcus Chen */}
                            <div className="user-mgmt-row">
                                <div className="user-mgmt-col-identity">
                                    <div className="user-mgmt-user-identity">
                                        <img
                                            className="user-mgmt-avatar"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS-KdW0x3aTvObVDyrBjsvmK6ycae4xMs1XGkQjQFuLzanLZJR6SkT0DEBnIhkidIturoNAtTfuQ-iXr7jeUsobVb5qqSeAg8wEd5hHiZL82_AZXfBHcrabLLjFEZSL0AOi6v6mkhzG6Sz6Htdsk0kIFxvzgMmqBFTy4yi4zrQWR0iFD2EZqHUPVoAKvqdennTFxuf10IROle6gy6BXTPM8zl0jreBgfv6--ArCCNnB0_KfOuXYSzl_J7YETKSWDBrW_ApueksZHU"
                                            alt="Marcus Chen"
                                        />
                                        <div className="user-mgmt-user-info">
                                            <span className="user-mgmt-user-name">Marcus Chen</span>
                                            <span className="user-mgmt-user-email">marcus.chen@student.agora.edu</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-role">
                                    <span className="user-mgmt-badge user-mgmt-badge-student">Học viên</span>
                                </div>
                                <div className="user-mgmt-col-date">05 Th4, 2023</div>
                                <div className="user-mgmt-col-performance">
                                    <div className="user-mgmt-performance">
                                        <span className="material-symbols-outlined user-mgmt-star icon-filled">star</span>
                                        <span className="user-mgmt-rating">4.8</span>
                                        <span className="user-mgmt-rating-max">/ 5.0</span>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-status">
                                    <span className="user-mgmt-status user-mgmt-status-active">Hoạt động</span>
                                </div>
                                <div className="user-mgmt-col-actions">
                                    <button className="user-mgmt-action-btn">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                            </div>

                            {/* Row 6: Emily Watson */}
                            <div className="user-mgmt-row">
                                <div className="user-mgmt-col-identity">
                                    <div className="user-mgmt-user-identity">
                                        <img
                                            className="user-mgmt-avatar"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuANPf-lu2J3H1JnK7BSTwNq6rj6P37I9hETdQX_xvX06RXuVhwqgUSfkixN1wQ2Mds7nwPsHf023Ew216PRb1io-wnE5iU6-lUMdskRrrZOS9m061hXGBbwFixMi34K0_wS_w4pbfbo5He2LjKqt-IiBR3QcGHJG1lXsbjl9HevZfcUMRfWKWhL_hRr5SxlSiKEMU3twATr6M8onWcTTHhepVASSOPr55DN09sRfqu1mlw6bdMJL4sL0qfvMh_rCG3j4maKnA0zLHk"
                                            alt="Emily Watson"
                                        />
                                        <div className="user-mgmt-user-info">
                                            <span className="user-mgmt-user-name">Emily Watson</span>
                                            <span className="user-mgmt-user-email">emily.w@agora.edu</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-role">
                                    <span className="user-mgmt-badge user-mgmt-badge-student">Học viên</span>
                                </div>
                                <div className="user-mgmt-col-date">12 Th5, 2023</div>
                                <div className="user-mgmt-col-performance">
                                    <div className="user-mgmt-performance">
                                        <span className="material-symbols-outlined user-mgmt-warning icon-filled">warning</span>
                                        <span className="user-mgmt-warning-text">1 Cảnh cáo</span>
                                    </div>
                                </div>
                                <div className="user-mgmt-col-status">
                                    <span className="user-mgmt-status user-mgmt-status-probation">Thử thách</span>
                                </div>
                                <div className="user-mgmt-col-actions">
                                    <button className="user-mgmt-action-btn">
                                        <span className="material-symbols-outlined">more_horiz</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="user-mgmt-pagination">
                            <span className="user-mgmt-pagination-info">Hiển thị 1-6 trong số 248 người dùng</span>
                            <div className="user-mgmt-pagination-controls">
                                <button className="user-mgmt-page-btn">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <span className="user-mgmt-page-number user-mgmt-page-active">1</span>
                                <button className="user-mgmt-page-number">2</button>
                                <button className="user-mgmt-page-number">3</button>
                                <span className="user-mgmt-pagination-ellipsis">...</span>
                                <button className="user-mgmt-page-number">12</button>
                                <button className="user-mgmt-page-btn">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserManagementPage;
