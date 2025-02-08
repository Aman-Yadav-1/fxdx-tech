import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderBookEntry {
  px: string;
  sz: string;
  side: 'A' | 'B';
}

interface OrderBookProps {
  orderBook: {
    levels: OrderBookEntry[];
  };
  className?: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({ orderBook, className }) => {
  const [displayUnit, setDisplayUnit] = useState<'BTC' | 'USD'>('BTC');

  const formatNumber = (num: string | number) => 
    Number(num).toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });

  const { bids, asks } = useMemo(() => {
    const bids: Array<{ price: string; size: string; total: number }> = [];
    const asks: Array<{ price: string; size: string; total: number }> = [];
    let bidTotal = 0;
    let askTotal = 0;

    orderBook?.levels?.forEach((level) => {
      const entry = {
        price: level.px,
        size: level.sz,
        total: 0
      };

      if (level.side === 'B') {
        bidTotal += Number(level.sz);
        entry.total = bidTotal;
        bids.push(entry);
      } else {
        askTotal += Number(level.sz);
        entry.total = askTotal;
        asks.push(entry);
      }
    });

    bids.sort((a, b) => Number(b.price) - Number(a.price));
    asks.sort((a, b) => Number(a.price) - Number(b.price));

    return { bids, asks };
  }, [orderBook]);

  const maxTotal = Math.max(
    ...(asks.map(ask => ask.total) || [0]),
    ...(bids.map(bid => bid.total) || [0])
  );

  return (
    <Card className={cn("bg-gray-900 border-gray-800 h-full flex flex-col", className)}>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-gray-200">Order Book</h2>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-800 rounded-lg p-0.5">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-xs px-3 py-1 rounded",
                  displayUnit === 'BTC' ? "bg-gray-700 text-white" : "text-gray-400"
                )}
                onClick={() => setDisplayUnit('BTC')}
              >
                BTC
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-xs px-3 py-1 rounded",
                  displayUnit === 'USD' ? "bg-gray-700 text-white" : "text-gray-400"
                )}
                onClick={() => setDisplayUnit('USD')}
              >
                USD
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-800">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 text-xs text-gray-400 mb-2 px-2">
          <span>Price</span>
          <span className="text-right">Size</span>
          <span className="text-right">Total</span>
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin">
          {/* Asks (Sell) Section - Red */}
          <div className="space-y-0.5">
            {asks.slice(0, 15).map((ask, i) => (
              <div key={i} className="grid grid-cols-3 text-xs relative px-2 py-0.5 hover:bg-gray-800/50">
                <div 
                  className="absolute right-0 h-full" 
                  style={{ 
                    width: `${(ask.total / maxTotal) * 100}%`,
                    background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)'
                  }}
                />
                <span className="text-red-400 z-10 font-mono">{formatNumber(ask.price)}</span>
                <span className="text-right z-10 font-mono">
                  {displayUnit === 'BTC' ? formatNumber(ask.size) : formatNumber(Number(ask.size) * Number(ask.price))}
                </span>
                <span className="text-right z-10 font-mono">{formatNumber(ask.total)}</span>
              </div>
            ))}
          </div>

          {/* Spread Section */}
          <div className="text-center py-2 text-sm font-medium border-y border-gray-800 my-1">
            <span className="text-gray-400">Spread: </span>
            <span className="text-gray-300">{formatNumber(Number(asks[0]?.price || 0) - Number(bids[0]?.price || 0))}</span>
          </div>

          {/* Bids (Buy) Section - Green */}
          <div className="space-y-0.5">
            {bids.slice(0, 15).map((bid, i) => (
              <div key={i} className="grid grid-cols-3 text-xs relative px-2 py-0.5 hover:bg-gray-800/50">
                <div 
  className="absolute right-0 h-full" 
  style={{ 
    width: `${(bid.total / maxTotal) * 100}%`,
    background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.5) 0%, rgba(34, 197, 94, 0.2) 100%)'
  }}
/>
                <span className="text-green-500 z-10 font-mono">{formatNumber(bid.price)}</span>
                <span className="text-right z-10 font-mono">
                  {displayUnit === 'BTC' ? formatNumber(bid.size) : formatNumber(Number(bid.size) * Number(bid.price))}
                </span>
                <span className="text-right z-10 font-mono">{formatNumber(bid.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
