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
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WebSocketMessage {
  channel: string;
  data: any;
}
