import React from 'react';
import '../../styles/pages/tutor-wallet.css';

const TutorWalletPage: React.FC = () => {
    return (
        <div className="wallet-content">
            {/* Asset Cards */}
            <div className="asset-cards">
                {/* Available Balance Card */}
                <div className="asset-card asset-card-green">
                    <div className="asset-header">
                        <div className="asset-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" />
                            </svg>
                        </div>
                        <div className="asset-info">
                            <p className="asset-label">Số dư khả dụng</p>
                            <p className="asset-subtitle">Có thể rút ngay</p>
                        </div>
                    </div>
                    <p className="asset-amount">3.500.000 ₫</p>
                    <button className="asset-button asset-button-primary">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3L3 9H7V17H13V9H17L10 3Z" />
                        </svg>
                        RÚT TIỀN
                    </button>
                </div>

                {/* Escrow Card */}
                <div className="asset-card asset-card-yellow">
                    <div className="asset-header">
                        <div className="asset-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                <path d="M2 17L12 22L22 17" />
                                <path d="M2 12L12 17L22 12" />
                            </svg>
                        </div>
                        <div className="asset-info">
                            <p className="asset-label">Đang giữ (Escrow)</p>
                            <p className="asset-subtitle">Chờ hoàn thành buổi học</p>
                        </div>
                    </div>
                    <p className="asset-amount">1.200.000 ₫</p>
                    <button className="asset-button asset-button-secondary">
                        Xem chi tiết →
                    </button>
                </div>

                {/* Credits Card */}
                <div className="asset-card asset-card-purple">
                    <div className="asset-header">
                        <div className="asset-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                            </svg>
                        </div>
                        <div className="asset-info">
                            <p className="asset-label">Tín dụng (Credits)</p>
                            <p className="asset-subtitle">Đổi quà / Mua gói</p>
                        </div>
                    </div>
                    <p className="asset-amount">150</p>
                    <button className="asset-button asset-button-secondary">
                        Đổi thưởng →
                    </button>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="wallet-bottom">
                {/* Bank Account Card */}
                <div className="bank-account-card">
                    <h3 className="section-title">Tài khoản nhận tiền</h3>

                    <div className="bank-account-info">
                        <div className="bank-header">
                            <div className="bank-logo">VCB</div>
                            <div className="bank-details">
                                <p className="bank-name">Vietcombank</p>
                                <p className="bank-full-name">Ngân hàng TMCP Ngoại Thương VN</p>
                            </div>
                            <div className="verified-badge">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M13.485 2.343a1 1 0 011.415 1.415l-8 8a1 1 0 01-1.415 0l-3-3a1 1 0 011.415-1.415L6 9.657l7.485-7.314z" />
                                </svg>
                                <span>Đã xác thực</span>
                            </div>
                        </div>

                        <div className="account-details">
                            <div className="account-row">
                                <span className="account-label">Số tài khoản</span>
                                <span className="account-value">**** **** 8888</span>
                            </div>
                            <div className="account-row">
                                <span className="account-label">Tên chủ tài khoản</span>
                                <span className="account-value">NGUYEN VAN A</span>
                            </div>
                        </div>
                    </div>

                    <button className="add-account-button">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9H9V4C9 3.44772 9.44772 3 10 3Z" />
                        </svg>
                        Thêm tài khoản
                    </button>
                </div>

                {/* Tax Info Card */}
                <div className="tax-info-card">
                    <h3 className="section-title">Thuế TNCN ước tính</h3>

                    <div className="tax-content">
                        <div className="tax-stat">
                            <p className="tax-label">Thu nhập chịu thuế (tháng này)</p>
                            <p className="tax-amount">45.000.000 ₫</p>
                        </div>

                        <div className="tax-stat">
                            <p className="tax-label">Thuế phải đóng ước tính</p>
                            <p className="tax-amount tax-amount-highlight">0 ₫</p>
                            <p className="tax-note">Theo biểu thuế lũy tiến</p>
                        </div>

                        <div className="tax-report">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 3H17V17H3V3Z" />
                            </svg>
                            <div>
                                <p className="report-label">Báo cáo chi tiết</p>
                                <p className="report-subtitle">Xem phân tích đầy đủ</p>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade Overlay */}
                    <div className="upgrade-overlay">
                        <div className="upgrade-content">
                            <div className="upgrade-icon">🔒</div>
                            <h4 className="upgrade-heading">Nâng cấp để mở khóa</h4>
                            <p className="upgrade-description">
                                Gói Unlimited cung cấp công cụ tính thuế tự động<br />
                                và báo cáo tài chính chi tiết
                            </p>
                            <button className="upgrade-pro-button">👑 Nâng cấp ngay</button>
                            <p className="upgrade-price">Chỉ từ 99.000đ/tháng</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="transaction-history">
                <h3 className="section-title">Lịch sử Giao dịch</h3>

                {/* Filters */}
                <div className="transaction-filters">
                    <select className="time-filter">
                        <option>Tuần này</option>
                        <option>Tháng này</option>
                        <option>Quý này</option>
                        <option>Năm này</option>
                    </select>

                    <div className="type-filters">
                        <button className="filter-btn filter-btn-active">Tất cả</button>
                        <button className="filter-btn">Nhận tiền</button>
                        <button className="filter-btn">Rút tiền</button>
                        <button className="filter-btn">Phí sàn</button>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="transaction-table">
                    <div className="table-header">
                        <div className="table-row">
                            <div className="table-cell header-cell">LOẠI</div>
                            <div className="table-cell header-cell">NỘI DUNG</div>
                            <div className="table-cell header-cell">THỜI GIAN</div>
                            <div className="table-cell header-cell text-right">SỐ TIỀN</div>
                            <div className="table-cell header-cell text-center">TRẠNG THÁI</div>
                        </div>
                    </div>

                    <div className="table-body">
                        {/* Transaction Row 1 */}
                        <div className="table-row">
                            <div className="table-cell">
                                <div className="transaction-icon">📚</div>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-description">Thù lao: Toán 9 - Buổi 12 (Em Tuấn)</p>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-date">20/10/2023</p>
                                <p className="transaction-time">10:30</p>
                            </div>
                            <div className="table-cell text-right">
                                <p className="transaction-amount amount-positive">+ 190.000 ₫</p>
                            </div>
                            <div className="table-cell text-center">
                                <span className="status-badge status-completed">Hoàn tất</span>
                            </div>
                        </div>

                        {/* Transaction Row 2 */}
                        <div className="table-row">
                            <div className="table-cell">
                                <div className="transaction-icon">🔬</div>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-description">Thù lao: Lý 10 - Buổi 4</p>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-date">22/10/2023</p>
                                <p className="transaction-time">14:00</p>
                            </div>
                            <div className="table-cell text-right">
                                <p className="transaction-amount amount-neutral">200.000 ₫</p>
                            </div>
                            <div className="table-cell text-center">
                                <span className="status-badge status-processing">Đang xử lý</span>
                            </div>
                        </div>

                        {/* Transaction Row 3 */}
                        <div className="table-row">
                            <div className="table-cell">
                                <div className="transaction-icon">💸</div>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-description">Rút tiền về Vietcombank</p>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-date">18/10/2023</p>
                                <p className="transaction-time">09:15</p>
                            </div>
                            <div className="table-cell text-right">
                                <p className="transaction-amount amount-negative">- 2.000.000 ₫</p>
                            </div>
                            <div className="table-cell text-center">
                                <span className="status-badge status-completed">Hoàn tất</span>
                            </div>
                        </div>

                        {/* Transaction Row 4 */}
                        <div className="table-row">
                            <div className="table-cell">
                                <div className="transaction-icon">⚗️</div>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-description">Thù lao: Hóa 11 - Buổi 8 (Em Minh An)</p>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-date">15/10/2023</p>
                                <p className="transaction-time">16:00</p>
                            </div>
                            <div className="table-cell text-right">
                                <p className="transaction-amount amount-positive">+ 250.000 ₫</p>
                            </div>
                            <div className="table-cell text-center">
                                <span className="status-badge status-completed">Hoàn tất</span>
                            </div>
                        </div>

                        {/* Transaction Row 5 */}
                        <div className="table-row">
                            <div className="table-cell">
                                <div className="transaction-icon">💰</div>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-description">Phí sàn AGORA (10%)</p>
                            </div>
                            <div className="table-cell">
                                <p className="transaction-date">15/10/2023</p>
                                <p className="transaction-time">16:01</p>
                            </div>
                            <div className="table-cell text-right">
                                <p className="transaction-amount amount-negative">- 25.000 ₫</p>
                            </div>
                            <div className="table-cell text-center">
                                <span className="status-badge status-completed">Hoàn tất</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="pagination">
                    <p className="pagination-info">Hiển thị 5 giao dịch</p>
                    <div className="pagination-buttons">
                        <button className="pagination-btn">Trước</button>
                        <button className="pagination-btn pagination-btn-active">1</button>
                        <button className="pagination-btn">2</button>
                        <button className="pagination-btn">Sau</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorWalletPage;

