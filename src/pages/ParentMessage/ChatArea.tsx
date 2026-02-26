import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './styles.module.css';
import ChatHeader from './ChatHeader';
import ChatMessagesArea from './ChatMessagesArea';
import MessageComposer from './MessageComposer';
import SessionContextCard from './SessionContextCard';
import { getChatMessages, type ChatMessage, type ChatChannel } from '../../services/chat.service';
import { getBookingById, type BookingResponseDTO } from '../../services/booking.service';
import { signalRService } from '../../services/signalr.service';
import { message } from 'antd';
import PaymentModal from '../../components/PaymentModal/PaymentModal';

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<number | null>(null);

  // Use refs to avoid stale closures in SignalR callback
  const selectedChannelIdRef = useRef<number | null>(selectedChannelId);
  const currentUserIdRef = useRef<string | null>(currentUserId);

  // Keep refs in sync
  useEffect(() => {
    selectedChannelIdRef.current = selectedChannelId;
  }, [selectedChannelId]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

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

          // Đăng ký nhận tin nhắn — dùng ref để luôn có giá trị mới nhất
          signalRService.onMessageReceived((data: any) => {
            console.log('📩 SignalR messageReceived:', data);
            const channelId = data.channelId || data.ChannelId;

            // So sánh với ref thay vì state để tránh stale closure
            if (channelId === selectedChannelIdRef.current) {
              const newMessage: ChatMessage = {
                messageId: data.messageId || data.MessageId,
                channelId: channelId,
                senderId: data.senderId || data.SenderId,
                content: data.content || data.Content,
                messageType: data.messageType || data.MessageType || 'text',
                createdAt: data.createdAt || data.CreatedAt,
                metadata: data.metadata || data.Metadata,
              };

              setMessages((prev) => {
                // Loại bỏ tin nhắn tạm (temp) nếu senderId trùng với user hiện tại
                // Temp messages có messageId = Date.now() (rất lớn)
                const senderId = newMessage.senderId;
                if (senderId === currentUserIdRef.current) {
                  // Tìm và xóa temp message có cùng content
                  const filtered = prev.filter(
                    (msg) => !(msg.messageId > 1000000000000 && msg.content === newMessage.content && msg.senderId === senderId)
                  );
                  return [newMessage, ...filtered];
                }
                return [newMessage, ...prev];
              });
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
    async (query: { page: number; pageSize: number } = { page: 1, pageSize: 50 }) => {
      if (!selectedChannelId) return;

      const response = await getChatMessages(selectedChannelId, query);
      const newMessages = response.content || [];
      setMessages((prev) => (query.page === 1 ? newMessages : [...prev, ...newMessages]));

      // Xác định hasMore: nếu số tin nhắn trả về < pageSize thì hết
      if (newMessages.length < query.pageSize) {
        setHasMore(false);
      }
    },
    [selectedChannelId],
  );

  // Lấy lịch sử tin nhắn từ API khi chọn channel
  useEffect(() => {
    if (!selectedChannelId) {
      setMessages([]);
      setHasMore(true);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setHasMore(true);
        await loadMessages({ page: 1, pageSize: 50 });
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

      // Tạo message để hiển thị ngay lập tức (optimistic update)
      const tempMessage: ChatMessage = {
        messageId: Date.now(), // ID tạm thời (> 1000000000000)
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

  const handleProceedToPayment = useCallback((bookingId: number) => {
    setSelectedBookingForPayment(bookingId);
    setShowPaymentModal(true);
  }, []);

  const handlePaymentSuccess = () => {
    message.success('Thanh toán thành công! Lớp học đang được thiết lập.');
    // Refresh booking details
    if (selectedChannel?.bookingId) {
      getBookingById(selectedChannel.bookingId).then(response => {
        if (response.statusCode === 200) {
          setBooking(response.content);
        }
      });
    }
    // Refresh messages to update UI cards
    loadMessages({ page: 1, pageSize: 50 });
  };

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
            onProceedToPayment={handleProceedToPayment}
          />
        </div>
      </div>
      <div className={styles.chatFooter}>
        <MessageComposer onSend={handleSendMessage} disabled={!signalRService.isConnected()} />
      </div>

      {showPaymentModal && selectedBookingForPayment && (
        <PaymentModal
          bookingId={selectedBookingForPayment}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </section>
  );
};

export default ChatArea;
