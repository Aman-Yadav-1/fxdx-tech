import React from 'react';

interface VolumeBarChartProps {
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

const VolumeBarChart: React.FC<VolumeBarChartProps> = ({ data }) => {
  const latest = data[data.length - 1] || {
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const boxes = [
    { label: 'L', value: formatNumber(latest.low), color: 'bg-red-600' },
    { label: 'O', value: formatNumber(latest.open), color: 'bg-red-500' },
    { label: 'Vol', value: `${formatNumber(latest.volume)} BTC`, color: 'bg-gray-700' },
    { label: 'C', value: formatNumber(latest.close), color: 'bg-green-500' },
    { label: 'H', value: formatNumber(latest.high), color: 'bg-green-600' }
  ];

  return (
    <div className="grid grid-cols-5 gap-1 px-4 py-3 bg-gray-900 h-20">
      {boxes.map((box, index) => (
        <div 
          key={index} 
          className={`${box.color} relative group cursor-pointer`}
        >
          <div className="absolute invisible group-hover:visible bg-black/80 text-white px-2 py-1 rounded text-sm -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            {`${box.label}: ${box.value}`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VolumeBarChart;
