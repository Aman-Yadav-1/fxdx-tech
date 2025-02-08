import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TradingControlsProps {
  className?: string;
}

export const TradingControls: React.FC<TradingControlsProps> = ({ className }) => {
  const [leverage, setLeverage] = useState(1);

  return (
    <div className={cn("flex flex-col gap-4 p-4 border-t border-gray-800", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Leverage: {leverage}x</span>
        <input 
          type="range" 
          min="1" 
          max="100" 
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-32"
        />
      </div>
      <div className="flex gap-2">
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700 font-semibold"
          onClick={() => console.log('Long position')}
        >
          Long
        </Button>
        <Button 
          className="flex-1 bg-red-600 hover:bg-red-700 font-semibold"
          onClick={() => console.log('Short position')}
        >
          Short
        </Button>
      </div>
    </div>
  );
};
