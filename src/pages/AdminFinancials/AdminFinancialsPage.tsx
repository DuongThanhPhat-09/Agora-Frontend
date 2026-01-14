import { AdminSidebar } from '../../components/AdminSidebar';
import '../../styles/pages/admin-dashboard.css';
import '../../styles/pages/admin-financial.css';

const AdminFinancialsPage = () => {
    return (
        <div className="admin-dashboard">
            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN CONTENT */}
            <main className="admin-main">
                {/* FLOATING HEADER */}
                <header className="admin-header-container">
                    <div className="admin-header-glass">
                        <div className="flex flex-col gap-1">
                            <p className="admin-subtitle" style={{ color: 'var(--color-navy-60)', marginTop: 0 }}>Tổng quan</p>
                            <h1 className="admin-greeting-title" style={{ fontSize: '32px' }}>Tổng quan Tài chính</h1>
                        </div>

                        <div className="admin-header-actions">
                            <button className="admin-action-btn admin-action-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>calendar_today</span>
                                <span>Th10 2023</span>
                            </button>
                            <button className="admin-action-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-navy)', color: 'white' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                                <span>Xuất báo cáo</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE AREA */}
                <div className="admin-content">
                    <div className="admin-content-inner">

                        {/* KPI CARDS */}
                        <section className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {/* Card 1: Revenue */}
                            <div className="admin-stat-card">
                                <div className="admin-stat-header">
                                    <div className="admin-stat-icon admin-stat-icon-green">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                    <span className="admin-stat-badge bg-agora-green-5 text-agora-green">+12.5% so với tháng trước</span>
                                </div>
                                <div className="admin-stat-content">
                                    <p className="admin-stat-label">Doanh thu nền tảng (Tháng này)</p>
                                    <p className="admin-stat-value text-agora-green" style={{ marginTop: '4px' }}>$12,450.00</p>
                                </div>
                            </div>

                            {/* Card 2: Escrow */}
                            <div className="admin-stat-card">
                                <div className="admin-stat-header">
                                    <div className="admin-stat-icon admin-stat-icon-primary" style={{ backgroundColor: 'rgba(27, 34, 56, 0.1)', color: 'var(--color-navy)' }}>
                                        <span className="material-symbols-outlined">lock_clock</span>
                                    </div>
                                </div>
                                <div className="admin-stat-content">
                                    <p className="admin-stat-label">Tiền đang giữ</p>
                                    <p className="admin-stat-value" style={{ marginTop: '4px' }}>$4,200.00</p>
                                </div>
                            </div>

                            {/* Card 3: Withdrawal Requests */}
                            <div className="admin-stat-card" style={{ borderColor: 'rgba(212, 180, 131, 0.4)' }}>
                                <div className="withdrawal-card-decoration"></div>
                                <div className="admin-stat-header" style={{ position: 'relative', zIndex: 10 }}>
                                    <div className="admin-stat-icon bg-agora-gold-20 text-amber-700">
                                        <span className="material-symbols-outlined">priority_high</span>
                                    </div>
                                    <span className="admin-stat-badge bg-amber-50 text-amber-700">Cần xử lý</span>
                                </div>
                                <div className="admin-stat-content" style={{ position: 'relative', zIndex: 10 }}>
                                    <p className="admin-stat-label">Yêu cầu rút tiền</p>
                                    <p className="admin-stat-value" style={{ color: 'var(--color-gold)', marginTop: '4px' }}>$850.00</p>
                                </div>
                            </div>
                        </section>

                        {/* MAIN TABLE SECTION */}
                        <section className="admin-financial-table-section">
                            {/* Tabs */}
                            <div className="admin-tabs-container">
                                <button className="admin-tab-btn active">
                                    <span className="admin-tab-text">Yêu cầu rút tiền</span>
                                </button>
                                <button className="admin-tab-btn">
                                    <span className="admin-tab-text">Sổ cái giao dịch</span>
                                </button>
                                <button className="admin-tab-btn">
                                    <span className="admin-tab-text">Cài đặt hoa hồng</span>
                                </button>
                            </div>

                            {/* Table */}
                            <div className="admin-table-wrapper" style={{ padding: '16px' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th className="admin-table-th">Mã yêu cầu</th>
                                            <th className="admin-table-th">Thông tin gia sư</th>
                                            <th className="admin-table-th">Thông tin ngân hàng</th>
                                            <th className="admin-table-th">Số tiền</th>
                                            <th className="admin-table-th">Ngày yêu cầu</th>
                                            <th className="admin-table-th admin-table-th-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Row 1 */}
                                        <tr className="admin-table-row">
                                            <td className="admin-table-td">
                                                <span className="admin-status-badge bg-slate-50 text-slate-800 font-mono">#WD-992</span>
                                            </td>
                                            <td className="admin-table-td">
                                                <div className="admin-table-user">
                                                    <div className="admin-user-thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDI-YmjSx331niu75HJlIw9LJMth7qVRb1Si8eVKOe0gYAPTthYjHmogm6JKQ_pgUR8vQGciJprGIjWpnk5hi_Dvb3I-LVWIGHE89T1bLeZYmQxNDSTM9z_izWSG3ba3p7MvPL2bOzxruVUzETDSD0guMu9NWCFahWZTNAQlr5tH-VcFLx-q9aXGvC3LZWd7bkat-uWnfbHmTEBPD_nyRCtb45YrHS8D-mWvnhP-LXfgUQakeurVHSc3a-7QLzM7x8QWjGvLkNuqr8')" }}></div>
                                                    <div className="admin-user-details">
                                                        <p className="admin-user-name-text">Nguyen Van A</p>
                                                        <p className="admin-user-subtitle">Khoa Toán</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="admin-table-td">
                                                <div className="bank-details">
                                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-navy)' }}>account_balance</span>
                                                    <div className="bank-info">
                                                        <span className="bank-name">Vietcombank</span>
                                                        <span className="bank-account">**** 1234</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="admin-table-td">
                                                <span className="amount-text">$200.00</span>
                                            </td>
                                            <td className="admin-table-td">
                                                <span className="text-slate-600 font-medium text-sm">Hôm nay, 09:30 SA</span>
                                            </td>
                                            <td className="admin-table-td admin-table-td-right">
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button className="btn-reject">Từ chối</button>
                                                    <button className="btn-process">
                                                        <span className="material-symbols-outlined">check</span>
                                                        Xử lý thanh toán
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Row 2 */}
                                        <tr className="admin-table-row">
                                            <td className="admin-table-td">
                                                <span className="admin-status-badge bg-slate-50 text-slate-800 font-mono">#WD-991</span>
                                            </td>
                                            <td className="admin-table-td">
                                                <div className="admin-table-user">
                                                    <div className="admin-user-thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfz32ATF6j4EYMU4EU9u-wlrDY82lB8nPkzEdAmzwR-5zuYt5jyBqRd0bMOYsNCyyif-3tApntXBNNdm2wTJjojlM8H-EnQif5WKNxw2ECQSqpuXbV0jrfa3X90LXkp7CeW_JqG52bkg1AN8-9eY1Ffpjehbh3Cx4vSDLdT3oXWQPn634JIo2doT4su1evJBMPaTi_pbIWAa_EFRjG_y84d4hJZYUOVRAnm6nERP1sSMc6RhvFh6TeeLykvPzooCJhEhqqNJ-m-v8')" }}></div>
                                                    <div className="admin-user-details">
                                                        <p className="admin-user-name-text">Sarah Jenkins</p>
                                                        <p className="admin-user-subtitle">Văn học Anh</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="admin-table-td">
                                                <div className="bank-details">
                                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-navy)' }}>account_balance</span>
                                                    <div className="bank-info">
                                                        <span className="bank-name">Techcombank</span>
                                                        <span className="bank-account">**** 5678</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="admin-table-td">
                                                <span className="amount-text">$150.00</span>
                                            </td>
                                            <td className="admin-table-td">
                                                <span className="text-slate-600 font-medium text-sm">Hôm nay, 08:45 SA</span>
                                            </td>
                                            <td className="admin-table-td admin-table-td-right">
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button className="btn-reject">Từ chối</button>
                                                    <button className="btn-process">
                                                        <span className="material-symbols-outlined">check</span>
                                                        Xử lý thanh toán
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Row 3 */}
                                        <tr className="admin-table-row">
                                            <td className="admin-table-td">
                                                <span className="admin-status-badge bg-slate-50 text-slate-800 font-mono">#WD-990</span>
                                            </td>
                                            <td className="admin-table-td">
                                                <div className="admin-table-user">
                                                    <div className="admin-user-thumbnail" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5OI74H0dALG0GJrWMfCNjQWOit2HroMVAIHfzWtM_ff01rW_Dmlr3avm5Up3W8fcRGkp8xxqDlzWmrzgX-MB8Mbh6sMbJDTnu9AmHqJYeYzNpTbiq_H7qVzSItdY3ok6IVAkmPpVphXa25pVjpAHO6_VYwkLrVIX2oB_Kn0e2B58yj929OHLVFBtgdAesn9xb4-C-SkgFfFlkWDAwU_mCHiK-0DdDYx1AcRV6SYo5lLIuBshkjY76a4pe85zJL_QdLK-2bRHyka8')" }}></div>
                                                    <div className="admin-user-details">
                                                        <p className="admin-user-name-text">David Chen</p>
                                                        <p className="admin-user-subtitle">Khoa Vật lý</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="admin-table-td">
                                                <div className="bank-details">
                                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-navy)' }}>account_balance</span>
                                                    <div className="bank-info">
                                                        <span className="bank-name">Chase Bank</span>
                                                        <span className="bank-account">**** 9012</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="admin-table-td">
                                                <span className="amount-text">$500.00</span>
                                            </td>
                                            <td className="admin-table-td">
                                                <span className="text-slate-600 font-medium text-sm">Hôm qua, 04:20 CH</span>
                                            </td>
                                            <td className="admin-table-td admin-table-td-right">
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button className="btn-reject">Từ chối</button>
                                                    <button className="btn-process">
                                                        <span className="material-symbols-outlined">check</span>
                                                        Xử lý thanh toán
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* RECENT ACTIVITY LEDGER */}
                        <section className="admin-ledger-section">
                            <h2 className="admin-ledger-title">Sổ cái hoạt động gần đây</h2>
                            <div className="admin-ledger-grid">
                                {/* Ledger Item 1 */}
                                <div className="admin-ledger-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="admin-ledger-icon-wrapper bg-green-50 text-agora-green">
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="text-slate-800 font-bold text-sm">Đặt lớp học</span>
                                            <span className="text-slate-400 text-xs">#BK-8823 • 2 phút trước</span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-agora-green">+$50.00</span>
                                </div>

                                {/* Ledger Item 2 */}
                                <div className="admin-ledger-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="admin-ledger-icon-wrapper bg-slate-50 text-slate-800">
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>remove</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="text-slate-800 font-bold text-sm">Đã xử lý thanh toán</span>
                                            <span className="text-slate-400 text-xs">#WD-989 • 15 phút trước</span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-slate-800">-$75.00</span>
                                </div>

                                {/* Ledger Item 3 */}
                                <div className="admin-ledger-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="admin-ledger-icon-wrapper bg-green-50 text-agora-green">
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>percent</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="text-slate-800 font-bold text-sm">Hoa hồng nền tảng</span>
                                            <span className="text-slate-400 text-xs">#CM-112 • 1 giờ trước</span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-agora-green">+$5.00</span>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminFinancialsPage;
