interface Props {
    tutorName: string;
    bookingId: number | null;
    onClose: () => void;
}

const BookingSuccessOverlay: React.FC<Props> = ({ tutorName, bookingId, onClose }) => (
    <div className="bm-success-overlay">
        <div className="bm-success-content">
            <div className="bm-success-icon-wrapper">
                <div className="bm-success-icon">
                    <svg viewBox="0 0 52 52" className="bm-success-checkmark">
                        <circle className="bm-success-circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="bm-success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
            </div>
            <h3 className="bm-success-title">Đặt lịch thành công!</h3>
            <p className="bm-success-desc">
                Yêu cầu booking của bạn đã được gửi đến <strong>{tutorName}</strong>.
                Gia sư sẽ xác nhận trong thời gian sớm nhất.
            </p>
            {bookingId && (
                <div className="bm-success-booking-id">
                    Mã booking: <strong>#{bookingId}</strong>
                </div>
            )}
            <div className="bm-success-steps">
                <div className="bm-success-step">
                    <div className="bm-success-step-num">1</div>
                    <span>Gia sư xem xét yêu cầu</span>
                </div>
                <div className="bm-success-step">
                    <div className="bm-success-step-num">2</div>
                    <span>Xác nhận & thanh toán</span>
                </div>
                <div className="bm-success-step">
                    <div className="bm-success-step-num">3</div>
                    <span>Bắt đầu học!</span>
                </div>
            </div>
            <button className="bm-success-close-btn" onClick={onClose} type="button">
                Đóng
            </button>
        </div>
    </div>
);

export default BookingSuccessOverlay;
