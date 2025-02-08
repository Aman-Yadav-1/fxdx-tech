
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TradingControlsProps {
  className?: string;
}

export const TradingControls: React.FC<TradingControlsProps> = ({ className }) => {
  return (
    <div className={cn("flex gap-2 p-4 border-t border-gray-800", className)}>
      <Button 
        className="flex-1 bg-green-600 hover:bg-green-700 font-semibold"
        onClick={() => console.log('Long position')}
      >
        Long
      </Button>
      <Button 
        className="flex-1 bg-gray-800 hover:bg-gray-700 font-semibold"
        onClick={() => console.log('Short position')}
      >
        Short
      </Button>
    </div>
  );
};
