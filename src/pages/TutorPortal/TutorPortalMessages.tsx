import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/pages/tutor-portal-messages.module.css';

// Types
interface Conversation {
    id: string;
    name: string;
    avatar?: string;
    subject: string;
    lastMessage: string;
    timestamp: string;
    isActive: boolean;
    unread?: boolean;
}

interface Message {
    id: string;
    content: string;
    timestamp: string;
    isOutgoing: boolean;
}

// Icons
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

// Sample data
const sampleConversations: Conversation[] = [
    {
        id: '1',
        name: 'Emma Wilson',
        subject: 'Grade 11 Physics',
        lastMessage: '"Thank you for the class!"',
        timestamp: '2m ago',
        isActive: true,
        unread: true,
    },
    {
        id: '2',
        name: 'Alex Chen',
        subject: 'Grade 10 Math',
        lastMessage: '"I have a question about homework..."',
        timestamp: '1h ago',
        isActive: false,
    },
    {
        id: '3',
        name: 'Sarah Parker (Parent)',
        subject: 'Grade 12 Chem',
        lastMessage: '"How is Sarah progressing?"',
        timestamp: 'Yesterday',
        isActive: false,
    },
];

const sampleMessages: Message[] = [
    {
        id: '1',
        content: "Hello Alex! I was looking at the Physics homework from today's session. Could you clarify the third question?",
        timestamp: '10:45 AM',
        isOutgoing: false,
    },
    {
        id: '2',
        content: "Hi Emma! Of course. In Question 3, remember that the force is perpendicular to the motion. That means work done is zero.",
        timestamp: '10:50 AM',
        isOutgoing: true,
    },
];

const smartReplies = [
    "I'll review your homework and get back to you soon!",
    "Great progress today, keep up the good work!",
    "Are you available for a quick reschedule tomorrow?",
    "Let's focus on Chapter 4 in our next session.",
];

const TutorPortalMessages = () => {
    const [conversations] = useState<Conversation[]>(sampleConversations);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>(sampleConversations[0]);
    const [messages, setMessages] = useState<Message[]>(sampleMessages);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        // In real app, fetch messages for this conversation
    };

    const handleSmartReply = (reply: string) => {
        setMessageInput(reply);
    };

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: messageInput,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            isOutgoing: true,
        };

        setMessages([...messages, newMessage]);
        setMessageInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className={styles.messagesPage}>
            {/* Conversation List Sidebar */}
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
                        <span className={styles.searchIcon}>
                            <SearchIcon />
                        </span>
                    </div>
                </div>

                <div className={styles.conversationsList}>
                    {filteredConversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`${styles.conversationItem} ${selectedConversation.id === conversation.id ? styles.active : ''}`}
                            onClick={() => handleSelectConversation(conversation)}
                        >
                            <div className={styles.conversationAvatar}>
                                <UserIcon />
                            </div>
                            <div className={styles.conversationInfo}>
                                <div className={styles.conversationHeader}>
                                    <span className={styles.conversationName}>{conversation.name}</span>
                                    <span className={styles.conversationTime}>{conversation.timestamp}</span>
                                </div>
                                <span className={styles.conversationSubject}>{conversation.subject}</span>
                                <span className={styles.conversationPreview}>{conversation.lastMessage}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Window */}
            <main className={styles.chatWindow}>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.chatHeaderInfo}>
                        <div className={styles.chatAvatar}>
                            <span>{getInitial(selectedConversation.name)}</span>
                        </div>
                        <div className={styles.chatHeaderText}>
                            <span className={styles.chatHeaderName}>{selectedConversation.name}</span>
                            <span className={styles.chatHeaderStatus}>Active Now</span>
                        </div>
                    </div>
                    <button className={styles.moreOptionsBtn} aria-label="More options">
                        <MoreOptionsIcon />
                    </button>
                </div>

                {/* Messages Area */}
                <div className={styles.messagesArea}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.messageWrapper} ${message.isOutgoing ? styles.outgoing : styles.incoming}`}
                        >
                            <div className={styles.messageBubble}>
                                <p className={styles.messageContent}>{message.content}</p>
                            </div>
                            <span className={styles.messageTimestamp}>{message.timestamp}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Smart Reply & Input Area */}
                <div className={styles.inputArea}>
                    <div className={styles.smartReplySection}>
                        <div className={styles.smartReplyLabel}>
                            <SmartReplyIcon />
                            <span>Smart Reply</span>
                        </div>
                        <div className={styles.smartReplyOptions}>
                            {smartReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    className={styles.smartReplyBtn}
                                    onClick={() => handleSmartReply(reply)}
                                >
                                    {reply}
                                </button>
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
                        <button
                            className={styles.sendBtn}
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim()}
                            aria-label="Send message"
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TutorPortalMessages;
