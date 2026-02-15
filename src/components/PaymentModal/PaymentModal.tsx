import { useState, useEffect } from 'react';
import { X, Wallet, CreditCard, ExternalLink, Loader2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import styles from './PaymentModal.module.css';
import { getPaymentInfo, getPaymentStatus, payWithWallet, type PaymentInfoDTO } from '../../services/payment.service';
import { message as antMessage } from 'antd';

interface PaymentModalProps {
    bookingId: number;
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: () => void;
}

const PaymentModal = ({ bookingId, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) => {
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfoDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchPaymentInfo();
        }
    }, [isOpen, bookingId]);

    const fetchPaymentInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const info = await getPaymentInfo(bookingId);
            setPaymentInfo(info);
        } catch (err) {
            console.error('Failed to fetch payment info:', err);
            setError('Không thể tải thông tin thanh toán. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Poll for payment status every 5 seconds if modal is open and has info
    useEffect(() => {
        if (!isOpen || !paymentInfo || paymentInfo.status === 'PAID') return;

        const interval = setInterval(async () => {
            try {
                const statusData = await getPaymentStatus(bookingId);
                if (statusData.isPaid) {
                    clearInterval(interval);
                    antMessage.success('Thanh toán thành công!');
                    onPaymentSuccess();
                    onClose();
                }
            } catch (err) {
                console.error('Status check failed:', err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isOpen, paymentInfo, bookingId]);

    const handleWalletPayment = async () => {
        if (!paymentInfo?.canPayWithWallet) return;

        try {
            setPaying(true);
            await payWithWallet(bookingId);
            antMessage.success('Thanh toán bằng ví thành công!');
            onPaymentSuccess();
            onClose();
        } catch (err: any) {
            console.error('Wallet payment failed:', err);
            antMessage.error(err.response?.data?.message || 'Thanh toán thất bại.');
        } finally {
            setPaying(false);
        }
    };

    if (!isOpen) return null;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Hoàn tất thanh toán</h3>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.body}>
                    {loading ? (
                        <div className={styles.loaderContainer}>
                            <Loader2 className={styles.spinner} />
                            <p>Đang tải thông tin thanh toán...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.errorContainer}>
                            <AlertTriangle className={styles.errorIcon} />
                            <p>{error}</p>
                            <button onClick={fetchPaymentInfo} className={styles.retryBtn}>Thử lại</button>
                        </div>
                    ) : paymentInfo ? (
                        <>
                            <div className={styles.summaryBox}>
                                <div className={styles.summaryRow}>
                                    <span>Mã đơn hàng:</span>
                                    <strong>#{bookingId}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Tổng số tiền:</span>
                                    <strong className={styles.amount}>{formatCurrency(paymentInfo.amount)}</strong>
                                </div>
                                {paymentInfo.expiredAt && (
                                    <div className={styles.deadlineRow}>
                                        <Clock size={14} />
                                        <span>Hết hạn: {new Date(paymentInfo.expiredAt).toLocaleString('vi-VN')}</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.sectionTitle}>Chọn phương thức thanh toán</div>

                            <div className={styles.paymentOptions}>
                                {/* Option 1: Wallet */}
                                <div className={`${styles.optionCard} ${!paymentInfo.canPayWithWallet ? styles.disabled : ''}`}>
                                    <div className={styles.optionHeader}>
                                        <div className={styles.optionIconWrap}>
                                            <Wallet size={20} />
                                        </div>
                                        <div className={styles.optionInfo}>
                                            <div className={styles.optionName}>Thanh toán bằng ví</div>
                                            <div className={styles.walletBalance}>Số dư: {formatCurrency(paymentInfo.walletBalance)}</div>
                                        </div>
                                    </div>
                                    {!paymentInfo.canPayWithWallet ? (
                                        <div className={styles.insufficientText}>Số dư không đủ</div>
                                    ) : (
                                        <button
                                            className={styles.payBtn}
                                            onClick={handleWalletPayment}
                                            disabled={paying}
                                        >
                                            {paying ? 'Đang xử lý...' : 'Thanh toán ngay'}
                                        </button>
                                    )}
                                </div>

                                {/* Option 2: PayOS */}
                                <div className={styles.optionCard}>
                                    <div className={styles.optionHeader}>
                                        <div className={styles.optionIconWrap} style={{ background: '#eff6ff', color: '#2563eb' }}>
                                            <CreditCard size={20} />
                                        </div>
                                        <div className={styles.optionInfo}>
                                            <div className={styles.optionName}>Chuyển khoản ngân hàng (PayOS)</div>
                                            <div className={styles.payosSub}>Hỗ trợ tất cả ngân hàng</div>
                                        </div>
                                    </div>

                                    <div className={styles.qrSection}>
                                        <img src={paymentInfo.qrCode} alt="QR Code" className={styles.qrCode} />
                                        <div className={styles.qrInstructions}>
                                            <p>Quét mã QR để thanh toán nhanh</p>
                                            <div className={styles.bankStatus}>
                                                <div className={styles.pulse} />
                                                <span>Đang chờ thanh toán...</span>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={paymentInfo.checkoutUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.externalLink}
                                    >
                                        <span>Mở trang thanh toán PayOS</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                <div className={styles.footer}>
                    <div className={styles.secureInfo}>
                        <CheckCircle2 size={14} />
                        <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
