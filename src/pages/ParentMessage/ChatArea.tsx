import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import ChatHeader from './ChatHeader';
import ChatMessagesArea from './ChatMessagesArea';
import MessageComposer from './MessageComposer';
import QuickTemplates from './QuickTemplates';
import { getChatMessages, type ChatMessage } from '../../services/chat.service';

interface ChatAreaProps {
  selectedChannelId: number | null;
}

const ChatArea = ({ selectedChannelId }: ChatAreaProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedChannelId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        // TODO: Fetch messages từ API theo selectedChannelId
        // const response = await getChatMessages(selectedChannelId);
        console.log('Fetching messages for channel:', selectedChannelId);

        // Giả lập delay để hiển thị loading
        const { content } = await getChatMessages(selectedChannelId);

        // Set mock data (sau này sẽ thay bằng API data)
        setMessages(content);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChannelId]);

  // Nếu không có channel nào được chọn, hiển thị empty state
  if (!selectedChannelId) {
    return (
      <section className={styles.chatArea}>
        <div className={styles.chatEmptyState}>
          <p className={styles.emptyStateText}>Select a conversation to start chatting</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.chatArea}>
      <ChatHeader selectedChannelId={selectedChannelId} />
      <ChatMessagesArea messages={messages} loading={loading} />
      <div className={styles.chatFooter}>
        <QuickTemplates />
        <MessageComposer />
      </div>
    </section>
  );
};

export default ChatArea;
