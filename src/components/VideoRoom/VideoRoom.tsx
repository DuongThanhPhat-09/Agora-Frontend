import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import TRTC from 'trtc-sdk-v5';
import { toast } from 'react-toastify';
import { supabase } from '../../lib/supabase';
import type { TRTCRoomInfo } from '../../services/trtc.service';
import { Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, MessageSquare, PhoneOff, Hand, Smile, X } from 'lucide-react';

interface VideoRoomProps {
  roomInfo: TRTCRoomInfo;
  onLeave?: () => void;
}

interface RemoteUser {
  userId: string;
  hasVideo: boolean;
  hasAudio: boolean;
  hasScreen: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  time: number;
}

interface Reaction {
  id: number;
  emoji: string;
  left: number;
}

const VideoRoom: React.FC<VideoRoomProps> = ({ roomInfo, onLeave }) => {
  const trtcRef = useRef<TRTC | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const localScreenRef = useRef<HTMLDivElement>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Layout states
  const [pinnedVideoId, setPinnedVideoId] = useState<string | null>(null);

  // Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [hasUnread, setHasUnread] = useState(false);
  const chatOpenRef = useRef(chatOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedMsgIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  // Interaction states
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState<Record<string, boolean>>({});
  const [floatingReactions, setFloatingReactions] = useState<Reaction[]>([]);
  const [showReactionMenu, setShowReactionMenu] = useState(false);

  const remoteVideoRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const remoteScreenRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCameraError = (err: any) => {
    console.warn('Cannot start local video:', err);
    setIsCamOn(false);
    
    // Better friendly error message
    const errString = (err?.message || err?.name || '').toLowerCase();
    if (errString.includes('notreadable') || errString.includes('pre-occupied') || err?.name === 'NotReadableError') {
      toast.warn('Camera đang bị ứng dụng khác (hoặc tab khác) sử dụng. Vui lòng tắt camera ở nơi khác rồi thử lại.', { autoClose: 6000 });
    } else if (errString.includes('notallowed') || err?.name === 'NotAllowedError') {
      toast.warn('Không thể truy cập camera. Vui lòng cấp quyền trong trình duyệt.');
    } else if (errString.includes('notfound') || err?.name === 'NotFoundError') {
      toast.warn('Không tìm thấy thiết bị camera trên máy tính của bạn.');
    } else {
      toast.warn(`Lỗi Camera: ${err?.message || err?.name || 'Không xác định'}`);
    }
  };

  // ── Join room ──────────────────────────────────────────────────────────────
  const joinRoom = useCallback(async (trtc: TRTC) => {
    try {
      setIsLoading(true);
      setError(null);

      trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, ({ userId }: { userId: string }) => {
        setRemoteUsers(prev => {
          if (prev.find(u => u.userId === userId)) return prev;
          return [...prev, { userId, hasVideo: false, hasAudio: false, hasScreen: false }];
        });
      });

      trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, ({ userId }: { userId: string }) => {
        setRemoteUsers(prev => prev.filter(u => u.userId !== userId));
        setRaisedHands(prev => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
        setPinnedVideoId(prev => prev === userId ? null : prev);
      });

      trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }: { userId: string; streamType: string }) => {
        if (streamType === TRTC.TYPE.STREAM_TYPE_MAIN) {
          setRemoteUsers(prev => prev.map(u => (u.userId === userId ? { ...u, hasVideo: true } : u)));
          setTimeout(() => {
            const el = remoteVideoRefs.current[userId];
            if (el) trtc.startRemoteVideo({ userId, streamType, view: el });
          }, 100);
        } else if (streamType === TRTC.TYPE.STREAM_TYPE_SUB) {
          setRemoteUsers(prev => prev.map(u => (u.userId === userId ? { ...u, hasScreen: true } : u)));
          setTimeout(() => {
            const el = remoteScreenRefs.current[userId];
            if (el) trtc.startRemoteVideo({ userId, streamType, view: el });
          }, 100);
        }
      });

      trtc.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, ({ userId, streamType }: { userId: string; streamType: string }) => {
        if (streamType === TRTC.TYPE.STREAM_TYPE_MAIN) {
          setRemoteUsers(prev => prev.map(u => (u.userId === userId ? { ...u, hasVideo: false } : u)));
        } else if (streamType === TRTC.TYPE.STREAM_TYPE_SUB) {
          setRemoteUsers(prev => prev.map(u => (u.userId === userId ? { ...u, hasScreen: false } : u)));
          setPinnedVideoId(prev => prev === `${userId}_screen` ? null : prev);
        }
      });

      trtc.on(TRTC.EVENT.REMOTE_AUDIO_AVAILABLE, ({ userId }: { userId: string }) => {
        setRemoteUsers(prev =>
          prev.map(u => (u.userId === userId ? { ...u, hasAudio: true } : u))
        );
        trtc.startRemoteAudio({ userId });
      });

      trtc.on(TRTC.EVENT.SCREEN_SHARE_STOPPED, () => {
        setIsScreenSharing(false);
        setPinnedVideoId(prev => prev === `${roomInfo.userId}_screen` ? null : prev);
      });

      // Join room
      await trtc.enterRoom({
        sdkAppId: roomInfo.sdkAppId,
        userId: roomInfo.userId,
        userSig: roomInfo.userSig,
        roomId: roomInfo.roomId,
      });

      // Start local camera + mic
      try {
        if (localVideoRef.current) {
          await trtc.startLocalVideo({ 
            view: localVideoRef.current,
            option: { profile: '1080p' }
          });
        }
      } catch (err: any) {
        handleCameraError(err);
      }

      try {
        await trtc.startLocalAudio();
      } catch (err: unknown) {
        console.warn('Cannot start local audio:', err);
        setIsMicOn(false);
        toast.warn('Không thể truy cập microphone. Vui lòng cấp quyền trong trình duyệt.');
      }

      setIsJoined(true);
    } catch (err: unknown) {
      if (trtcRef.current === null || trtcRef.current !== trtc) {
        console.log('TRTC client was destroyed, ignoring error:', err);
        return;
      }
      const msg = err instanceof Error ? err.message : 'Không thể kết nối phòng học.';
      console.error('❌ TRTC joinRoom error:', err);
      setError(msg);
    } finally {
      if (trtcRef.current === trtc) {
        setIsLoading(false);
      }
    }
  }, [roomInfo]);

  useEffect(() => {
    let trtc: TRTC | null = null;
    let isMounted = true;
    
    const init = async () => {
        trtc = TRTC.create();
        trtcRef.current = trtc;
        if (isMounted) {
          await joinRoom(trtc);
        }
    };
    init();

    // Supabase Realtime for Chat, Reactions, and Raise Hand
    const channel = supabase.channel(`room-${roomInfo.roomId}`)
      .on('broadcast', { event: 'chat' }, (payload) => {
        const newMsg = payload.payload as ChatMessage;
        if (newMsg.userId === roomInfo.userId) return; // Ignore own message
        if (processedMsgIds.current.has(newMsg.id)) return; // Prevent duplicates
        processedMsgIds.current.add(newMsg.id);

        setMessages(prev => [...prev, newMsg]);
        if (!chatOpenRef.current) {
          setHasUnread(true);
        }
      })
      .on('broadcast', { event: 'reaction' }, (payload) => {
        const { userId, emoji } = payload.payload;
        if (userId === roomInfo.userId) return; // Ignore own reaction

        const newReaction = { id: Date.now(), emoji, left: Math.random() * 80 + 10 };
        setFloatingReactions(prev => [...prev, newReaction]);
        setTimeout(() => {
          setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
        }, 3000);
      })
      .on('broadcast', { event: 'raise_hand' }, (payload) => {
        const { userId, isRaised } = payload.payload;
        if (userId === roomInfo.userId) return; // Ignore own hand raise

        setRaisedHands(prev => ({ ...prev, [userId]: isRaised }));
      })
      .subscribe();

    return () => {
      isMounted = false;
      if (trtc) {
          trtc.exitRoom().catch(() => {});
          trtc.destroy();
      }
      trtcRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [joinRoom, roomInfo.roomId]);

  useEffect(() => {
    if (chatOpen) {
      setHasUnread(false);
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, chatOpen]);

  // ── Controls ───────────────────────────────────────────────────────────────
  const toggleMic = async () => {
    if (!trtcRef.current) return;
    if (isMicOn) {
      await trtcRef.current.stopLocalAudio();
      setIsMicOn(false);
    } else {
      try {
        await trtcRef.current.startLocalAudio();
        setIsMicOn(true);
      } catch (err) {
        toast.warn('Không thể truy cập microphone. Vui lòng cấp quyền trong trình duyệt.');
      }
    }
  };

  const toggleCam = async () => {
    if (!trtcRef.current) return;
    if (isCamOn) {
      await trtcRef.current.stopLocalVideo();
      setIsCamOn(false);
    } else {
      if (localVideoRef.current) {
        try {
          await trtcRef.current.startLocalVideo({ 
            view: localVideoRef.current,
            option: { profile: '1080p' }
          });
          setIsCamOn(true);
        } catch (err: any) {
          handleCameraError(err);
        }
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!trtcRef.current) return;
    if (isScreenSharing) {
      await trtcRef.current.stopScreenShare();
      setIsScreenSharing(false);
      setPinnedVideoId(prev => prev === `${roomInfo.userId}_screen` ? null : prev);
    } else {
      if (localScreenRef.current) {
        try {
          await trtcRef.current.startScreenShare({ 
            view: localScreenRef.current,
            option: { profile: '1080p_2', systemAudio: true }
          });
          setIsScreenSharing(true);
          // Auto pin local screen share
          setPinnedVideoId(`${roomInfo.userId}_screen`);
        } catch (err: any) {
          console.warn('Cannot start screen share:', err);
          toast.warn('Bạn đã từ chối chia sẻ màn hình, hoặc thiết bị không hỗ trợ.');
        }
      }
    }
  };

  const toggleRaiseHand = async () => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    
    const channel = supabase.channel(`room-${roomInfo.roomId}`);
    await channel.send({
      type: 'broadcast',
      event: 'raise_hand',
      payload: { userId: roomInfo.userId, isRaised: newState }
    });
  };

  const sendReaction = async (emoji: string) => {
    setShowReactionMenu(false);
    
    // Show locally immediately
    const newReaction = { id: Date.now(), emoji, left: Math.random() * 80 + 10 };
    setFloatingReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);

    // Broadcast to others
    const channel = supabase.channel(`room-${roomInfo.roomId}`);
    await channel.send({
      type: 'broadcast',
      event: 'reaction',
      payload: { userId: roomInfo.userId, emoji }
    });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: roomInfo.userId,
      text: chatInput.trim(),
      time: Date.now()
    };
    processedMsgIds.current.add(newMsg.id);

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    const channel = supabase.channel(`room-${roomInfo.roomId}`);
    await channel.send({
      type: 'broadcast',
      event: 'chat',
      payload: newMsg
    });
  };

  const handleLeave = async () => {
    await trtcRef.current?.exitRoom();
    trtcRef.current?.destroy();
    trtcRef.current = null;
    onLeave?.();
  };

  const handleDoubleClickVideo = (id: string) => {
    setPinnedVideoId(prev => prev === id ? null : id);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (error) {
    return createPortal(
      <div style={styles.errorBox}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Không thể tham gia phòng học</div>
        <div style={{ color: '#ef4444', fontSize: 14, marginBottom: 16 }}>{error}</div>
        <button onClick={onLeave} style={styles.leaveBtn}>Đóng</button>
      </div>,
      document.body
    );
  }

  // Calculate layout classes
  const isPinned = pinnedVideoId !== null;

  return createPortal(
    <div style={styles.container}>
      {/* Floating Reactions Container */}
      <div style={styles.reactionContainer}>
        {floatingReactions.map(reaction => (
          <div
            key={reaction.id}
            className="floating-emoji"
            style={{ left: `${reaction.left}%` }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>
      
      {/* Dynamic CSS */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
        .floating-emoji {
          position: absolute;
          bottom: -50px;
          font-size: 3rem;
          animation: floatUp 3s ease-out forwards;
          z-index: 10000;
          pointer-events: none;
        }
        .toolbar-btn {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 4px; width: 64px; height: 60px;
          border-radius: 14px; border: none; cursor: pointer; color: #fff;
          transition: all 0.2s ease;
          position: relative;
        }
        .toolbar-btn:hover { background-color: #3f3f46 !important; transform: translateY(-2px); }
        .toolbar-btn:active { transform: translateY(0); }
        .toolbar-btn.active-tool { background-color: #3b82f6 !important; }
        .toolbar-btn.danger-tool { background-color: #ef4444 !important; }
        .reaction-menu {
          position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%);
          background: rgba(30, 30, 30, 0.95); backdrop-filter: blur(10px);
          padding: 8px 12px; border-radius: 24px; display: flex; gap: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 1000;
        }
        .emoji-btn {
          background: none; border: none; font-size: 26px; cursor: pointer;
          transition: transform 0.2s; padding: 6px; border-radius: 50%;
        }
        .emoji-btn:hover { transform: scale(1.3); background: rgba(255,255,255,0.1); }
        
        .video-layout-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 16px; padding: 16px;
          overflow: auto;
          align-content: center;
        }
        .video-layout-pinned {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: max-content;
          gap: 16px;
          padding: 16px;
          overflow-y: auto;
          overflow-x: hidden;
          align-items: start;
        }
        @media (min-width: 768px) {
          .video-layout-pinned {
            grid-template-columns: 1fr 280px;
          }
        }
        .pinned-main-item {
          grid-column: 1;
          grid-row: 1 / 999;
          position: sticky;
          top: 0;
          width: 100%;
          height: calc(100vh - 120px);
          z-index: 10;
        }
        .pinned-main-item video {
          object-fit: contain !important;
        }
        .pinned-side-item {
          grid-column: 1;
          width: 100%;
          aspect-ratio: 16/9;
        }
        @media (min-width: 768px) {
          .pinned-side-item {
            grid-column: 2;
          }
        }
        .chat-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #ef4444;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #18181b;
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={styles.liveDot} />
          <span style={{ fontWeight: 600, fontSize: 15, color: '#fff' }}>
            Phòng học {roomInfo.roomId}
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#a1a1aa' }}>
          {remoteUsers.length > 0 ? `${remoteUsers.length + 1} người trong phòng` : 'Đang chờ người tham gia...'}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        <div className={isPinned ? 'video-layout-pinned' : 'video-layout-grid'}>
          
          {/* Local Video */}
          <div 
            className={isPinned ? (pinnedVideoId === roomInfo.userId ? 'pinned-main-item' : 'pinned-side-item') : ''}
            style={styles.videoBox}
            onDoubleClick={() => handleDoubleClickVideo(roomInfo.userId)}
          >
            <div ref={localVideoRef} style={styles.videoEl} />
            {isLoading && (
              <div style={styles.loadingOverlay}>
                <div style={styles.spinner} />
                <div style={{ color: '#fff', marginTop: 12, fontSize: 14 }}>Đang kết nối...</div>
              </div>
            )}
            <div style={styles.userLabel}>
              <span style={{ fontWeight: 600 }}>Bạn</span>
              {(!isCamOn || !isMicOn) && (
                <div style={styles.statusIcons}>
                  {!isCamOn && <VideoOff size={14} color="#ef4444" />}
                  {!isMicOn && <MicOff size={14} color="#ef4444" />}
                </div>
              )}
            </div>
            {isHandRaised && <div style={styles.raisedHandIcon}>✋</div>}
          </div>

          {/* Local Screen Share */}
          <div 
            className={isPinned ? (pinnedVideoId === `${roomInfo.userId}_screen` ? 'pinned-main-item' : 'pinned-side-item') : ''}
            style={{ ...styles.videoBox, display: isScreenSharing ? 'block' : 'none' }}
            onDoubleClick={() => handleDoubleClickVideo(`${roomInfo.userId}_screen`)}
          >
            <div ref={localScreenRef} style={styles.videoEl} />
            <div style={styles.userLabel}><span>Màn hình của Bạn</span></div>
          </div>

          {/* Remote Videos */}
          {remoteUsers.map(user => {
            const userName = roomInfo.participantNames?.[user.userId] || user.userId;
            const isRemoteHandRaised = raisedHands[user.userId];
            return (
              <React.Fragment key={user.userId}>
                <div 
                  className={isPinned ? (pinnedVideoId === user.userId ? 'pinned-main-item' : 'pinned-side-item') : ''}
                  style={styles.videoBox}
                  onDoubleClick={() => handleDoubleClickVideo(user.userId)}
                >
                  <div ref={el => { remoteVideoRefs.current[user.userId] = el; }} style={styles.videoEl} />
                  {!user.hasVideo && (
                    <div style={styles.noVideoOverlay}>
                      <div style={styles.avatarCircle}>{userName.charAt(0).toUpperCase()}</div>
                    </div>
                  )}
                  <div style={styles.userLabel}>
                    <span style={{ fontWeight: 600 }}>{userName}</span>
                    {(!user.hasVideo || !user.hasAudio) && (
                      <div style={styles.statusIcons}>
                        {!user.hasVideo && <VideoOff size={14} color="#ef4444" />}
                        {!user.hasAudio && <MicOff size={14} color="#ef4444" />}
                      </div>
                    )}
                  </div>
                  {isRemoteHandRaised && <div style={styles.raisedHandIcon}>✋</div>}
                </div>

                {user.hasScreen && (
                  <div 
                    className={isPinned ? (pinnedVideoId === `${user.userId}_screen` ? 'pinned-main-item' : 'pinned-side-item') : ''}
                    style={styles.videoBox}
                    onDoubleClick={() => handleDoubleClickVideo(`${user.userId}_screen`)}
                  >
                    <div ref={el => { remoteScreenRefs.current[user.userId] = el; }} style={styles.videoEl} />
                    <div style={styles.userLabel}><span>Màn hình của {userName}</span></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Chat Sidebar */}
        {chatOpen && (
          <div style={styles.chatSidebar}>
            <div style={styles.chatHeader}>
              <span style={{ fontWeight: 600 }}>Trò chuyện</span>
              <button style={styles.closeChatBtn} onClick={() => setChatOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.chatMessageList}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', marginTop: 20, fontSize: 13 }}>
                  Chưa có tin nhắn nào.
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.userId === roomInfo.userId;
                  const senderName = isMe ? 'Bạn' : (roomInfo.participantNames?.[msg.userId] || msg.userId);
                  return (
                    <div key={msg.id} style={{ ...styles.chatMessageItem, alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <span style={styles.chatMessageSender}>{senderName}</span>
                      <div style={{ ...styles.chatMessageBubble, background: isMe ? '#3b82f6' : '#27272a' }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={styles.chatInputContainer}>
              <input 
                style={styles.chatInput}
                placeholder="Nhắn tin..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button type="submit" style={styles.chatSendBtn} disabled={!chatInput.trim()}>
                Gửi
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modern Zoom-like Toolbar */}
      <div style={styles.controls}>
        <button
          onClick={toggleMic}
          className={`toolbar-btn ${!isMicOn ? 'danger-tool' : ''}`}
          style={{ background: isMicOn ? '#27272a' : undefined }}
          title={isMicOn ? 'Tắt mic' : 'Bật mic'}
        >
          {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
          <span style={styles.controlLabel}>Mic</span>
        </button>

        <button
          onClick={toggleCam}
          className={`toolbar-btn ${!isCamOn ? 'danger-tool' : ''}`}
          style={{ background: isCamOn ? '#27272a' : undefined }}
          title={isCamOn ? 'Tắt camera' : 'Bật camera'}
        >
          {isCamOn ? <VideoIcon size={22} /> : <VideoOff size={22} />}
          <span style={styles.controlLabel}>Cam</span>
        </button>

        <button
          onClick={toggleScreenShare}
          className={`toolbar-btn ${isScreenSharing ? 'active-tool' : ''}`}
          style={{ background: !isScreenSharing ? '#27272a' : undefined }}
          title={isScreenSharing ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}
        >
          <MonitorUp size={22} />
          <span style={styles.controlLabel}>Share</span>
        </button>

        <button
          onClick={() => setChatOpen(prev => !prev)}
          className={`toolbar-btn ${chatOpen ? 'active-tool' : ''}`}
          style={{ background: !chatOpen ? '#27272a' : undefined }}
          title="Trò chuyện"
        >
          <MessageSquare size={22} />
          <span style={styles.controlLabel}>Chat</span>
          {hasUnread && <div className="chat-badge" />}
        </button>

        <div style={{ width: 1, height: 40, background: '#3f3f46', margin: '0 8px' }} />

        <button
          onClick={toggleRaiseHand}
          className={`toolbar-btn ${isHandRaised ? 'active-tool' : ''}`}
          style={{ background: !isHandRaised ? '#27272a' : undefined }}
          title={isHandRaised ? 'Hạ tay xuống' : 'Giơ tay'}
        >
          <Hand size={22} />
          <span style={styles.controlLabel}>Hand</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowReactionMenu(!showReactionMenu)}
            className={`toolbar-btn ${showReactionMenu ? 'active-tool' : ''}`}
            style={{ background: !showReactionMenu ? '#27272a' : undefined }}
            title="Biểu cảm"
          >
            <Smile size={22} />
            <span style={styles.controlLabel}>React</span>
          </button>
          
          {showReactionMenu && (
            <div className="reaction-menu">
              {['👍', '👏', '❤️', '😂', '😮', '🎉'].map(emoji => (
                <button key={emoji} className="emoji-btn" onClick={() => sendReaction(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 40, background: '#3f3f46', margin: '0 8px' }} />

        <button 
          onClick={handleLeave} 
          className="toolbar-btn danger-tool" 
          title="Rời phòng"
        >
          <PhoneOff size={22} />
          <span style={styles.controlLabel}>End</span>
        </button>
      </div>
    </div>,
    document.body
  );
};

// ── Inline styles ──────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: '#09090b',
    display: 'flex', flexDirection: 'column',
  },
  reactionContainer: {
    position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 9998
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 24px',
    background: '#18181b',
    borderBottom: '1px solid #27272a',
  },
  liveDot: {
    width: 10, height: 10, borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
    animation: 'pulse 2s infinite',
  },
  videoBox: {
    position: 'relative',
    background: '#18181b',
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: '16/9',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    border: '1px solid #27272a',
    transition: 'all 0.3s ease',
  },
  videoEl: {
    width: '100%', height: '100%',
    objectFit: 'cover',
  },
  loadingOverlay: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.8)',
  },
  spinner: {
    width: 32, height: 32,
    border: '3px solid rgba(255,255,255,0.2)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  noVideoOverlay: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#18181b',
  },
  avatarCircle: {
    width: 80, height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 32, fontWeight: 700, color: '#fff',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
  },
  userLabel: {
    position: 'absolute', bottom: 12, left: 12,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
    color: '#fff', fontSize: 13,
    padding: '6px 12px', borderRadius: '20px',
    display: 'flex', alignItems: 'center', gap: 8,
    pointerEvents: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  statusIcons: {
    display: 'flex', alignItems: 'center', gap: 4,
    background: 'rgba(239, 68, 68, 0.15)',
    padding: '2px 6px', borderRadius: '12px',
  },
  raisedHandIcon: {
    position: 'absolute', top: 12, right: 12,
    background: 'rgba(59, 130, 246, 0.95)', backdropFilter: 'blur(4px)',
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    animation: 'pulse 2s infinite',
    pointerEvents: 'none',
  },
  camOffIcon: { fontSize: 13 },
  controls: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 12, padding: '16px 20px',
    background: '#18181b',
    borderTop: '1px solid #27272a',
  },
  controlLabel: { fontSize: 11, fontWeight: 600, marginTop: 2 },
  errorBox: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: '#09090b',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    color: '#fff', gap: 8, padding: 24, textAlign: 'center',
  },
  leaveBtn: {
    padding: '10px 28px', borderRadius: 10,
    background: '#ef4444', color: '#fff',
    border: 'none', cursor: 'pointer', fontWeight: 600,
    fontSize: 15, marginTop: 10, transition: 'background 0.2s',
  },
  chatSidebar: {
    width: 320,
    background: '#18181b',
    borderLeft: '1px solid #27272a',
    display: 'flex', flexDirection: 'column',
  },
  chatHeader: {
    padding: '16px 20px', borderBottom: '1px solid #27272a',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    color: '#fff',
  },
  closeChatBtn: {
    background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 4, borderRadius: 6, transition: 'all 0.2s',
  },
  chatMessageList: {
    flex: 1, overflowY: 'auto', padding: 16,
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  chatMessageItem: {
    display: 'flex', flexDirection: 'column',
  },
  chatMessageSender: {
    fontSize: 11, color: '#a1a1aa', marginBottom: 4, fontWeight: 500,
  },
  chatMessageBubble: {
    padding: '10px 14px', borderRadius: 12, color: '#fff', fontSize: 13,
    maxWidth: '90%', wordBreak: 'break-word', lineHeight: 1.4,
  },
  chatInputContainer: {
    display: 'flex', padding: 16, borderTop: '1px solid #27272a', gap: 10,
    background: '#18181b',
  },
  chatInput: {
    flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #3f3f46',
    background: '#27272a', color: '#fff', outline: 'none', fontSize: 13,
    transition: 'border 0.2s',
  },
  chatSendBtn: {
    background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8,
    padding: '0 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    transition: 'background 0.2s',
  }
};

export default VideoRoom;
