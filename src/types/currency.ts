export interface CurrencyPair {
  id: string;
  base: string;
  quote: string;
  symbol: string;
  name: string;
}

export interface ExchangeRate {
  id: string;
  pair: CurrencyPair;
  rate: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: Date;
  bid: number;
  ask: number;
  spread: number;
}

export interface HistoricalData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CurrencyAlert {
  id: string;
  pairId: string;
  type: 'above' | 'below';
  targetRate: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface MarketSummary {
  totalPairs: number;
  gainers: number;
  losers: number;
  totalVolume: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  rate: number;
  fromCurrency: string;
  toCurrency: string;
  timestamp: Date;
  fees?: number;
}

export interface WatchlistItem {
  id: string;
  pairId: string;
  addedAt: Date;
  alertThreshold?: number;
}

export interface TrendAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  support: number;
  resistance: number;
  movingAverage: {
    ma20: number;
    ma50: number;
    ma200: number;
  };
}

export interface VolatilityMetrics {
  volatility: number;
  standardDeviation: number;
  averageTrueRange: number;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export type TimeRange = '1H' | '24H' | '7D' | '30D' | '90D' | '1Y' | 'ALL';

export type ChartType = 'line' | 'area' | 'candlestick' | 'bar';

export interface ChartData {
  timestamp: Date;
  value: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}