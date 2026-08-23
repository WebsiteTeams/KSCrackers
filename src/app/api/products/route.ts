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

    if (!body.name || !body.description || !body.sellingPrice) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, sellingPrice' },
        { status: 400 }
      );
    }

    const newProduct = await createProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/products:', error);
    const message = error instanceof Error ? error.message : 'Failed to create new product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
