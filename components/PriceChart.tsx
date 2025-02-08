import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card } from './ui/card';

interface PriceChartProps {
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  return (
    <Card className="w-full h-[600px] bg-gray-900 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
          />
          <YAxis 
            stroke="#6b7280"
            domain={['auto', 'auto']}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
            labelStyle={{ color: '#d1d5db' }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PriceChart;