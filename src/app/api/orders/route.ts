import { NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/dataAccess';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Error in GET /api/orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = await createOrder(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/orders:', error);
    return NextResponse.json({ error: 'Failed to process checkout order' }, { status: 500 });
  }
}
