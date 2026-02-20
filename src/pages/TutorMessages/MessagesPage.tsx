import React, { useState, useRef, useEffect } from 'react';
import '../../styles/pages/tutor-messages.css';
import { getChats, getChatMessages, type ChatChannel, type ChatMessage } from '../../services/chat.service';
import { signalRService } from '../../services/signalr.service';
import { getUserIdFromToken } from '../../services/auth.service';
import BookingRequestCard from '../../components/BookingRequestCard/BookingRequestCard';
import { message as antMessage } from 'antd';

const MessagesPage: React.FC = () => {
    const tutorId = getUserIdFromToken();

    // State management
    const [conversations, setConversations] = useState<ChatChannel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'offers'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [connectionState, setConnectionState] = useState<string>('disconnected');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Keep selectedChannel ref for SignalR callback
    const selectedChannelRef = useRef<ChatChannel | null>(null);
    useEffect(() => {
        selectedChannelRef.current = selectedChannel;
    }, [selectedChannel]);

    // SignalR Initialization
    useEffect(() => {
        let mounted = true;
        const initSignalR = async () => {
            try {
                await signalRService.connect();
                if (mounted) {
                    setConnectionState('connected');
                    signalRService.onMessageReceived((data: any) => {
                        console.log('📩 SignalR messageReceived:', data);
                        if (data?.channelId === selectedChannelRef.current?.channelId) {
                            const newMessage: ChatMessage = {
                                messageId: data.messageId || data.MessageId,
                                channelId: data.channelId || data.ChannelId,
                                senderId: data.senderId || data.SenderId,
                                content: data.content || data.Content,
                                messageType: data.messageType || data.MessageType,
                                createdAt: data.createdAt || data.CreatedAt,
                                metadata: data.metadata || data.Metadata,
                            };
                            setMessages((prev) => [...prev, newMessage]);
                            setTimeout(scrollToBottom, 50);
                        }
                    });
                }
            } catch (err) {
                console.error('SignalR connection error:', err);
                if (mounted) setConnectionState('error');
            }
        };
        initSignalR();
        return () => {
            mounted = false;
            // ❌ Không disconnect ở đây vì React StrictMode sẽ unmount/remount
            // và gây ra lỗi "connection stopped during negotiation"
        };
    }, []);

    // Load conversations from API
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoadingChannels(true);
                const res = await getChats();
                const list = Array.isArray(res?.content) ? res.content : [];
                setConversations(list);
                if (list.length > 0) setSelectedChannel(list[0]);
            } catch (err) {
                antMessage.error('Không thể tải danh sách hội thoại');
            } finally {
                setLoadingChannels(false);
            }
        };
        fetchConversations();
    }, []);

    // Load messages when channel is selected
    useEffect(() => {
        if (!selectedChannel) return;
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await getChatMessages(selectedChannel.channelId, { page: 1, pageSize: 50 });
                const msgs = Array.isArray(res?.content) ? res.content : [];
                // API returns newest first, UI wants oldest first
                setMessages([...msgs].reverse());

                try {
                    await signalRService.connect();
                    await signalRService.joinChannel(selectedChannel.channelId);
                } catch (err) {
                    console.error('❌ Failed to join channel:', err);
                }
            } catch (err) {
                antMessage.error('Không thể tải tin nhắn');
            } finally {
                setLoading(false);
                setTimeout(scrollToBottom, 300);
            }
        };
        fetchMessages();
    }, [selectedChannel]);

    // Filter conversations
    const filteredConversations = (conversations || []).filter((conv) => {
        if (searchQuery && !conv.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (activeFilter === 'offers' && conv.status !== 'pending') return false;
        return true;
    });

    // Event handlers
    const handleConversationClick = (channel: ChatChannel) => {
        setSelectedChannel(channel);
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChannel) return;
        const content = messageInput.trim();
        setMessageInput('');

        try {
            await signalRService.sendMessage(selectedChannel.channelId, content);
        } catch (err) {
            antMessage.error('Không thể gửi tin nhắn');
        }
    };

    const handleQuickReply = (text: string) => {
        setMessageInput(text);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getInitial = (name?: string) => name ? name.charAt(0).toUpperCase() : '?';

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return 'Hôm qua';
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const pendingCount = conversations.filter(c => c.status === 'pending').length;

    return (
        <div className="messages-content">
            <div className="messages-layout">
                {/* Conversation List */}
                <aside className="conversation-list">
                    <div className="conversation-list-header">
                        <h2 className="conversation-list-title">Hộp thư</h2>

                        {/* Filter Tabs */}
                        <div className="filter-tabs">
                            <button
                                className={`filter-tab ${activeFilter === 'all' ? 'filter-tab-active' : ''}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                Tất cả
                            </button>
                            <button
                                className={`filter-tab filter-tab-jobs ${activeFilter === 'offers' ? 'filter-tab-active' : ''}`}
                                onClick={() => setActiveFilter('offers')}
                            >
                                Booking mới
                                {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
                            </button>
                        </div>

                        {/* Search */}
                        <div className="conversation-search">
                            <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <input
                                type="text"
                                className="conversation-search-input"
                                placeholder="Tìm theo tên phụ huynh..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Conversation Items */}
                    <div className="conversation-items">
                        {loadingChannels ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                Đang tải...
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                {searchQuery ? 'Không tìm thấy hội thoại' : 'Chưa có hội thoại nào'}
                            </div>
                        ) : (
                            filteredConversations.map((conversation) => (
                                <div
                                    key={conversation.channelId}
                                    className={`conversation-item ${selectedChannel?.channelId === conversation.channelId ? 'conversation-item-active' : ''}`}
                                    onClick={() => handleConversationClick(conversation)}
                                >
                                    <div className="conversation-avatar">
                                        {conversation.otherUserAvatarUrl ? (
                                            <img
                                                src={conversation.otherUserAvatarUrl}
                                                alt={conversation.otherUserName}
                                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span className="avatar-text">{getInitial(conversation.otherUserName)}</span>
                                        )}
                                    </div>
                                    <div className="conversation-content">
                                        <div className="conversation-header">
                                            <h3 className="conversation-name">{conversation.otherUserName || 'Người dùng'}</h3>
                                            {conversation.status === 'pending' && <span className="offer-badge">MỚI</span>}
                                        </div>
                                        <div className="conversation-footer">
                                            <p className="conversation-preview">{conversation.lastMessagePreview || 'Chưa có tin nhắn'}</p>
                                        </div>
                                    </div>
                                    <span className="conversation-time">{formatTime(conversation.lastMessageAt)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* Chat Window */}
                <section className="chat-window">
                    {selectedChannel ? (
                        <>
                            {/* Chat Header */}
                            <div className="chat-header">
                                <div className="chat-user-info">
                                    <div className="chat-avatar">
                                        {selectedChannel.otherUserAvatarUrl ? (
                                            <img
                                                src={selectedChannel.otherUserAvatarUrl}
                                                alt={selectedChannel.otherUserName}
                                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span className="avatar-text">{getInitial(selectedChannel.otherUserName)}</span>
                                        )}
                                    </div>
                                    <div className="chat-user-details">
                                        <h2 className="chat-user-name">{selectedChannel.otherUserName || 'Người dùng'}</h2>
                                        <p className="chat-user-status">
                                            {connectionState === 'connected' ? '🟢 Đang kết nối' : '⚫ Offline'}
                                        </p>
                                    </div>
                                </div>

                                <div className="chat-actions">
                                    <button className="chat-action-btn" title="Thông tin">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="messages-area">
                                {loading ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                        Đang tải tin nhắn...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                                        Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isBookingRequest = msg.messageType?.toLowerCase() === 'booking_request';

                                        if (isBookingRequest) {
                                            return (
                                                <div key={msg.messageId} style={{ margin: '12px 0' }}>
                                                    <BookingRequestCard
                                                        message={{
                                                            content: msg.content,
                                                            senderId: msg.senderId,
                                                            createdAt: msg.createdAt,
                                                            metadata: msg.metadata
                                                        }}
                                                        isTutor={true}
                                                    />
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={msg.messageId}
                                                className={`message-bubble ${msg.senderId === tutorId ? 'message-sent' : 'message-received'}`}
                                            >
                                                <p className="message-text">{msg.content}</p>
                                                <span className="message-time">
                                                    {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="message-input-container">
                                <div className="quick-replies">
                                    <button className="quick-reply-btn" onClick={() => handleQuickReply('Tôi đồng ý')}>
                                        Tôi đồng ý
                                    </button>
                                    <button className="quick-reply-btn" onClick={() => handleQuickReply('Cảm ơn bạn')}>
                                        Cảm ơn bạn
                                    </button>
                                    <button className="quick-reply-btn" onClick={() => handleQuickReply('Để tôi xem lịch')}>
                                        Để tôi xem lịch
                                    </button>
                                </div>

                                <div className="message-input-wrapper">
                                    <input
                                        type="text"
                                        className="message-input"
                                        placeholder="Nhập tin nhắn..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <button className="send-btn" onClick={handleSendMessage} title="Gửi" disabled={!messageInput.trim()}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
                            {loadingChannels ? 'Đang tải...' : 'Chọn một cuộc trò chuyện để bắt đầu'}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default MessagesPage;
