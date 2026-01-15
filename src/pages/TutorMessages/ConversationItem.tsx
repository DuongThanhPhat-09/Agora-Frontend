import React from 'react';

interface ConversationItemProps {
    id: string;
    name: string;
    avatar: string;
    preview: string;
    time: string;
    isActive?: boolean;
    hasOffer?: boolean;
    isUnread?: boolean;
    isOnline?: boolean;
    onClick?: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
    name,
    avatar,
    preview,
    time,
    isActive = false,
    hasOffer = false,
    isUnread = false,
    isOnline = false,
    onClick,
}) => {
    return (
        <div
            className={`conversation-item ${isActive ? 'conversation-item-active' : ''}`}
            onClick={onClick}
        >
            <div className="conversation-avatar">
                <span className="avatar-text">{avatar}</span>
                {isOnline && <span className="status-indicator status-online"></span>}
            </div>
            <div className="conversation-content">
                <div className="conversation-header">
                    <h3 className="conversation-name">{name}</h3>
                    {hasOffer && <span className="offer-badge">OFFER</span>}
                </div>
                <div className="conversation-footer">
                    <p className="conversation-preview">{preview}</p>
                    {isUnread && <span className="unread-dot"></span>}
                </div>
            </div>
            <span className="conversation-time">{time}</span>
        </div>
    );
};

export default ConversationItem;
