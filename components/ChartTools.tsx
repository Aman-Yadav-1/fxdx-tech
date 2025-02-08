
import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartToolsProps {
  className?: string;
}

export const ChartTools: React.FC<ChartToolsProps> = ({ className }) => {
  return (
    <div className={cn("absolute left-2 top-2 flex flex-col gap-1", className)}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1.5 hover:bg-gray-800 rounded-md"
      >
        <Maximize2 className="w-4 h-4 text-gray-400" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1.5 hover:bg-gray-800 rounded-md"
      >
        <Settings className="w-4 h-4 text-gray-400" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1.5 hover:bg-gray-800 rounded-md"
      >
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </Button>
    </div>
  );
};
