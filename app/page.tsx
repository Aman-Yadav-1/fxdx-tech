'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { TimeSelector } from '@/components/TimeSelector';
import PriceChart from '@/components/PriceChart';
import { OrderBook } from '@/components/OrderBook';
import { TradingControls } from '@/components/TradingControls';
import { WebSocketManager } from '@/lib/websocket';
import { WebSocketMessage } from '@/types/trading';
import { Time } from 'lightweight-charts';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface OrderBookEntry {
  price: string;
  size: string;
  total: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export default function TradingPage() {
  const [orderBook, setOrderBook] = useState<OrderBookData>({ bids: [], asks: [] });
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [selectedInterval, setSelectedInterval] = useState('5m');
  const wsManager = new WebSocketManager();

  const fetchInitialCandleData = async () => {
    try {
      const response = await fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: "candleSnapshot",
          req: {
            coin: "BTC",
            interval: "15m",
            startTime: Date.now() - (24 * 60 * 60 * 1000),
            endTime: Date.now()
          }
        })
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      const data = await response.json();
      const formattedData = Array.isArray(data) ? data.map((candle: any) => ({
        time: candle.t,
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c),
        volume: parseFloat(candle.v)
      })) : [];
  
      setCandleData(formattedData);
    } catch (error) {
      console.error('Failed to fetch candle data:', error);
      setCandleData([]);
    }
  };
  
  
  useEffect(() => {
    fetchInitialCandleData();
    
    wsManager.connect((message) => {
      if (message.type === 'l2Book' && message.data?.levels) {
        const [bids, asks] = message.data.levels;
        setOrderBook({
          bids: bids.map((bid) => ({
            price: bid.px,
            size: bid.sz,
            total: bid.n
          })),
          asks: asks.map((ask) => ({
            price: ask.px,
            size: ask.sz,
            total: ask.n
          }))
        });
      }
    });

    return () => wsManager.disconnect();
  }, [selectedInterval]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3 flex flex-col gap-4">
          <TimeSelector
            selectedInterval={selectedInterval}
            onIntervalChange={setSelectedInterval}
          />
          <PriceChart data={candleData} />
        </div>
        <div className="flex flex-col gap-4">
          <OrderBook orderBook={orderBook} />
          <TradingControls />
        </div>
      </div>
    </div>
  );
}
