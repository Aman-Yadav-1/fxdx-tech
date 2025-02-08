'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { TimeSelector } from '@/components/TimeSelector';
import PriceChart from '@/components/PriceChart';
import { OrderBook } from '@/components/OrderBook';
import { TradingControls } from '@/components/TradingControls';
import { WebSocketManager } from '@/lib/websocket';
import { CandleData, OrderBookData } from '@/types/trading';

export default function TradingPage() {
  const [orderBook, setOrderBook] = useState<OrderBookData>({ bids: [], asks: [] });
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [selectedInterval, setSelectedInterval] = useState('5m');
  const [currentPrice, setCurrentPrice] = useState('0.00');
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
            interval: selectedInterval,
            startTime: Date.now() - (24 * 60 * 60 * 1000),
            endTime: Date.now()
          }
        })
      });

      const data = await response.json();
      const formattedData = data.map((candle: any) => ({
        time: candle.t,
        open: Number(candle.o),
        high: Number(candle.h),
        low: Number(candle.l),
        close: Number(candle.c),
        volume: Number(candle.v)
      }));
      setCandleData(formattedData);
    } catch (error) {
      console.error('Failed to fetch candle data:', error);
    }
  };

  useEffect(() => {
    fetchInitialCandleData();
    
    wsManager.connect((message: any) => {
      if (message.channel === 'l2Book') {
        setOrderBook({
          bids: message.data.bids,
          asks: message.data.asks
        });
      }
      if (message.channel === 'trades') {
        setCurrentPrice(message.data.price);
      }
    });

    return () => wsManager.disconnect();
  }, [selectedInterval]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header currentPrice={currentPrice} />
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
