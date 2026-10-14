import { Schema, model, Document } from 'mongoose';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface IOrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: IOrderItem[];
  subtotal: number;
  gstTax: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'ONLINE' | 'COD';
  otp: string;
  notes?: string;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    foodId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    deliveryAddress: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    gstTax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'],
      default: 'PENDING',
    },
    paymentMethod: { type: String, enum: ['ONLINE', 'COD'], default: 'ONLINE' },
    otp: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: any) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret.__v;
    return ret;
  },
});

export const OrderModel = model<IOrder>('Order', orderSchema);
