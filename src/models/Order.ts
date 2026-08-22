import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderDocument extends Document {
  orderNumber: string;
  customer: {
    name: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
    deliveryType: 'Delivery' | 'Pickup';
    notes?: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'New' | 'Confirmed' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      deliveryType: { type: String, enum: ['Delivery', 'Pickup'], required: true },
      notes: { type: String },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['New', 'Confirmed', 'Processing', 'Ready', 'Completed', 'Cancelled'],
      default: 'New',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
