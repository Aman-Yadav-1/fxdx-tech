import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { CandleData } from '@/types/trading';
import { ApexOptions } from 'apexcharts';
import { ChartTools } from './ChartTools';

const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-900" />
});

interface PriceChartProps {
  data: CandleData[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'bar'>('candlestick');
  const [crosshairEnabled, setCrosshairEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = useCallback(() => {
    const element = document.documentElement;
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const chartOptions: ApexOptions = {
    chart: {
      type: chartType,
      height: 600,
      background: '#111827',
      foreColor: '#d1d5db',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },
    grid: {
      borderColor: '#1f2937',
      padding: {
        left: 45  // Add padding for tools
      },
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px'
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#10b981',
          downward: '#ef4444'
        }
      },
      bar: {
        columnWidth: '80%'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#6b7280' },
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      },
      axisBorder: {
        color: '#1f2937'
      },
      axisTicks: {
        color: '#1f2937'
      }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
        style: { colors: '#6b7280' }
      }
    },
    theme: { 
      mode: 'dark',
      palette: 'palette1'
    }
  };

  const series = [{
    name: 'BTC/USD',
    data: data.map(candle => 
      chartType === 'line' 
        ? {
            x: new Date(candle.time),
            y: candle.close
          }
        : {
            x: new Date(candle.time),
            y: [candle.open, candle.high, candle.low, candle.close]
          }
    )
  }];

  return (
    <div className="relative w-full h-[600px] bg-gray-900 pl-12"> {/* Added padding-left */}
      <ChartTools
        onChartTypeChange={setChartType}
        onToggleCrosshair={() => setCrosshairEnabled(!crosshairEnabled)}
        onToggleFullscreen={handleFullscreen}
        onToggleSettings={() => console.log('Settings clicked')}
      />
      <Chart
        options={chartOptions}
        series={series}
        type={chartType}
        height={600}
      />
    </div>
  );
};

export default PriceChart;
