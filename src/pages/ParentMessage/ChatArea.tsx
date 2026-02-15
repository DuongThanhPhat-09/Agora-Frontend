import { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import ChatHeader from './ChatHeader';
import ChatMessagesArea from './ChatMessagesArea';
import MessageComposer from './MessageComposer';
import SessionContextCard from './SessionContextCard';
import { getChatMessages, type ChatMessage, type ChatChannel } from '../../services/chat.service';
import { getBookingById, type BookingResponseDTO } from '../../services/booking.service';
import { signalRService } from '../../services/signalr.service';
import { message } from 'antd';

interface ChatAreaProps {
  selectedChannelId: number | null;
  currentUserId: string | null;
  selectedChannel?: ChatChannel | null;
  isTutor?: boolean;
}

const ChatArea = ({ selectedChannelId, currentUserId, selectedChannel, isTutor = false }: ChatAreaProps) => {
  const [hasMore, setHasMore] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [booking, setBooking] = useState<BookingResponseDTO | null>(null);

  // Fetch booking details when channel changes
  useEffect(() => {
    if (!selectedChannel?.bookingId) {
      setBooking(null);
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await getBookingById(selectedChannel.bookingId);
        if (response.statusCode === 200) {
          setBooking(response.content);
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
      }
    };

    fetchBooking();
  }, [selectedChannel?.bookingId]);

  // Kết nối SignalR khi component mount
  useEffect(() => {
    let mounted = true;

    const initSignalR = async () => {
      try {
        await signalRService.connect();
        if (mounted) {
          setConnectionState('connected');

          // Đăng ký nhận tin nhắn
          signalRService.onMessageReceived((data: any) => {
            console.log('📩 SignalR messageReceived:', data);
            // Thêm tin nhắn mới vào list (mới nhất ở đầu)
            if (data?.channelId === selectedChannelId) {
              const newMessage: ChatMessage = {
                messageId: data.messageId || data.MessageId,
                channelId: data.channelId || data.ChannelId,
                senderId: data.senderId || data.SenderId,
                content: data.content || data.Content,
                messageType: data.messageType || data.MessageType,
                createdAt: data.createdAt || data.CreatedAt,
                metadata: data.metadata || data.Metadata,
              };
              setMessages((prev) => [newMessage, ...prev]);
            }
          });
        }
      } catch (err) {
        console.error('SignalR connection error:', err);
        if (mounted) {
          setConnectionState('error');
          message.error('Failed to connect to chat server');
        }
      }
    };

    initSignalR();

    return () => {
      mounted = false;
      signalRService.offMessageReceived();
      signalRService.offUserJoined();
      signalRService.offUserLeft();
      signalRService.disconnect();
      setConnectionState('disconnected');
    };
  }, []);

  // Join channel khi selectedChannelId thay đổi
  useEffect(() => {
    const joinChannel = async () => {
      if (selectedChannelId && signalRService.isConnected()) {
        try {
          await signalRService.joinChannel(selectedChannelId);
          console.log(`✅ Joined channel ${selectedChannelId}`);
        } catch (err) {
          console.error('Error joining channel:', err);
          message.error('Failed to join chat channel');
        }
      }
    };

    joinChannel();
  }, [selectedChannelId]);

  const loadMessages = useCallback(
    async (query: { page: number; pageSize: number } = { page: 1, pageSize: 10 }) => {
      if (!selectedChannelId) return;

      const { content } = await getChatMessages(selectedChannelId, query);
      setMessages((prev) => [...prev, ...content]);
      if (content.length === 0) setHasMore(false);
    },
    [selectedChannelId],
  );

  // Lấy lịch sử tin nhắn từ API khi chọn channel
  useEffect(() => {
    if (!selectedChannelId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        await loadMessages({ page: 1, pageSize: 10 });
      } catch (err) {
        console.error('Error fetching messages:', err);
        message.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChannelId]);

  // Handler gửi tin nhắn - hiển thị message ngay lên đầu
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedChannelId || !content.trim()) {
        return;
      }

      // Tạo message để hiển thị ngay lập tức
      const tempMessage: ChatMessage = {
        messageId: Date.now(), // Tạo ID tạm thời
        channelId: selectedChannelId,
        senderId: currentUserId || '',
        content: content.trim(),
        messageType: 'text',
        createdAt: new Date().toISOString(),
      };

      // Hiển thị message ngay lên đầu
      setMessages((prev) => [tempMessage, ...prev]);

      try {
        await signalRService.sendMessage(selectedChannelId, content.trim());
        console.log(`✅ Sent message to channel ${selectedChannelId}:`, content);
      } catch (err) {
        console.error('Error sending message:', err);
        // Xóa message thất bại khỏi UI
        setMessages((prev) => prev.filter((msg) => msg.messageId !== tempMessage.messageId));
        message.error('Failed to send message');
      }
    },
    [selectedChannelId, currentUserId],
  );

  // Handler rời channel
  const handleLeaveChannel = useCallback(async () => {
    if (!selectedChannelId) return;

    try {
      await signalRService.leaveChannel(selectedChannelId);
      console.log(`✅ Left channel ${selectedChannelId}`);
      setMessages([]);
    } catch (err) {
      console.error('Error leaving channel:', err);
      message.error('Failed to leave chat channel');
    }
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
      <ChatHeader
        selectedChannelId={selectedChannelId}
        onLeaveChannel={handleLeaveChannel}
        connectionState={connectionState}
        channel={selectedChannel}
        booking={booking}
      />
      <div className={styles.messagesAreaContainer}>
        <div className={styles.messagesArea}>
          {booking && <SessionContextCard booking={booking} />}
          <ChatMessagesArea
            messages={messages}
            loading={loading}
            currentUserId={currentUserId}
            loadMessages={loadMessages}
            hasMore={hasMore}
            isTutor={isTutor}
          />
        </div>
      </div>
      <div className={styles.chatFooter}>
        {/* <QuickTemplates /> */}
        <MessageComposer onSend={handleSendMessage} disabled={!signalRService.isConnected()} />
      </div>
    </section>
  );
};

export default ChatArea;
