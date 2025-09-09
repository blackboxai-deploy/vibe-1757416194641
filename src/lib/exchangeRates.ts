import { CurrencyPair, ExchangeRate, HistoricalData, MarketSummary, TrendAnalysis, VolatilityMetrics } from '@/types/currency';

// Popular currency pairs for the exchange monitor
export const CURRENCY_PAIRS: CurrencyPair[] = [
  { id: 'EURUSD', base: 'EUR', quote: 'USD', symbol: 'EUR/USD', name: 'Euro / US Dollar' },
  { id: 'GBPUSD', base: 'GBP', quote: 'USD', symbol: 'GBP/USD', name: 'British Pound / US Dollar' },
  { id: 'USDJPY', base: 'USD', quote: 'JPY', symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
  { id: 'USDCHF', base: 'USD', quote: 'CHF', symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
  { id: 'AUDUSD', base: 'AUD', quote: 'USD', symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
  { id: 'USDCAD', base: 'USD', quote: 'CAD', symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
  { id: 'NZDUSD', base: 'NZD', quote: 'USD', symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar' },
  { id: 'EURGBP', base: 'EUR', quote: 'GBP', symbol: 'EUR/GBP', name: 'Euro / British Pound' },
  { id: 'EURJPY', base: 'EUR', quote: 'JPY', symbol: 'EUR/JPY', name: 'Euro / Japanese Yen' },
  { id: 'GBPJPY', base: 'GBP', quote: 'JPY', symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen' },
];

// Base exchange rates (these will be modified with realistic fluctuations)
const BASE_RATES: Record<string, number> = {
  'EURUSD': 1.0875,
  'GBPUSD': 1.2634,
  'USDJPY': 149.82,
  'USDCHF': 0.8756,
  'AUDUSD': 0.6542,
  'USDCAD': 1.3698,
  'NZDUSD': 0.5892,
  'EURGBP': 0.8607,
  'EURJPY': 162.95,
  'GBPJPY': 189.34,
};

// Generate realistic price fluctuation
export function generateRateFluctuation(baseRate: number, volatility: number = 0.02): number {
  const random = Math.random() - 0.5; // -0.5 to 0.5
  const fluctuation = random * volatility;
  return baseRate * (1 + fluctuation);
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

// Generate mock exchange rate data
export function generateExchangeRate(pair: CurrencyPair, previousRate?: ExchangeRate): ExchangeRate {
  const baseRate = BASE_RATES[pair.id];
  const currentRate = generateRateFluctuation(baseRate, 0.015);
  
  const previousClose = previousRate?.rate || baseRate;
  const change24h = currentRate - previousClose;
  const changePercent24h = calculatePercentageChange(currentRate, previousClose);
  
  const volatility = Math.abs(changePercent24h) * 0.1;
  const spread = currentRate * 0.0001; // 1 pip spread
  
  return {
    id: pair.id,
    pair,
    rate: currentRate,
    change24h,
    changePercent24h,
    high24h: currentRate * (1 + volatility),
    low24h: currentRate * (1 - volatility),
    volume24h: Math.random() * 1000000000, // Random volume
    lastUpdated: new Date(),
    bid: currentRate - spread / 2,
    ask: currentRate + spread / 2,
    spread,
  };
}

// Generate historical data for charts
export function generateHistoricalData(pairId: string, days: number = 30): HistoricalData[] {
  const baseRate = BASE_RATES[pairId];
  const data: HistoricalData[] = [];
  let currentRate = baseRate;
  
  for (let i = days - 1; i >= 0; i--) {
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - i);
    
    // Generate realistic OHLC data
    const open = currentRate;
    const volatility = 0.01 + Math.random() * 0.02; // 1-3% daily volatility
    const high = open * (1 + Math.random() * volatility);
    const low = open * (1 - Math.random() * volatility);
    const close = low + Math.random() * (high - low);
    const volume = Math.random() * 10000000;
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentRate = close;
  }
  
  return data;
}

// Calculate market summary
export function calculateMarketSummary(rates: ExchangeRate[]): MarketSummary {
  const gainers = rates.filter(rate => rate.changePercent24h > 0).length;
  const losers = rates.filter(rate => rate.changePercent24h < 0).length;
  const totalVolume = rates.reduce((sum, rate) => sum + rate.volume24h, 0);
  
  return {
    totalPairs: rates.length,
    gainers,
    losers,
    totalVolume,
    marketCap: totalVolume * 1.5, // Approximate market cap
    lastUpdated: new Date(),
  };
}

// Calculate trend analysis
export function calculateTrendAnalysis(historicalData: HistoricalData[]): TrendAnalysis {
  if (historicalData.length < 20) {
    return {
      trend: 'neutral',
      strength: 50,
      support: 0,
      resistance: 0,
      movingAverage: { ma20: 0, ma50: 0, ma200: 0 },
    };
  }
  
  const closePrices = historicalData.map(d => d.close);
  const ma20 = calculateMovingAverage(closePrices, 20);
  const ma50 = calculateMovingAverage(closePrices, 50);
  const ma200 = calculateMovingAverage(closePrices, 200);
  
  const currentPrice = closePrices[closePrices.length - 1];
  const priceChange = ((currentPrice - closePrices[closePrices.length - 10]) / closePrices[closePrices.length - 10]) * 100;
  
  let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let strength = 50;
  
  if (currentPrice > ma20 && ma20 > ma50) {
    trend = 'bullish';
    strength = Math.min(100, 50 + Math.abs(priceChange) * 5);
  } else if (currentPrice < ma20 && ma20 < ma50) {
    trend = 'bearish';
    strength = Math.min(100, 50 + Math.abs(priceChange) * 5);
  }
  
  const support = Math.min(...closePrices.slice(-20));
  const resistance = Math.max(...closePrices.slice(-20));
  
  return {
    trend,
    strength,
    support,
    resistance,
    movingAverage: { ma20, ma50, ma200 },
  };
}

// Calculate moving average
export function calculateMovingAverage(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

// Calculate volatility metrics
export function calculateVolatilityMetrics(historicalData: HistoricalData[]): VolatilityMetrics {
  const closePrices = historicalData.map(d => d.close);
  const returns = closePrices.slice(1).map((price, i) => 
    Math.log(price / closePrices[i])
  );
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility
  
  const standardDeviation = Math.sqrt(variance);
  const ma20 = calculateMovingAverage(closePrices, 20);
  const stdDev20 = Math.sqrt(
    closePrices.slice(-20).reduce((sum, price) => sum + Math.pow(price - ma20, 2), 0) / 20
  );
  
  return {
    volatility,
    standardDeviation: standardDeviation * 100,
    averageTrueRange: stdDev20,
    bollingerBands: {
      upper: ma20 + (stdDev20 * 2),
      middle: ma20,
      lower: ma20 - (stdDev20 * 2),
    },
  };
}

// Format currency value
export function formatCurrency(value: number, decimals: number = 4): string {
  return value.toFixed(decimals);
}

// Format percentage
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Convert currency amount
export function convertCurrency(
  amount: number,
  fromRate: number,
  toRate: number,
  fees: number = 0
): number {
  const converted = (amount / fromRate) * toRate;
  return converted * (1 - fees / 100);
}