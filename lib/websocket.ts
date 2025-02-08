import { WebSocketMessage } from '@/types/trading';

export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandler: ((data: WebSocketMessage) => void) | null = null;
  private isConnected = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  static getInstance() {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  connect(onMessage: (data: WebSocketMessage) => void) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.messageHandler = onMessage;
      return;
    }
    
    this.messageHandler = onMessage;
    this.createConnection();
  }

  private createConnection() {
    if (typeof window === 'undefined') return;
    
    this.ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
    
    this.ws.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.sendSubscriptions();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.messageHandler) {
        this.messageHandler(data);
      }
    };

    this.ws.onerror = this.handleConnectionFailure.bind(this);
    this.ws.onclose = this.handleConnectionFailure.bind(this);
  }

  private sendSubscriptions() {
    if (!this.isConnected || !this.ws) return;
    
    const subscriptions = [
      { method: "subscribe", subscription: { type: "l2Book", coin: "BTC" } },
      { method: "subscribe", subscription: { type: "trades", coin: "BTC" } }
    ];
    
    subscriptions.forEach(sub => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(sub));
      }
    });
  }

  private handleConnectionFailure() {
    this.isConnected = false;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectTimeout = setTimeout(() => this.createConnection(), delay);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.isConnected = false;
      this.ws.close();
    }
    
    this.ws = null;
  }
}
