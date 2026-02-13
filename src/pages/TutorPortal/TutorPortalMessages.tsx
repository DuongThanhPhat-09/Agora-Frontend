import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/pages/tutor-portal-messages.module.css';
import { getChats, getChatMessages, type ChatChanel, type ChatMessage } from '../../services/chat.service';
import { signalRService } from '../../services/signalr.service';
import BookingRequestCard from '../../components/BookingRequestCard/BookingRequestCard';
import { message as antMessage } from 'antd';

// Icons ... (keep existing icons)
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const UserIcon = () => (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
        <circle cx="10.5" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4.5 17.5C4.5 14.5 7 13 10.5 13C14 13 16.5 14.5 16.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const MoreOptionsIcon = () => (
    <svg width="17.5" height="17.5" viewBox="0 0 18 18" fill="currentColor">
        <circle cx="3" cy="9" r="1.5" />
        <circle cx="9" cy="9" r="1.5" />
        <circle cx="15" cy="9" r="1.5" />
    </svg>
);

const SmartReplyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3L14 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13 4V1H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 11L3 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

const SendIcon = () => (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="currentColor">
        <path d="M2 10.5L19 10.5M19 10.5L12 3.5M19 10.5L12 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const smartReplies = [
    "I'll review your homework and get back to you soon!",
    "Great progress today, keep up the good work!",
    "Are you available for a quick reschedule tomorrow?",
    "Let's focus on Chapter 4 in our next session.",
];

const TutorPortalMessages = () => {
    const tutorId = "USR-TUT-01"; // Should come from auth context
    const [conversations, setConversations] = useState<ChatChanel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<ChatChanel | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [connectionState, setConnectionState] = useState<string>('disconnected');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
                        if (data?.channelId === selectedChannel?.channelId) {
                            const newMessage: ChatMessage = {
                                messageId: data.messageId,
                                channelId: data.channelId,
                                senderId: data.senderId,
                                content: data.content,
                                messageType: data.messageType,
                                createdAt: data.createdAt,
                            };
                            setMessages((prev) => [...prev, newMessage]);
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
            signalRService.disconnect();
        };
    }, [selectedChannel]);

    // Initial Load - Conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await getChats();
                const list = Array.isArray(res?.content) ? res.content : [];
                setConversations(list);
                if (list.length > 0) setSelectedChannel(list[0]);
            } catch (err) {
                antMessage.error('Failed to load conversations');
            }
        };
        fetchConversations();
    }, []);

    // Load Messages for Selected Channel
    useEffect(() => {
        if (!selectedChannel) return;
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await getChatMessages(selectedChannel.channelId, { page: 1, pageSize: 50 });
                const msgs = Array.isArray(res?.content) ? res.content : [];
                // API returns new messages first, but UI wants them last
                setMessages([...msgs].reverse());
                await signalRService.joinChannel(selectedChannel.channelId);
            } catch (err) {
                antMessage.error('Failed to load messages');
            } finally {
                setLoading(false);
                setTimeout(scrollToBottom, 100);
            }
        };
        fetchMessages();
    }, [selectedChannel]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChannel) return;
        const content = messageInput.trim();
        setMessageInput('');

        try {
            await signalRService.sendMessage(selectedChannel.channelId, content);
        } catch (err) {
            antMessage.error('Failed to send message');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredConversations = (conversations || []).filter(conv =>
        conv.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div className={styles.messagesPage}>
            <aside className={styles.conversationsSidebar}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.sidebarTitle}>Messages</h1>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className={styles.searchIcon}><SearchIcon /></span>
                    </div>
                </div>

                <div className={styles.conversationsList}>
                    {filteredConversations.map((conversation) => (
                        <div
                            key={conversation.channelId}
                            className={`${styles.conversationItem} ${selectedChannel?.channelId === conversation.channelId ? styles.active : ''}`}
                            onClick={() => setSelectedChannel(conversation)}
                        >
                            <div className={styles.conversationAvatar}>
                                {conversation.otherUserAvatarUrl ? (
                                    <img src={conversation.otherUserAvatarUrl} alt={conversation.otherUserName} />
                                ) : <UserIcon />}
                            </div>
                            <div className={styles.conversationInfo}>
                                <div className={styles.conversationHeader}>
                                    <span className={styles.conversationName}>{conversation.otherUserName}</span>
                                    <span className={styles.conversationTime}>
                                        {new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <span className={styles.conversationPreview}>{conversation.lastMessagePreview}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <main className={styles.chatWindow}>
                {selectedChannel && (
                    <>
                        <div className={styles.chatHeader}>
                            <div className={styles.chatHeaderInfo}>
                                <div className={styles.chatAvatar}>
                                    <span>{getInitial(selectedChannel.otherUserName)}</span>
                                </div>
                                <div className={styles.chatHeaderText}>
                                    <span className={styles.chatHeaderName}>{selectedChannel.otherUserName}</span>
                                    <span className={styles.chatHeaderStatus}>
                                        {connectionState === 'connected' ? '● Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <button className={styles.moreOptionsBtn} aria-label="More options"><MoreOptionsIcon /></button>
                        </div>

                        <div className={styles.messagesArea}>
                            {loading ? (
                                <div className={styles.chatLoadingContainer}>
                                    <div className={styles.spinner} />
                                    <p className={styles.chatLoadingText}>Loading messages...</p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((message) => (
                                        <div
                                            key={message.messageId}
                                            className={`${styles.messageWrapper} ${message.senderId === tutorId ? styles.outgoing : styles.incoming}`}
                                        >
                                            {message.messageType === 'booking_request' ? (
                                                <BookingRequestCard
                                                    message={{
                                                        content: message.content,
                                                        senderId: message.senderId,
                                                        createdAt: message.createdAt
                                                    }}
                                                    isTutor={true}
                                                />
                                            ) : (
                                                <div className={styles.messageBubble}>
                                                    <p className={styles.messageContent}>{message.content}</p>
                                                </div>
                                            )}
                                            <span className={styles.messageTimestamp}>
                                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        <div className={styles.inputArea}>
                            <div className={styles.smartReplySection}>
                                <div className={styles.smartReplyLabel}><SmartReplyIcon /><span>Smart Reply</span></div>
                                <div className={styles.smartReplyOptions}>
                                    {smartReplies.map((reply, index) => (
                                        <button key={index} className={styles.smartReplyBtn} onClick={() => setMessageInput(reply)}>{reply}</button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.messageInputContainer}>
                                <input
                                    type="text"
                                    className={styles.messageInput}
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button className={styles.sendBtn} onClick={handleSendMessage} disabled={!messageInput.trim()} aria-label="Send message">
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default TutorPortalMessages;
