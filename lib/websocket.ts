import { WebSocketMessage } from '@/types/trading';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandler: ((data: WebSocketMessage) => void) | null = null;
  private isConnected = false;
  private messageQueue: string[] = [];

  connect(onMessage: (data: WebSocketMessage) => void) {
    this.messageHandler = onMessage;
    this.createConnection();
  }

  private createConnection() {
    this.ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
    
    this.ws.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message && this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(message);
        }
      }
      
      this.sendSubscriptions();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.channel === 'subscriptionResponse') {
          return;
        }

        if (this.messageHandler) {
          this.messageHandler(data);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    this.ws.onerror = this.handleError.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
  }

  private sendSubscriptions() {
    const subscriptions = [
      {
        method: "subscribe",
        subscription: { 
          type: "l2Book", 
          coin: "BTC"
        }
      },
      {
        method: "subscribe",
        subscription: { 
          type: "trades", 
          coin: "BTC"
        }
      },
      {
        method: "subscribe",
        subscription: { 
          type: "candle", 
          coin: "BTC", 
          interval: "1m"
        }
      }
    ];
    
    subscriptions.forEach(sub => {
      const message = JSON.stringify(sub);
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(message);
      } else {
        this.messageQueue.push(message);
      }
    });
  }

  private handleError() {
    this.isConnected = false;
    this.attemptReconnect();
  }

  private handleClose() {
    this.isConnected = false;
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
    if (this.ws && this.isConnected) {
      const unsubscribeMessages = [
        { method: "unsubscribe", subscription: { type: "l2Book", coin: "BTC" } },
        { method: "unsubscribe", subscription: { type: "trades", coin: "BTC" } },
        { method: "unsubscribe", subscription: { type: "candle", coin: "BTC", interval: "1m" } }
      ];
      
      unsubscribeMessages.forEach(msg => {
        const message = JSON.stringify(msg);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(message);
        }
      });
      
      this.ws.close();
    }
    this.ws = null;
    this.isConnected = false;
  }
}
