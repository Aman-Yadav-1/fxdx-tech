'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { TimeSelector } from '@/components/TimeSelector';
import PriceChart from '@/components/PriceChart';
import { OrderBook } from '@/components/OrderBook';
import { TradingControls } from '@/components/TradingControls';
import { WebSocketManager } from '@/lib/websocket';
import { CandleData } from '@/types/trading';

interface OrderBookEntry {
  px: string;
  sz: string;
  side: 'A' | 'B';
}

export default function TradingPage() {
  const [orderBook, setOrderBook] = useState<{ levels: OrderBookEntry[] }>({ levels: [] });
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
        const levels = message.data?.levels?.flat() || [];
        setOrderBook({ levels });
      }
      if (message.channel === 'trades') {
        setCurrentPrice(message.data?.price || '0.00');
      }
    });

    return () => wsManager.disconnect();
  }, [selectedInterval]);

  return (
    <div className="flex flex-col h-screen bg-[#0E0E0E]">
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Left Side - Chart Area */}
        <div className="flex flex-col flex-[3] min-w-0 border-r border-gray-800">
          <TimeSelector 
            selectedInterval={selectedInterval}
            onIntervalChange={setSelectedInterval}
          />
          <div className="flex-1 min-h-0">
            <PriceChart data={candleData} />
          </div>
        </div>
        
        {/* Right Side Panel */}
        <div className="flex w-[600px] min-w-[600px]">
          {/* OrderBook */}
          <div className="flex-[2] h-full">
            <OrderBook orderBook={orderBook} className="h-full" />
          </div>
          {/* Trading Controls */}
          <div className="flex-1 border-l border-gray-800">
            <TradingControls />
          </div>
        </div>
      </div>
    </div>
  );
}
