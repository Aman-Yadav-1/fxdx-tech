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
  channel: string;
  data: any;
}
