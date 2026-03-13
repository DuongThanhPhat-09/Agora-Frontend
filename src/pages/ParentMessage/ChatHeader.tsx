import styles from './styles.module.css';
import { ArrowLeft, Phone, Video, MoreVertical, CircleCheck } from 'lucide-react';
import type { ChatChannel } from '../../services/chat.service';
import type { BookingResponseDTO } from '../../services/booking.service';

interface ChatHeaderProps {
    selectedChannelId: number | null;
    onLeaveChannel: () => void;
    connectionState: string;
    channel?: ChatChannel | null;
    booking?: BookingResponseDTO | null;
    onBack?: () => void;
}

const ChatHeader = ({ selectedChannelId: _selectedChannelId, onLeaveChannel: _onLeaveChannel, connectionState, channel, booking, onBack }: ChatHeaderProps) => {
    if (!channel) return null;

    const isBookingRequest = channel.status === 'pending_tutor';

    return (
        <div className={styles.chatHeader}>
            {/* Mobile: top nav row with back + actions */}
            {onBack && (
                <div className={styles.chatHeaderNav}>
                    <button className={styles.backButton} type="button" onClick={onBack} title="Quay lại">
                        <ArrowLeft size={20} />
                    </button>
                    <div className={styles.chatHeaderNavActions}>
                        {!isBookingRequest && (
                            <>
                                <button className={styles.iconButton} type="button" title="Gọi điện">
                                    <Phone size={18} />
                                </button>
                                <button className={styles.iconButton} type="button" title="Gọi video">
                                    <Video size={18} />
                                </button>
                            </>
                        )}
                        <button className={styles.iconButton} type="button" title="Tùy chọn">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>
            )}
            {/* User info row */}
            <div className={styles.chatHeaderInfo}>
                <img alt="" className={styles.chatAvatar} src={channel.otherUserAvatarUrl || 'https://via.placeholder.com/40'} />
                <div className={styles.chatHeaderText}>
                    <div className={styles.chatHeaderTitleRow}>
                        <span className={styles.chatName}>{channel.otherUserName}</span>
                        <span className={styles.messageDot}>•</span>
                        <span className={styles.chatSession}>
                            {booking ? `${booking.subject?.subjectName || 'Đặt lịch'}` : (channel.bookingId ? `Buổi #${channel.bookingId}` : 'Tư vấn')}
                        </span>
                    </div>
                    <div className={styles.chatHeaderMetaRow}>
                        <span className={styles.chatRole}>
                            {isBookingRequest ? 'Yêu cầu đặt lịch mới' : 'Phụ huynh / Học sinh'} • {connectionState === 'connected' ? 'Trực tuyến' : 'Ngoại tuyến'}
                        </span>
                        {!isBookingRequest && (
                            <span className={styles.messageBadge}>
                                <CircleCheck size={10} />
                                <span>Đang hoạt động</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {/* Desktop: actions on the right (hidden on mobile since nav row handles it) */}
            <div className={styles.chatHeaderActions}>
                {!isBookingRequest && (
                    <>
                        <button className={styles.iconButton} type="button" title="Gọi điện">
                            <Phone size={18} />
                        </button>
                        <button className={styles.iconButton} type="button" title="Gọi video">
                            <Video size={18} />
                        </button>
                    </>
                )}
                <button className={styles.iconButton} type="button" title="Tùy chọn">
                    <MoreVertical size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
