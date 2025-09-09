import { NextRequest, NextResponse } from 'next/server';
import { CurrencyAlert } from '@/types/currency';

// In-memory storage for demo purposes
// In a real application, this would be a database
let alerts: CurrencyAlert[] = [
  {
    id: '1',
    pairId: 'EURUSD',
    type: 'above',
    targetRate: 1.10,
    isActive: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
  },
  {
    id: '2',
    pairId: 'GBPUSD',
    type: 'below',
    targetRate: 1.25,
    isActive: true,
    createdAt: new Date('2024-01-14T15:30:00Z'),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        alerts: alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        total: alerts.length,
        active: alerts.filter(alert => alert.isActive).length,
      }
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch alerts'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pairId, type, targetRate } = await request.json();
    
    // Validation
    if (!pairId || !type || !targetRate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: pairId, type, and targetRate'
        },
        { status: 400 }
      );
    }
    
    if (!['above', 'below'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid type. Must be "above" or "below"'
        },
        { status: 400 }
      );
    }
    
    if (typeof targetRate !== 'number' || targetRate <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Target rate must be a positive number'
        },
        { status: 400 }
      );
    }
    
    // Create new alert
    const newAlert: CurrencyAlert = {
      id: Date.now().toString(),
      pairId,
      type,
      targetRate,
      isActive: true,
      createdAt: new Date(),
    };
    
    alerts.push(newAlert);
    
    return NextResponse.json({
      success: true,
      data: {
        alert: newAlert,
        message: 'Alert created successfully'
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create alert'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, isActive } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alert ID is required'
        },
        { status: 400 }
      );
    }
    
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    if (alertIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alert not found'
        },
        { status: 404 }
      );
    }
    
    // Update alert
    alerts[alertIndex] = {
      ...alerts[alertIndex],
      isActive: isActive !== undefined ? isActive : alerts[alertIndex].isActive,
    };
    
    return NextResponse.json({
      success: true,
      data: {
        alert: alerts[alertIndex],
        message: 'Alert updated successfully'
      }
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update alert'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alert ID is required'
        },
        { status: 400 }
      );
    }
    
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    if (alertIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Alert not found'
        },
        { status: 404 }
      );
    }
    
    // Remove alert
    const deletedAlert = alerts.splice(alertIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      data: {
        alert: deletedAlert,
        message: 'Alert deleted successfully'
      }
    });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete alert'
      },
      { status: 500 }
    );
  }
}