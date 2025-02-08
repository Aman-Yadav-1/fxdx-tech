import { WebSocketMessage } from '@/types/trading';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandler: ((data: WebSocketMessage) => void) | null = null;

  connect(onMessage: (data: WebSocketMessage) => void) {
    this.messageHandler = onMessage;
    this.createConnection();
  }

  private createConnection() {
    this.ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
    
    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onerror = this.handleError.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
  }

  private handleOpen() {
    const subscriptions = [
      { method: "subscribe", subscription: { type: "l2Book", coin: "BTC" } },
      { method: "subscribe", subscription: { type: "trades", coin: "BTC" } }
    ];
    
    subscriptions.forEach(sub => {
      this.ws?.send(JSON.stringify(sub));
    });
  }

  private handleMessage(event: MessageEvent) {
    if (this.messageHandler) {
      this.messageHandler(JSON.parse(event.data));
    }
  }

  private handleError() {
    console.error('WebSocket error occurred');
    this.attemptReconnect();
  }

  private handleClose() {
    this.attemptReconnect();
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.createConnection();
      }, 1000 * Math.pow(2, this.reconnectAttempts));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
