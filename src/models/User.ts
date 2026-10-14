import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_EMPLOYEE' | 'ROLE_ADMIN';
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ['ROLE_CUSTOMER', 'ROLE_EMPLOYEE', 'ROLE_ADMIN'],
      default: 'ROLE_CUSTOMER',
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret: any) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export const UserModel = model<IUser>('User', userSchema);
