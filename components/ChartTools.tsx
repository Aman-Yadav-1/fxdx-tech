import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Maximize2, 
  Settings, 
  LineChart, 
  Crosshair, 
  ChevronDown 
} from 'lucide-react';

interface ToolButtonProps {
  icon: React.ElementType;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon: Icon }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    className="h-8 w-8 p-0 hover:bg-gray-800 rounded-md"
  >
    <Icon className="h-4 w-4 text-gray-400" />
  </Button>
);

export const ChartTools: React.FC = () => (
  <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
    <ToolButton icon={Maximize2} />
    <ToolButton icon={Settings} />
    <ToolButton icon={LineChart} />
    <ToolButton icon={Crosshair} />
    <div className="h-px bg-gray-800 my-1" />
    <ToolButton icon={ChevronDown} />
  </div>
);
