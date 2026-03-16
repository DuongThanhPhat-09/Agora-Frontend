import styles from './styles.module.css';
import { ArrowLeft, Phone, Video, MoreVertical, CircleCheck, Search, X } from 'lucide-react';
import type { ChatChannel } from '../../services/chat.service';
import type { BookingResponseDTO } from '../../services/booking.service';

interface ChatHeaderProps {
    selectedChannelId: number | null;
    onLeaveChannel: () => void;
    connectionState: string;
    channel?: ChatChannel | null;
    booking?: BookingResponseDTO | null;
    onBack?: () => void;
    isSearchOpen?: boolean;
    onSearchToggle?: () => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

const ChatHeader = ({ selectedChannelId: _selectedChannelId, onLeaveChannel: _onLeaveChannel, connectionState, channel, booking, onBack, isSearchOpen, onSearchToggle, searchQuery, onSearchChange }: ChatHeaderProps) => {
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
                        <button className={styles.iconButton} type="button" title="Tìm kiếm" onClick={onSearchToggle}>
                            {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                        </button>
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
                {channel.otherUserAvatarUrl ? (
                    <img alt="" className={styles.chatAvatar} src={channel.otherUserAvatarUrl} />
                ) : (
                    <div className={styles.chatAvatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0d4c8', color: '#1a2238', fontWeight: 700, fontSize: '18px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                        {(channel.otherUserName || '?').charAt(0).toUpperCase()}
                    </div>
                )}
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
            {/* Search bar (visible when toggled) */}
            {isSearchOpen && (
                <div className={styles.chatSearchBar}>
                    <Search size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
                    <input
                        type="text"
                        className={styles.chatSearchInput}
                        placeholder="Tìm kiếm trong cuộc trò chuyện..."
                        value={searchQuery || ''}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        autoFocus
                    />
                    {searchQuery && (
                        <button
                            className={styles.chatSearchClear}
                            type="button"
                            onClick={() => onSearchChange?.('')}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            )}
            {/* Desktop: actions on the right (hidden on mobile since nav row handles it) */}
            <div className={styles.chatHeaderActions}>
                <button className={styles.iconButton} type="button" title="Tìm kiếm" onClick={onSearchToggle}>
                    {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                </button>
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
