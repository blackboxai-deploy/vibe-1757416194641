import { NextRequest, NextResponse } from 'next/server';
import { CURRENCY_PAIRS, generateExchangeRate, calculateMarketSummary } from '@/lib/exchangeRates';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pairs = searchParams.get('pairs')?.split(',') || CURRENCY_PAIRS.map(p => p.id);
    
    // Filter requested pairs
    const requestedPairs = CURRENCY_PAIRS.filter(pair => pairs.includes(pair.id));
    
    // Generate current rates
    const rates = requestedPairs.map(pair => generateExchangeRate(pair));
    
    // Calculate market summary
    const marketSummary = calculateMarketSummary(rates);
    
    return NextResponse.json({
      success: true,
      data: {
        rates,
        marketSummary,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch exchange rates'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pairs } = await request.json();
    
    if (!Array.isArray(pairs)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pairs parameter. Expected array of pair IDs.'
        },
        { status: 400 }
      );
    }
    
    // Filter requested pairs
    const requestedPairs = CURRENCY_PAIRS.filter(pair => pairs.includes(pair.id));
    
    if (requestedPairs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid currency pairs found'
        },
        { status: 404 }
      );
    }
    
    // Generate current rates for requested pairs
    const rates = requestedPairs.map(pair => generateExchangeRate(pair));
    
    return NextResponse.json({
      success: true,
      data: {
        rates,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error processing rates request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request'
      },
      { status: 500 }
    );
  }
}