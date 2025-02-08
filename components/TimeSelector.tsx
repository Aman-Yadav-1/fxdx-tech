
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
  <div className="flex gap-2 text-sm text-gray-400 p-2 bg-gray-900">
    {['5m', '15m', '1h', '4h', 'D'].map((interval) => (
      <Button
        key={interval}
        variant="ghost"
        size="sm"
        className={interval === selectedInterval ? 'text-white' : ''}
        onClick={() => onIntervalChange(interval)}
      >
        {interval}
      </Button>
    ))}
    <div className="border-l border-gray-700 mx-2" />
    <Button variant="ghost" size="sm" className="flex items-center gap-1">
      <BarChart2 className="w-4 h-4" />
      Indicators
    </Button>
  </div>
);
