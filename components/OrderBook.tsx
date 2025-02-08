
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderBookEntry {
  price: string;
  size: string;
  total: number;
}

interface OrderBookProps {
  orderBook: {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  };
  className?: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({ orderBook, className }) => {
  const formatNumber = (num: number | string) => 
    Number(num).toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });

  return (
    <Card className={cn("bg-gray-900 border-gray-800", className)}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-gray-200">Order Book</h2>
          <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-800">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          </Button>
        </div>

        <div className="grid grid-cols-3 text-xs text-gray-400 mb-2">
          <span>Price (USD)</span>
          <span className="text-right">Size (BTC)</span>
          <span className="text-right">Total</span>
        </div>

        <div className="space-y-0.5">
          {orderBook.asks.slice(0, 12).map((ask, i) => (
            <div key={i} className="grid grid-cols-3 text-xs relative">
              <div 
                className="absolute right-0 h-full bg-red-500/10" 
                style={{ width: `${Math.min(ask.total * 100 / 20, 100)}%` }}
              />
              <span className="text-red-400 z-10">{formatNumber(ask.price)}</span>
              <span className="text-right z-10">{formatNumber(ask.size)}</span>
              <span className="text-right z-10">{formatNumber(ask.total)}</span>
            </div>
          ))}
        </div>

        <div className="text-center py-2 text-sm font-medium border-y border-gray-800 my-2">
          <span className="text-green-400">{formatNumber(96071.00)}</span>
          <span className="text-gray-500 ml-2">${formatNumber(96071.00)}</span>
        </div>

        <div className="space-y-0.5">
          {orderBook.bids.slice(0, 12).map((bid, i) => (
            <div key={i} className="grid grid-cols-3 text-xs relative">
              <div 
                className="absolute right-0 h-full bg-green-500/10" 
                style={{ width: `${Math.min(bid.total * 100 / 20, 100)}%` }}
              />
              <span className="text-green-400 z-10">{formatNumber(bid.price)}</span>
              <span className="text-right z-10">{formatNumber(bid.size)}</span>
              <span className="text-right z-10">{formatNumber(bid.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
