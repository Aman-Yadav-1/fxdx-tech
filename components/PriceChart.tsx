import dynamic from 'next/dynamic';
import { CandleData } from '@/types/trading';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-900" />
});

interface PriceChartProps {
  data: CandleData[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick' as const,
      height: 600,
      background: '#111827',
      foreColor: '#d1d5db',
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        }
      }
    },
    grid: {
      borderColor: '#1f2937',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#10b981',
          downward: '#ef4444'
        }
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
      }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
        style: { colors: '#6b7280' }
      }
    },
    theme: { mode: 'dark' }
  };

  const series = [{
    name: 'BTC/USD',
    data: data.map(candle => ({
      x: new Date(candle.time),
      y: [candle.open, candle.high, candle.low, candle.close]
    }))
  }];

  return (
    <div className="w-full h-[600px] bg-gray-900">
      <Chart
        options={chartOptions}
        series={series}
        type="candlestick"
        height={600}
      />
    </div>
  );
};

export default PriceChart;
