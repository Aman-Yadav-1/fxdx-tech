import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';

interface TimeSelectorProps {
  selectedInterval: string;
  onIntervalChange: (interval: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedInterval,
  onIntervalChange
}) => (
  <div className="flex items-center h-12 px-4 border-b border-gray-800">
    <div className="flex gap-1">
      {['5m', '15m', '1h', '4h', 'D', '1W', '1M'].map((interval) => (
        <Button
          key={interval}
          variant="ghost"
          size="sm"
          className={`h-8 ${
            interval === selectedInterval 
              ? 'bg-gray-800 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => onIntervalChange(interval)}
        >
          {interval}
        </Button>
      ))}
    </div>
    <div className="h-5 mx-4 border-l border-gray-800" />
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 text-gray-400 hover:text-white"
    >
      <BarChart2 className="h-4 w-4 mr-2" />
      Indicators
    </Button>
  </div>
);
