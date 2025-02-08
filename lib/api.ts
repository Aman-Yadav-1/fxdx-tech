export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const API_BASE_URL = 'https://api.hyperliquid.xyz';

export async function fetchCandleData(
    coin: string = 'BTC',
    interval: string = '5m',
    startTime: number = Date.now() - 24 * 60 * 60 * 1000
  ): Promise<CandleData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: "meta",
          request: {
            type: "candleSnapshot",
            coin,
            interval,
            startTime
          }
        }),
      });
  
      const result = await response.json();
      
      if (!result.data || !Array.isArray(result.data.candles)) {
        return [];
      }
  
      return result.data.candles.map((candle: any) => ({
        timestamp: candle.t,
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c),
        volume: parseFloat(candle.v)
      }));
    } catch (error) {
      console.error('Error fetching candle data:', error);
      return [];
    }
  }
  