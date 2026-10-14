import { Schema, model, Document, Types } from 'mongoose';

export interface IFood extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: Types.ObjectId | string;
  categoryName?: string;
  available: boolean;
  isVeg: boolean;
  rating: number;
  preparationTimeMin: number;
  stockQuantity: number;
  createdAt: Date;
}

const foodSchema = new Schema<IFood>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName: { type: String },
    available: { type: Boolean, default: true },
    isVeg: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    preparationTimeMin: { type: Number, default: 20 },
    stockQuantity: { type: Number, default: 100 },
  },
  { timestamps: true }
);

foodSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: any) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret.__v;
    return ret;
  },
});

export const FoodModel = model<IFood>('Food', foodSchema);
