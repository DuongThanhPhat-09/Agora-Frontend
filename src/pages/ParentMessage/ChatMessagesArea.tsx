import styles from './styles.module.css';
import MessageBubble from './MessageBubble';
import SessionContextCard from './SessionContextCard';
import TypingIndicator from './TypingIndicator';
import type { ChatMessage } from '../../services/chat.service';

const tutorAvatarSmall = 'https://www.figma.com/api/mcp/asset/0ff4008a-fd18-4174-9e83-f377eb2a5123';

interface ChatMessagesAreaProps {
  messages: Array<ChatMessage>;
  loading: boolean;
  currentUserId: string | null;
}

const ChatMessagesArea = ({ messages, loading, currentUserId }: ChatMessagesAreaProps) => {
  if (loading) {
    return (
      <div className={styles.messagesArea}>
        <div className={styles.chatLoadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.chatLoadingText}>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={styles.messagesArea}>
        <div className={styles.chatEmptyState}>
          <p className={styles.emptyStateText}>No messages yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.messagesArea}>
      <SessionContextCard />
      <div className={styles.dateSeparator}>Today</div>
      {messages.map((msg) => {
        return (
          <MessageBubble
            key={msg.messageId}
            avatar={tutorAvatarSmall}
            message={msg.content}
            time={msg.createdAt}
            isSender={currentUserId ? msg.senderId === currentUserId : false}
          />
        );
      })}
      {/* <TypingIndicator /> */}
    </div>
  );
};

export default ChatMessagesArea;
