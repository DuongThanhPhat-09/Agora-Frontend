import { AdminSidebar } from '../../components/AdminSidebar';
import '../../styles/pages/admin-dashboard.css';
import '../../styles/pages/admin-vetting.css';

const AdminVettingPage = () => {
    // Sample data for tutors
    const tutors = [
        {
            id: 1,
            name: "Dr. Eleanor Vance",
            email: "e.vance@uni.edu",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAC-Y15tQcs2PNEQJWEqi5E0Mlac48WDdreuUzI74wnhqOeyoJTUtqw8VStAoqirwgCxjnIqkO3PMMrDsnw1iatus8xTTLSq_JvQdNtOjQ9BH06aQscXxOv7l-WGzNpwoN-Dpzk6_AR_2KW9h3CHYlExV_Cvkhe92c-v5svh8jIhIx6dRmMOPyXf5fAn_GCarcQWj_fz47JrT1ux0-v-9ehLcY-0uXOL_tv_9ZbIa5tMFbQ7TyE4mkW1a7AwkGvsyTGHm2wKTVB-sM",
            subjects: ["Vật lý", "Toán học"],
            submitted: "24 Th10, 2023"
        },
        {
            id: 2,
            name: "Marcus Thorne",
            email: "m.thorne@academy.org",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOvb7ii3bKUZQcZ9s44xVbMc74oWv7Q_1db0guuXCWDdFYkoXdFfJqwhA_gsWfrrbAOQLR90ytQ8D1LHDT86puG8fXFIFpT9-D-gCIAYZQBL0JluZEYfBiYyhXovvlYog874IJSM_s8Lbhfmmx6F5SqbJN6zW0GL6RFrE9AGDwNnB_K7GOiNhZSa6d4QtrOzSAQMOy1uLOZcWz6ZgUvd_5hHrq-tKvX80Ejth6uwPf8NotFvD2SRG_Np2Q-xnq56_YbyC_NERsPx8",
            subjects: ["Văn học", "Lịch sử", "+1"],
            submitted: "23 Th10, 2023"
        },
        {
            id: 3,
            name: "Sarah Chen",
            email: "s.chen@tech.edu",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwk0R0Zjz_o4Gufvi1O6X7Zf3E1BbCj_nFR1k7pCO2KPla1aIClEaOrrV0_pT1no68Y31xqZPBKTHcdCFVa2JVvdsdP-nr5BPXptwbwy5_QzLuOeOA7iq2pKH4ckUcy7wbHT7QbOEGjNUZeaLbXhif_HSudO46Ivszij53TVkMEMFAEfakXdiejsFOqps3Mp0elqEj4bzUvpeinCTsE0kTwULektMojagsY--slMOslqAznb_tUye88Xvn7D2n6SZyYRGSxjeyzb0",
            subjects: ["Khoa học máy tính"],
            submitted: "23 Th10, 2023"
        },
        {
            id: 4,
            name: "James Wilson",
            email: "j.wilson@edu.net",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwJ7TscjFc03c43hzCgeGuuPH_Rt4sdu4mZZ6vqZ0DGEnOs8Xp6Qtp9GY4WwH_RqKRhK3XgpdmM33cQ3Aycpr821qHsulDD2RFBFf_l35GaryYZ-7y04Q24cF9mxGDrYRpePLNV2SDfuxW6b7HqbXQxDnzAmHmpDN1Bwij7zPWGzuJLqbMbj807b2MRRBuhAIqEahehGXwbRUJvJks5mOocNP0AMslXws-dTXsj1jfPJCNBvMrCfCmOT3ev4jswNxpeQHQPaZm_PA",
            subjects: ["Hóa học", "Sinh học"],
            submitted: "22 Th10, 2023"
        },
        {
            id: 5,
            name: "Priya Patel",
            email: "p.patel@uni.ac.uk",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtm14j9Yd928xqqttR5DRr1cOIew7GT18T_3CjI8oThj6ZRVlXAto-ib7Lg00X65HANzxxqEH46_Rpe-jRik7MNWgcM4yeA3WX4TrLl3LFgFkBxrhzygDsE3tahio24z0TCjRrz3UAF8AbR8b6-xQQ0hYvESKqW2QaaIWacAq7U-4otXbNVCqYWbVadUI9imCksfR4OLwnxl_knlb8Z7znXBZJ1B8QVvhjpUpovTXZtVvAZcLEuPkMzn19zw9ORI75MnVL9XijRv8",
            subjects: ["Kinh tế học"],
            submitted: "22 Th10, 2023"
        },
        {
            id: 6,
            name: "David Kim",
            email: "d.kim@institute.org",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl1jcVWV0OZ5T2lz116J2bxcixi8a4PLisAKCy6Cahb6y8_MdMldkxzkdcs83YxWonp2YJGRS7YM6ZPf1cs2lgzpLlLUEIKE3ZN9QV1Kn1tqlmvlG42JyViR_H7p80zqOVOo8sBdgDxyNxQA45yugj-FP-oqRJi2UnULvE93VUpCDygewGp6e3iouseg0M54ndUGJnltsUq4LjLuB0G6DE-_qZHrxbdSddZjELrBl5Taq-uhBMfywUP-vvKC80qQMNs1WRNnmNUlo",
            subjects: ["Toán học", "Thống kê"],
            submitted: "21 Th10, 2023"
        }
    ];

    return (
        <div className="admin-dashboard admin-vetting-page">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="admin-main">
                {/* Header */}
                <header className="vetting-header">
                    <div className="vetting-breadcrumb">
                        <nav className="vetting-breadcrumb-nav">
                            <a href="#" className="vetting-breadcrumb-link">Trang chủ</a>
                            <span className="material-symbols-outlined vetting-breadcrumb-icon">chevron_right</span>
                            <span className="vetting-breadcrumb-current">Yêu cầu kiểm duyệt</span>
                        </nav>
                    </div>

                    <div className="vetting-header-actions">
                        {/* Search Bar */}
                        <div className="vetting-search-wrapper">
                            <span className="material-symbols-outlined vetting-search-icon">search</span>
                            <input
                                type="text"
                                className="vetting-search-input"
                                placeholder="Tìm kiếm yêu cầu..."
                            />
                        </div>

                        {/* User Section */}
                        <div className="vetting-header-user-section">
                            <button className="vetting-notification-btn">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="vetting-notification-badge"></span>
                            </button>

                            <div className="vetting-user-info-section">
                                <div className="vetting-user-text">
                                    <p className="vetting-user-name">Người quản trị</p>
                                    <p className="vetting-user-role">Quản trị viên cấp cao</p>
                                </div>
                                <div
                                    className="vetting-user-avatar"
                                    style={{
                                        backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuC-1RYfhalme733ZIn0tVRsiVY1817QURk7Tim5L85zB5bjBlGJ21emi8NFsm-9l5Z6hqh3440-iC35rtBZWIzcZk7DTLRCaKUCWi7ViBxoyoF8_YRUuYEjxWKsiO4PADl1W2NYdGrvOD3oenvyOVGW-TwbGB_PMvjYXpY09T7qT8OjD7ho64QWEwK79AphbmemPpZ9u6L_TTz0MZC2il-73WMLGSYRA0L6hyWJSFgdBpSNEfKEaMX1GqP4fUC4IDs1RvA88u462hw)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="vetting-content">
                    <div className="vetting-content-inner">
                        {/* Page Header */}
                        <div className="vetting-page-header">
                            <div className="vetting-page-title-section">
                                <h2 className="vetting-page-title">Hàng đợi xác minh gia sư</h2>
                                <p className="vetting-page-subtitle">Xem xét và quản lý các đơn đăng ký gia sư.</p>
                            </div>

                            <div className="vetting-actions">
                                <button className="vetting-btn vetting-btn-outline">
                                    <span className="material-symbols-outlined vetting-btn-icon">filter_list</span>
                                    Bộ lọc
                                </button>
                                <button className="vetting-btn vetting-btn-primary">
                                    <span className="material-symbols-outlined vetting-btn-icon">download</span>
                                    Xuất CSV
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="vetting-tabs">
                            <div className="vetting-tabs-nav">
                                <button className="vetting-tab vetting-tab-active">
                                    Đang chờ
                                    <span className="vetting-tab-count">12</span>
                                </button>
                                <button className="vetting-tab">
                                    Đã duyệt
                                </button>
                                <button className="vetting-tab">
                                    Đã từ chối
                                </button>
                            </div>
                        </div>

                        {/* Table Card */}
                        <div className="vetting-table-card">
                            <div className="vetting-table-wrapper">
                                <table className="vetting-table">
                                    <thead className="vetting-table-head">
                                        <tr>
                                            <th className="vetting-table-th">Thông tin gia sư</th>
                                            <th className="vetting-table-th">Môn học</th>
                                            <th className="vetting-table-th">Đã nộp</th>
                                            <th className="vetting-table-th">Trạng thái</th>
                                            <th className="vetting-table-th">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="vetting-table-body">
                                        {tutors.map((tutor) => (
                                            <tr key={tutor.id} className="vetting-table-row">
                                                <td className="vetting-table-td">
                                                    <div className="vetting-tutor-info">
                                                        <div
                                                            className="vetting-tutor-avatar"
                                                            style={{ backgroundImage: `url(${tutor.avatar})` }}
                                                        ></div>
                                                        <div className="vetting-tutor-details">
                                                            <div className="vetting-tutor-name">{tutor.name}</div>
                                                            <div className="vetting-tutor-email">{tutor.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="vetting-table-td">
                                                    <div className="vetting-subjects">
                                                        {tutor.subjects.map((subject, idx) => (
                                                            <span key={idx} className="vetting-subject-tag">
                                                                {subject}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="vetting-table-td vetting-date">
                                                    {tutor.submitted}
                                                </td>
                                                <td className="vetting-table-td">
                                                    <span className="vetting-status-badge">
                                                        <span className="vetting-status-dot"></span>
                                                        Chờ xem xét
                                                    </span>
                                                </td>
                                                <td className="vetting-table-td">
                                                    <button className="vetting-action-btn">
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="vetting-pagination">
                                <p className="vetting-pagination-info">Hiển thị 1-6 trong 12 yêu cầu</p>
                                <div className="vetting-pagination-controls">
                                    <button className="vetting-pagination-btn" disabled>
                                        <span className="material-symbols-outlined vetting-pagination-icon">arrow_back</span>
                                    </button>
                                    <button className="vetting-pagination-btn">
                                        <span className="material-symbols-outlined vetting-pagination-icon">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminVettingPage;

