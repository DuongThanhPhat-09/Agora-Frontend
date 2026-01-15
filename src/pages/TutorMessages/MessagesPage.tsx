import React, { useState } from 'react';
import '../../styles/pages/tutor-messages.css';

// Types
interface Conversation {
    id: string;
    name: string;
    avatar: string;
    preview: string;
    time: string;
    hasOffer: boolean;
    isUnread: boolean;
    isOnline: boolean;
}

interface Message {
    id: string;
    text: string;
    time: string;
    isSent: boolean;
}

const MessagesPage: React.FC = () => {
    // State management
    const [activeConversationId, setActiveConversationId] = useState('1');
    const [messageInput, setMessageInput] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'offers'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Sample conversations data
    const conversations: Conversation[] = [
        {
            id: '1',
            name: 'Phụ huynh bé Na',
            avatar: 'N',
            preview: '[Lời mời dạy] Tôi muốn mời bạn dạy môn Toán...',
            time: '10:30',
            hasOffer: true,
            isUnread: true,
            isOnline: true,
        },
        {
            id: '2',
            name: 'Mẹ cu Bin',
            avatar: 'B',
            preview: 'Hôm nay thầy cho cháu nghỉ sớm nhé...',
            time: 'Hôm qua',
            hasOffer: false,
            isUnread: false,
            isOnline: false,
        },
        {
            id: '3',
            name: 'Phụ huynh Minh An',
            avatar: 'M',
            preview: 'Cảm ơn thầy đã dạy rất tốt!',
            time: '2 ngày trước',
            hasOffer: false,
            isUnread: false,
            isOnline: false,
        },
        {
            id: '4',
            name: 'Ba Tuấn Anh',
            avatar: 'T',
            preview: '[Lời mời dạy] Mời thầy dạy Lý 10...',
            time: '3 ngày trước',
            hasOffer: true,
            isUnread: true,
            isOnline: false,
        },
    ];

    // Filter conversations
    const filteredConversations = conversations.filter((conv) => {
        // Filter by search query
        if (searchQuery && !conv.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Filter by active filter
        if (activeFilter === 'unread' && !conv.isUnread) return false;
        if (activeFilter === 'offers' && !conv.hasOffer) return false;

        return true;
    });

    // Get current conversation
    const currentConversation = conversations.find((c) => c.id === activeConversationId);

    // Sample messages for active conversation
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Xin chào thầy, tôi thấy hồ sơ của thầy rất phù hợp với nhu cầu của con tôi.',
            time: '10:25',
            isSent: false,
        },
    ]);

    // Event handlers
    const handleConversationClick = (conversationId: string) => {
        setActiveConversationId(conversationId);
        // In real app, load messages for this conversation
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: messageInput,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                isSent: true,
            };
            setMessages([...messages, newMessage]);
            setMessageInput('');
        }
    };

    const handleQuickReply = (text: string) => {
        setMessageInput(text);
    };

    const handleAcceptOffer = () => {
        alert('Đã chấp nhận lời mời dạy!');
        // In real app, send API request
    };

    const handleRejectOffer = () => {
        alert('Thương lượng hoặc từ chối lời mời');
        // In real app, open modal or navigate to negotiation page
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

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
                                className={`filter-tab ${activeFilter === 'unread' ? 'filter-tab-active' : ''}`}
                                onClick={() => setActiveFilter('unread')}
                            >
                                Chưa đọc
                            </button>
                            <button
                                className={`filter-tab filter-tab-jobs ${activeFilter === 'offers' ? 'filter-tab-active' : ''}`}
                                onClick={() => setActiveFilter('offers')}
                            >
                                Job Offers
                                <span className="tab-badge">2</span>
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
                        {filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`conversation-item ${activeConversationId === conversation.id ? 'conversation-item-active' : ''
                                    }`}
                                onClick={() => handleConversationClick(conversation.id)}
                            >
                                <div className="conversation-avatar">
                                    <span className="avatar-text">{conversation.avatar}</span>
                                    {conversation.isOnline && <span className="status-indicator status-online"></span>}
                                </div>
                                <div className="conversation-content">
                                    <div className="conversation-header">
                                        <h3 className="conversation-name">{conversation.name}</h3>
                                        {conversation.hasOffer && <span className="offer-badge">OFFER</span>}
                                    </div>
                                    <div className="conversation-footer">
                                        <p className="conversation-preview">{conversation.preview}</p>
                                        {conversation.isUnread && <span className="unread-dot"></span>}
                                    </div>
                                </div>
                                <span className="conversation-time">{conversation.time}</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Chat Window */}
                <section className="chat-window">
                    {/* Chat Header */}
                    <div className="chat-header">
                        <div className="chat-user-info">
                            <div className="chat-avatar">
                                <span className="avatar-text">{currentConversation?.avatar}</span>
                                {currentConversation?.isOnline && <span className="status-indicator status-online"></span>}
                            </div>
                            <div className="chat-user-details">
                                <h2 className="chat-user-name">{currentConversation?.name}</h2>
                                <p className="chat-user-status">
                                    {currentConversation?.isOnline ? '🟢 Đang hoạt động' : '⚫ Offline'}
                                </p>
                            </div>
                        </div>

                        <div className="chat-actions">
                            <button className="chat-action-btn" title="Gọi điện">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </button>
                            <button className="chat-action-btn" title="Video call">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                            </button>
                            <button className="chat-action-btn" title="Thông tin">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button className="chat-action-btn chat-action-menu" title="Menu">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="messages-area">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message-bubble ${message.isSent ? 'message-sent' : 'message-received'}`}
                            >
                                <p className="message-text">{message.text}</p>
                                <span className="message-time">{message.time}</span>
                            </div>
                        ))}

                        {/* Job Offer Card - Only show for conversation with offers */}
                        {currentConversation?.hasOffer && (
                            <div className="job-offer-card">
                                <div className="job-offer-header">
                                    <span className="job-offer-emoji">🎉</span>
                                    <h3 className="job-offer-title">Lời mời dạy mới</h3>
                                </div>

                                <div className="job-offer-details">
                                    <div className="job-detail-item">
                                        <div className="job-detail-icon job-icon-blue">
                                            <span>📚</span>
                                        </div>
                                        <div className="job-detail-content">
                                            <p className="job-detail-label">Môn học</p>
                                            <p className="job-detail-value">Toán 9</p>
                                        </div>
                                    </div>

                                    <div className="job-detail-item">
                                        <div className="job-detail-icon job-icon-student">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                            </svg>
                                        </div>
                                        <div className="job-detail-content">
                                            <p className="job-detail-label">Học sinh</p>
                                            <p className="job-detail-value">Lê Văn Tèo</p>
                                        </div>
                                    </div>

                                    <div className="job-detail-item">
                                        <div className="job-detail-icon job-icon-calendar">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="job-detail-content">
                                            <p className="job-detail-label">Lịch học</p>
                                            <p className="job-detail-value">T3, T5 (19:00 - 20:30)</p>
                                        </div>
                                    </div>

                                    <div className="job-salary-highlight">
                                        <div className="salary-content">
                                            <div className="job-detail-icon job-icon-money">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="job-detail-content">
                                                <p className="job-detail-label">Mức lương</p>
                                                <p className="salary-amount">
                                                    <strong>250.000 đ</strong>
                                                    <span className="salary-unit">/ buổi</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="job-offer-actions">
                                    <button className="job-btn job-btn-accept" onClick={handleAcceptOffer}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Chấp nhận ngay
                                    </button>
                                    <button className="job-btn job-btn-negotiate" onClick={handleRejectOffer}>
                                        Thương lượng / Từ chối
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="message-input-container">
                        <div className="quick-replies">
                            <button className="quick-reply-btn" onClick={() => handleQuickReply('Tôi đồng ý')}>
                                Tôi đồng ý
                            </button>
                            <button className="quick-reply-btn" onClick={() => handleQuickReply('Cảm ơn')}>
                                Cảm ơn
                            </button>
                            <button className="quick-reply-btn" onClick={() => handleQuickReply('Để tôi xem lịch')}>
                                Để tôi xem lịch
                            </button>
                        </div>

                        <div className="message-input-wrapper">
                            <button className="input-action-btn" title="Emoji">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                className="message-input"
                                placeholder="Nhập tin nhắn..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="send-btn" onClick={handleSendMessage} title="Gửi">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MessagesPage;
