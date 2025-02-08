export interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  export interface OrderBookEntry {
    price: string;
    size: string;
    total: number;
  }
  
  export interface OrderBookData {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  }
  
  export interface WebSocketMessage {
    channel: string;
    data: any;
  }
  