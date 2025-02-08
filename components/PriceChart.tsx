import React, { useEffect, useRef } from 'react';
import { 
  createChart, 
  ColorType,
  ChartOptions,
  DeepPartial,
  ISeriesApi,
  CandlestickData,
  Time,
  IChartApi
} from 'lightweight-charts';
import { ChartTools } from './ChartTools';
import { cn } from '@/lib/utils';

interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceChartProps {
  data: CandleData[];
  className?: string;
}

const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    background: { color: '#111827' },
    textColor: '#d1d5db',
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
  },
  grid: {
    vertLines: { color: '#1f2937', style: 1 },
    horzLines: { color: '#1f2937', style: 1 },
  },
  crosshair: {
    mode: 1,
    vertLine: {
      color: '#374151',
      width: 1,
      style: 1,
      labelBackgroundColor: '#374151',
    },
    horzLine: {
      color: '#374151',
      width: 1,
      style: 1,
      labelBackgroundColor: '#374151',
    },
  },
  timeScale: {
    borderColor: '#1f2937',
    timeVisible: true,
    secondsVisible: false,
  },
  rightPriceScale: {
    borderColor: '#1f2937',
    scaleMargins: {
      top: 0.3,
      bottom: 0.25,
    },
  },
};

export const PriceChart: React.FC<PriceChartProps> = ({ data, className }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        ...chartOptions,
        width: chartContainerRef.current.clientWidth,
        height: 400,
      }) as IChartApi & { addCandlestickSeries(options: any): ISeriesApi<"Candlestick"> };

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      }) as ISeriesApi<"Candlestick">;

      candlestickSeries.setData(data);

      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ 
            width: chartContainerRef.current.clientWidth 
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <div className={cn("relative h-[400px] bg-gray-900 rounded-lg", className)}>
      <div ref={chartContainerRef} className="h-full w-full" />
      <ChartTools />
    </div>
  );
};

export default PriceChart;
