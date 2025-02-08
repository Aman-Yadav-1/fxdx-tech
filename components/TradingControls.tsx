import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export const TradingControls: React.FC = () => {
  const [orderType, setOrderType] = useState('limit');
  const [leverage, setLeverage] = useState(1);

  return (
    <div className="border-b border-gray-800">
      
      <div className="grid grid-cols-2 p-4 gap-2">
        <Button className="bg-green-600 hover:bg-green-700">
          Long
        </Button>
        <Button className="bg-red-600 hover:bg-red-700">
          Short
        </Button>
      </div>
    </div>
  );
};
