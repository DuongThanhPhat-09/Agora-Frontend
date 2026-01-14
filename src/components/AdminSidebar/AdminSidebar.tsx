import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/pages/admin-dashboard.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="admin-sidebar">
            <div>
                {/* Logo */}
                <div className="admin-sidebar-header">
                    <h1 className="admin-logo">AGORA</h1>
                    <p className="admin-subtitle">Cổng quản trị</p>
                </div>

                {/* Navigation */}
                <nav className="admin-nav">
                    <a
                        className={`admin-nav-item ${isActive('/admin-dashboard') ? 'admin-nav-item-active' : ''}`}
                        onClick={() => navigate('/admin-dashboard')}
                    >
                        <span className="material-symbols-outlined admin-nav-icon icon-filled">dashboard</span>
                        <span className="admin-nav-text">Bảng điều khiển</span>
                    </a>

                    <a
                        className={`admin-nav-item ${isActive('/admin-user-management') ? 'admin-nav-item-active' : ''}`}
                        onClick={() => navigate('/admin-user-management')}
                    >
                        <span className="material-symbols-outlined admin-nav-icon">group</span>
                        <span className="admin-nav-text">Quản lý người dùng</span>
                    </a>

                    <a
                        className={`admin-nav-item ${isActive('/admin-vetting') ? 'admin-nav-item-active' : ''}`}
                        onClick={() => navigate('/admin-vetting')}
                    >
                        <span className="material-symbols-outlined admin-nav-icon">description</span>
                        <span className="admin-nav-text">Yêu cầu kiểm duyệt</span>
                        <span className="admin-nav-badge">4</span>
                    </a>

                    <a
                        className={`admin-nav-item ${location.pathname.startsWith('/admin-disputes') ? 'admin-nav-item-active' : ''}`}
                        onClick={() => navigate('/admin-disputes')}
                    >
                        <span className="material-symbols-outlined admin-nav-icon">gavel</span>
                        <span className="admin-nav-text">Khiếu nại</span>
                        <span className="admin-nav-badge-alert">!</span>
                    </a>

                    <a
                        className={`admin-nav-item ${isActive('/admin-financials') ? 'admin-nav-item-active' : ''}`}
                        onClick={() => navigate('/admin-financials')}
                    >
                        <span className="material-symbols-outlined admin-nav-icon">account_balance</span>
                        <span className="admin-nav-text">Tài chính</span>
                    </a>

                    <a
                        className={`admin-nav-item ${isActive('/admin-settings') ? 'admin-nav-item-active' : ''}`}
                        onClick={() => navigate('/admin-settings')}
                    >
                        <span className="material-symbols-outlined admin-nav-icon">settings</span>
                        <span className="admin-nav-text">Cài đặt</span>
                    </a>
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="admin-sidebar-footer">
                <button className="admin-signout-btn">
                    <span className="material-symbols-outlined">logout</span>
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
