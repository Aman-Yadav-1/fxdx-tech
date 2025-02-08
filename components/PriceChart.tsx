import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { CandleData } from '@/types/trading';
import { ChartTools } from './ChartTools';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  data: CandleData[];
  className?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, className }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
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
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          borderColor: '#1f2937',
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: '#1f2937',
        },
      });

      const candlestickSeries: ISeriesApi<"Candlestick"> = chartRef.current.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444'
      });

      candlestickSeries.setData(data);

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ 
            width: chartContainerRef.current.clientWidth 
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, [data]);

  return (
    <div className={cn("relative h-[400px] bg-gray-900", className)}>
      <div ref={chartContainerRef} className="h-full" />
      <ChartTools />
    </div>
  );
};
