import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

categorySchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: any) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret.__v;
    return ret;
  },
});

export const CategoryModel = model<ICategory>('Category', categorySchema);
