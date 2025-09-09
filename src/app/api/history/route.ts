import { NextRequest, NextResponse } from 'next/server';
import { generateHistoricalData, CURRENCY_PAIRS, calculateTrendAnalysis, calculateVolatilityMetrics } from '@/lib/exchangeRates';
import { TimeRange } from '@/types/currency';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pairId = searchParams.get('pair');
    const timeRange = (searchParams.get('range') as TimeRange) || '30D';
    
    if (!pairId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pair ID is required'
        },
        { status: 400 }
      );
    }
    
    // Validate pair exists
    const pair = CURRENCY_PAIRS.find(p => p.id === pairId);
    if (!pair) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid currency pair'
        },
        { status: 404 }
      );
    }
    
    // Convert time range to days
    const rangeToDays: Record<TimeRange, number> = {
      '1H': 1,
      '24H': 1,
      '7D': 7,
      '30D': 30,
      '90D': 90,
      '1Y': 365,
      'ALL': 1000,
    };
    
    const days = rangeToDays[timeRange];
    
    // Generate historical data
    const historicalData = generateHistoricalData(pairId, days);
    
    // Calculate trend analysis and volatility metrics
    const trendAnalysis = calculateTrendAnalysis(historicalData);
    const volatilityMetrics = calculateVolatilityMetrics(historicalData);
    
    return NextResponse.json({
      success: true,
      data: {
        pair,
        timeRange,
        historicalData,
        trendAnalysis,
        volatilityMetrics,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch historical data'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pairs, timeRange = '30D' } = await request.json();
    
    if (!Array.isArray(pairs)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pairs parameter. Expected array of pair IDs.'
        },
        { status: 400 }
      );
    }
    
    // Convert time range to days
    const rangeToDays: Record<TimeRange, number> = {
      '1H': 1,
      '24H': 1,
      '7D': 7,
      '30D': 30,
      '90D': 90,
      '1Y': 365,
      'ALL': 1000,
    };
    
    const days = rangeToDays[timeRange as TimeRange] || 30;
    
    // Generate historical data for all requested pairs
    const results = pairs.map(pairId => {
      const pair = CURRENCY_PAIRS.find(p => p.id === pairId);
      if (!pair) return null;
      
      const historicalData = generateHistoricalData(pairId, days);
      const trendAnalysis = calculateTrendAnalysis(historicalData);
      const volatilityMetrics = calculateVolatilityMetrics(historicalData);
      
      return {
        pair,
        historicalData,
        trendAnalysis,
        volatilityMetrics,
      };
    }).filter(Boolean);
    
    return NextResponse.json({
      success: true,
      data: {
        timeRange,
        results,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error processing historical data request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request'
      },
      { status: 500 }
    );
  }
}