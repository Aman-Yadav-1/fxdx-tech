import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Header = () => (
  <div className="flex items-center h-16 px-4 bg-black border-b border-gray-800">
    <div className="flex items-center gap-2">
      <ChevronLeft className="w-6 h-6 text-white" />
      <ChevronRight className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1" />
    <Button className="bg-blue-600 hover:bg-blue-700">
      Connect Wallet
    </Button>
  </div>
);
