import styles from './styles.module.css';
import { LogOut } from 'lucide-react';
import type { ChatChannel } from '../../services/chat.service';
import type { BookingResponseDTO } from '../../services/booking.service';

const badgeAssigned = 'https://www.figma.com/api/mcp/asset/d7adf34e-7b26-4007-8282-2540aba0e56e';
const callIcon = 'https://www.figma.com/api/mcp/asset/e7357708-29a2-4580-956e-8751b3cafcbd';
const videoIcon = 'https://www.figma.com/api/mcp/asset/dbce7cb1-79c1-43f3-9c44-3b84b6c1bc06';
const moreIcon = 'https://www.figma.com/api/mcp/asset/4275581e-11bc-41b8-859c-6e795005d430';

interface ChatHeaderProps {
    selectedChannelId: number | null;
    onLeaveChannel: () => void;
    connectionState: string;
    channel?: ChatChannel | null;
    booking?: BookingResponseDTO | null;
}

const ChatHeader = ({ selectedChannelId, onLeaveChannel, connectionState, channel, booking }: ChatHeaderProps) => {
    if (!channel) return null;

    const isBookingRequest = channel.status === 'pending_tutor';

    return (
        <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
                <img alt="" className={styles.chatAvatar} src={channel.otherUserAvatarUrl || 'https://via.placeholder.com/40'} />
                <div className={styles.chatHeaderText}>
                    <div className={styles.chatHeaderTitleRow}>
                        <span className={styles.chatName}>{channel.otherUserName}</span>
                        <span className={styles.messageDot}>•</span>
                        <span className={styles.chatSession}>
                            {booking ? `${booking.subject?.subjectName || 'Booking'}` : `Session #${channel.bookingId}`}
                        </span>
                    </div>
                    <div className={styles.chatHeaderMetaRow}>
                        <span className={styles.chatRole}>
                            {isBookingRequest ? 'New Booking Request' : 'Tutor'} • {connectionState === 'connected' ? 'Online' : 'Offline'}
                        </span>
                        {!isBookingRequest && (
                            <span className={styles.messageBadge}>
                                <img alt="" className={styles.messageBadgeIcon} src={badgeAssigned} />
                                <span>Session Active</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.chatHeaderActions}>
                {!isBookingRequest && (
                    <>
                        <button className={styles.iconButton} type="button" title="Call">
                            <img alt="" src={callIcon} />
                        </button>
                        <button className={styles.iconButton} type="button" title="Video Call">
                            <img alt="" src={videoIcon} />
                        </button>
                    </>
                )}
                <button className={styles.iconButton} type="button" title="More Options">
                    <img alt="" src={moreIcon} />
                </button>
                <button
                    className={styles.leaveButton}
                    type="button"
                    onClick={onLeaveChannel}
                    disabled={!selectedChannelId}
                    title="Leave Channel"
                >
                    <LogOut size={16} />
                    <span>Leave</span>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
