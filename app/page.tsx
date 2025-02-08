'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { TimeSelector } from '@/components/TimeSelector';
import PriceChart from '@/components/PriceChart';
import { OrderBook } from '@/components/OrderBook';
import { TradingControls } from '@/components/TradingControls';
import { WebSocketManager } from '@/lib/websocket';
import { Time } from 'lightweight-charts';

interface CandleData {
  time: Time;
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
          coin: "BTC",
          interval: selectedInterval,
          startTime: Date.now() - 24 * 60 * 60 * 1000,
        }),
      });
      
      const data = await response.json();
      const formattedData = data.map((candle: any) => ({
        time: candle.time as Time,
        open: parseFloat(candle.open),
        high: parseFloat(candle.high),
        low: parseFloat(candle.low),
        close: parseFloat(candle.close),
        volume: parseFloat(candle.volume),
      }));
      
      setCandleData(formattedData);
    } catch (error) {
      console.error('Failed to fetch candle data:', error);
    }
  };

  useEffect(() => {
    fetchInitialCandleData();
    
    wsManager.connect((message) => {
      if (message.channel === 'l2Book') {
        const [bids, asks] = message.data.levels;
        setOrderBook({
          bids: bids.map((bid: any) => ({
            price: bid.px,
            size: bid.sz,
            total: bid.n
          })),
          asks: asks.map((ask: any) => ({
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
          <PriceChart />
        </div>
        <div className="flex flex-col gap-4">
          <OrderBook orderBook={orderBook} />
          <TradingControls />
        </div>
      </div>
    </div>
  );
}
