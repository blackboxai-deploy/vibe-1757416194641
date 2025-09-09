'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExchangeRate, CurrencyPair, MarketSummary } from '@/types/currency';
import { CURRENCY_PAIRS, generateExchangeRate, calculateMarketSummary } from '@/lib/exchangeRates';

export function useExchangeRates(updateInterval: number = 5000) {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const generateRates = useCallback(() => {
    try {
      const newRates: ExchangeRate[] = CURRENCY_PAIRS.map((pair: CurrencyPair) => {
        const existingRate = rates.find(r => r.id === pair.id);
        return generateExchangeRate(pair, existingRate);
      });
      
      setRates(newRates);
      setMarketSummary(calculateMarketSummary(newRates));
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to generate exchange rates');
      console.error('Exchange rate generation error:', err);
    }
  }, [rates]);

  const refreshRates = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      generateRates();
    } finally {
      setIsLoading(false);
    }
  }, [generateRates]);

  // Initial load
  useEffect(() => {
    refreshRates();
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (updateInterval > 0) {
      const interval = setInterval(generateRates, updateInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [generateRates, updateInterval]);

  const getRateByPairId = useCallback((pairId: string): ExchangeRate | undefined => {
    return rates.find(rate => rate.id === pairId);
  }, [rates]);

  const getRatesByPairs = useCallback((pairIds: string[]): ExchangeRate[] => {
    return rates.filter(rate => pairIds.includes(rate.id));
  }, [rates]);

  return {
    rates,
    marketSummary,
    isLoading,
    error,
    lastUpdated,
    refreshRates,
    getRateByPairId,
    getRatesByPairs,
  };
}