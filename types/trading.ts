import { Time } from 'lightweight-charts';

export interface L2BookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface OrderBookEntry {
  price: string;
  size: string;
  total: number;
}


export interface CandleData {
    time: Time;      // Time from lightweight-charts library
    open: number;    // Opening price
    high: number;    // Highest price
    low: number;     // Lowest price
    close: number;   // Closing price
    volume: number;  // Trading volume
}

export interface WebSocketMessage {
    type: string;
    data?: {
      bids?: [number, number][];
      asks?: [number, number][];
      levels?: [Array<{
        px: string;
        sz: string;
        n: number;
      }>, Array<{
        px: string;
        sz: string;
        n: number;
      }>];
    };
    coin?: string;
    timestamp?: number;
    channel?: string;
  }
  
