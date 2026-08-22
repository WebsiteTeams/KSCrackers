import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/dataAccess';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Failed to fetch catalog products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = await createProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/products:', error);
    return NextResponse.json({ error: 'Failed to create new product' }, { status: 500 });
  }
}
