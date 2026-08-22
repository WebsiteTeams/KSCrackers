import { NextResponse } from 'next/server';
import { updateOrder } from '@/lib/dataAccess';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const updatedOrder = await updateOrder(resolvedParams.id, body);

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('API Error in PUT /api/orders/[id]:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
