
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export const Header: React.FC = () => (
  <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
    <div className="flex items-center gap-4">
      <h1 className="text-lg font-bold text-white">BTC/USD</h1>
      <Button variant="ghost" size="sm" className="text-gray-400">
        <ChevronDown className="w-4 h-4 mr-1" />
        0.01
      </Button>
    </div>
    <Button className="bg-blue-600 hover:bg-blue-700">Connect wallet</Button>
  </div>
);
