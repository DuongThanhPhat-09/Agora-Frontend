import styles from './styles.module.css';
import MessageBubble from './MessageBubble';
import type { ChatMessage } from '../../services/chat.service';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import BookingRequestCard from '../../components/BookingRequestCard/BookingRequestCard';

const tutorAvatarSmall = 'https://www.figma.com/api/mcp/asset/0ff4008a-fd18-4174-9e83-f377eb2a5123';

interface ChatMessagesAreaProps {
  messages: Array<ChatMessage>;
  loading: boolean;
  currentUserId: string | null;
  loadMessages: (query?: { page: number; pageSize: number }) => Promise<void>;
  hasMore: boolean;
  isTutor?: boolean;
}

const ChatMessagesArea = ({ messages, loading, currentUserId, hasMore, loadMessages, isTutor = false }: ChatMessagesAreaProps) => {
  const [page, setPage] = useState(1);
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

  const getMessages = async () => {
    await loadMessages({ page: page + 1, pageSize: 10 });
    setPage((prev) => prev + 1);
  };

  return (
    <div
      id="top-chat-div"
      className={styles.messagesArea}
      style={{
        height: 300,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={getMessages}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        inverse={true} //
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-6!">
            <Loader2 size={32} className={styles.sendingSpinner} />
          </div>
        }
        scrollableTarget="top-chat-div"
      >
        {messages.map((msg, index) => {
          if (msg.messageType === 'booking_request') {
            return (
              <div key={index} className={styles.systemMessageContainer}>
                <BookingRequestCard
                  message={msg}
                  isTutor={isTutor}
                />
              </div>
            );
          }

          return (
            <MessageBubble
              key={index}
              avatar={tutorAvatarSmall}
              message={msg.content}
              time={msg.createdAt}
              isSender={currentUserId ? msg.senderId === currentUserId : false}
            />
          );
        })}
      </InfiniteScroll>
      {/* <TypingIndicator /> */}
    </div>
  );
};

export default ChatMessagesArea;
