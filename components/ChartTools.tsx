import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Maximize2, 
  Settings, 
  LineChart, 
  Crosshair, 
  ChevronDown,
  CandlestickChart,
  BarChart
} from 'lucide-react';

type ChartType = 'line' | 'candlestick' | 'bar';

interface ChartToolsProps {
  onChartTypeChange?: (type: ChartType) => void;
  onToggleCrosshair?: () => void;
  onToggleFullscreen?: () => void;
  onToggleSettings?: () => void;
}

interface ToolButtonProps {
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon: Icon, active, onClick }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    className={`h-8 w-8 p-0 rounded-md transition-colors ${
      active 
        ? "bg-gray-700 text-white" 
        : "hover:bg-gray-800 text-gray-400"
    }`}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

export const ChartTools: React.FC<ChartToolsProps> = ({
  onChartTypeChange,
  onToggleCrosshair,
  onToggleFullscreen,
  onToggleSettings
}) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [crosshairActive, setCrosshairActive] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
    onChartTypeChange?.(type);
  };

  const handleCrosshairToggle = () => {
    setCrosshairActive(!crosshairActive);
    onToggleCrosshair?.();
  };

  return (
    <div className={`absolute left-2 top-2 flex flex-col gap-1.5 z-10 bg-gray-900/50 p-1 rounded-lg backdrop-blur-sm transition-transform ${
      isCollapsed ? 'translate-x-[-90%]' : ''
    }`}>
      <ToolButton 
        icon={LineChart} 
        active={chartType === 'line'} 
        onClick={() => handleChartTypeChange('line')}
      />
      <ToolButton 
        icon={CandlestickChart} 
        active={chartType === 'candlestick'} 
        onClick={() => handleChartTypeChange('candlestick')}
      />
      <ToolButton 
        icon={BarChart} 
        active={chartType === 'bar'} 
        onClick={() => handleChartTypeChange('bar')}
      />
      <div className="h-px bg-gray-800 mx-1" />
      <ToolButton 
        icon={Crosshair} 
        active={crosshairActive}
        onClick={handleCrosshairToggle}
      />
      <ToolButton 
        icon={Settings} 
        onClick={onToggleSettings}
      />
      <ToolButton 
        icon={Maximize2} 
        onClick={onToggleFullscreen}
      />
      <div className="h-px bg-gray-800 mx-1" />
      <ToolButton 
        icon={ChevronDown} 
        onClick={() => setIsCollapsed(!isCollapsed)}
      />
    </div>
  );
};
