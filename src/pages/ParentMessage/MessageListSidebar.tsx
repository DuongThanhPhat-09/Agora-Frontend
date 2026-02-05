import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import MessageInfoItem from './MessageInfoItem';
import MessageSearch from './MessageSearch';
import { getChats, type ChatChanel } from '../../services/chat.service';

interface MessageListSidebarProps {
    onChannelSelect: (channelId: number | null) => void;
    selectedChannelId: number | null;
}

// Helper function to format date/time
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // For older dates, show formatted date
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const MessageListSidebar = ({ onChannelSelect, selectedChannelId }: MessageListSidebarProps) => {
  const [channels, setChannels] = useState<ChatChanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleChannelClick = (channelId: number) => {
    onChannelSelect(channelId);
  };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getChats();
        if (response.statusCode === 200) {
          setChannels(response.content);
        }
      } catch (err) {
        console.error('Error fetching chat channels:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return (
    <aside className={styles.sidebar}>
      <MessageSearch />
      <div className={styles.messageList}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Loading messages...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()} type="button">
              Retry
            </button>
          </div>
        ) : channels.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyText}>No messages yet</p>
            <p className={styles.emptySubtext}>Start a conversation to see messages here</p>
          </div>
        ) : (
          channels.map((channel) => (
            <div key={channel.channelId} onClick={() => handleChannelClick(channel.channelId)}>
              <MessageInfoItem
                active={selectedChannelId === channel.channelId}
                avatar={channel.otherUserAvatarUrl || 'https://via.placeholder.com/48'}
                name={channel.otherUserName}
                preview={channel.lastMessagePreview || 'No messages yet'}
                role="Tutor"
                session={`Session #${channel.bookingId}`}
                timestamp={formatTimestamp(channel.lastMessageAt)}
              />
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default MessageListSidebar;
