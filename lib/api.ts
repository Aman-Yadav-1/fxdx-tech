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
  const response = await fetch(`${API_BASE_URL}/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: "candleSnapshot",
      coin,
      interval,
      startTime,
    }),
  });
  return response.json();
}
