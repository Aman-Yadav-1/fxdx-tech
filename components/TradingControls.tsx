import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const TradingControls: React.FC = () => {
    const [activePosition, setActivePosition] = useState<'long' | 'short' | null>('long');

  return (
    <div className="h-full flex flex-col bg-gray-900 p-4">
      <div className="flex gap-3">
        <Button 
          className={cn(
            "flex-1 h-10 text-sm font-semibold rounded-lg transition-all",
            activePosition === 'long' 
              ? "bg-green-500/20 text-green-500 border-2 border-green-500"
              : "bg-transparent text-gray-400 hover:text-green-500"
          )}
          onClick={() => setActivePosition(activePosition === 'long' ? null : 'long')}
        >
          Long
        </Button>
        <Button 
          className={cn(
            "flex-1 h-10 text-sm font-semibold rounded-lg transition-all",
            activePosition === 'short'
              ? "bg-red-500/20 text-red-500 border-2 border-red-500"
              : "bg-transparent text-gray-400 hover:text-red-500"
          )}
          onClick={() => setActivePosition(activePosition === 'short' ? null : 'short')}
        >
          Short
        </Button>
      </div>
    </div>
  );
};
