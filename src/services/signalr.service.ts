/* eslint-disable @typescript-eslint/no-explicit-any */
import * as signalR from '@microsoft/signalr';
import { getCurrentUser } from './auth.service';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5166';
const HUB_URL = `${API_BASE_URL}/hubs/chat`;

console.log('🔌 SignalR Config:');
console.log('  - API_BASE_URL:', API_BASE_URL);
console.log('  - HUB_URL:', HUB_URL);

// interface SendMessageParams {
//   channelId: number;
//   content: string;
// }

// interface JoinChannelParams {
//   channelId: number;
// }

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private messageHandlers: Map<string, (message: any) => void> = new Map();
  private startPromise: Promise<void> | null = null;

  async connect(): Promise<void> {
    const user = getCurrentUser();
    const token = user?.accessToken || import.meta.env.VITE_TOKEN;

    if (!token) {
      console.error('❌ SignalR: No access token available');
      throw new Error('No access token available');
    }

    // Trả về promise đang chạy nếu có
    if (this.startPromise) {
      return this.startPromise;
    }

    // Nếu đã có kết nối hoặc đang kết nối, không làm gì
    if (this.connection && (
      this.connection.state === signalR.HubConnectionState.Connected ||
      this.connection.state === signalR.HubConnectionState.Connecting ||
      this.connection.state === signalR.HubConnectionState.Reconnecting
    )) {
      console.log('✅ SignalR: Already connected or connecting, state:', this.connection.state);
      return Promise.resolve();
    }

    console.log('🔗 SignalR: Starting connection...');

    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
          accessTokenFactory: () => {
            const currentUser = getCurrentUser();
            return currentUser?.accessToken || import.meta.env.VITE_TOKEN || '';
          },
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Đăng ký các handler mặc định
      this.setupDefaultHandlers();
    }

    this.startPromise = this.connection.start()
      .then(() => {
        console.log('✅ SignalR Connected', this.connection?.connectionId);
        this.startPromise = null;
      })
      .catch((err: any) => {
        this.startPromise = null;
        if (err.name === 'AbortError') {
          console.warn('⚠️ SignalR connection aborted during negotiation (common in React StrictMode)');
        } else {
          console.error('❌ SignalR Connection failed:', err);
        }
        throw err;
      });

    return this.startPromise;
  }

  disconnect(): void {
    if (this.connection) {
      this.connection.stop();
      console.log('🔌 SignalR Disconnected');
      this.connection = null;
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  getState(): signalR.HubConnectionState {
    return this.connection?.state ?? signalR.HubConnectionState.Disconnected;
  }

  // Tham gia channel
  async joinChannel(channelId: number): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error('❌ SignalR: Cannot join channel - connection not ready');
      throw new Error('SignalR connection not established');
    }
    try {
      await this.connection.invoke('JoinChannel', channelId);
      console.log(`✅ Joined channel ${channelId}`);
    } catch (err) {
      console.error(`❌ Error joining channel ${channelId}:`, err);
      throw err;
    }
  }

  // Rời channel
  async leaveChannel(channelId: number): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error('❌ SignalR: Cannot leave channel - connection not ready');
      throw new Error('SignalR connection not established');
    }
    try {
      await this.connection.invoke('LeaveChannel', channelId);
      console.log(`✅ Left channel ${channelId}`);
    } catch (err) {
      console.error(`❌ Error leaving channel ${channelId}:`, err);
      throw err;
    }
  }

  // Gửi tin nhắn
  async sendMessage(channelId: number, content: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error('❌ SignalR: Cannot send message - connection not ready');
      throw new Error('SignalR connection not established');
    }
    try {
      await this.connection.invoke('SendMessage', channelId, content);
      console.log(`✅ Sent message to channel ${channelId}:`, content);
    } catch (err) {
      console.error('❌ Error sending message:', err);
      throw err;
    }
  }

  // Đăng ký nhận tin nhắn thực thời
  onMessageReceived(handler: (message: any) => void): void {
    this.addOrUpdateHandler('messageReceived', handler);
  }

  // Xóa handler tin nhắn
  offMessageReceived(): void {
    this.removeHandler('messageReceived');
  }

  // Đăng ký user tham gia/roi
  onUserJoined(handler: (data: any) => void): void {
    this.addOrUpdateHandler('userJoined', handler);
  }

  offUserJoined(): void {
    this.removeHandler('userJoined');
  }

  onUserLeft(handler: (data: any) => void): void {
    this.addOrUpdateHandler('userLeft', handler);
  }

  offUserLeft(): void {
    this.removeHandler('userLeft');
  }

  private addOrUpdateHandler(eventName: string, handler: (message: any) => void): void {
    this.messageHandlers.set(eventName, handler);
    if (this.connection) {
      this.connection.off(eventName);
      this.connection.on(eventName, handler);
    }
  }

  private removeHandler(eventName: string): void {
    this.messageHandlers.delete(eventName);
    if (this.connection) {
      this.connection.off(eventName);
    }
  }

  private setupDefaultHandlers(): void {
    if (!this.connection) return;

    // Handler mặc định để log các sự kiện
    this.connection.on('messageReceived', (message: any) => {
      console.log('📩 SignalR messageReceived:', message);
      // Kích hoạt handler custom nếu có
      const handler = this.messageHandlers.get('messageReceived');
      if (handler) handler(message);
    });

    this.connection.on('userJoined', (data: any) => {
      console.log('👤 SignalR userJoined:', data);
      const handler = this.messageHandlers.get('userJoined');
      if (handler) handler(data);
    });

    this.connection.on('userLeft', (data: any) => {
      console.log('👋 SignalR userLeft:', data);
      const handler = this.messageHandlers.get('userLeft');
      if (handler) handler(data);
    });

    this.connection.onreconnecting((error?: Error) => {
      console.log('🔄 SignalR Reconnecting...', error);
    });

    this.connection.onreconnected((connectionId?: string) => {
      console.log('✅ SignalR Reconnected', connectionId);
    });

    this.connection.onclose((error?: Error) => {
      console.log('❌ SignalR Closed', error);
    });
  }
}

// Export singleton instance
export const signalRService = new SignalRService();
