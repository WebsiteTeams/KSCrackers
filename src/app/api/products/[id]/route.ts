import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/dataAccess';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const updatedProduct = await updateProduct(resolvedParams.id, body);

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('API Error in PUT /api/products/[id]:', error);
    return NextResponse.json({ error: 'Failed to update product details' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const success = await deleteProduct(resolvedParams.id);

    if (!success) {
      return NextResponse.json({ error: 'Product not found or delete failed' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully', success: true });
  } catch (error) {
    console.error('API Error in DELETE /api/products/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
