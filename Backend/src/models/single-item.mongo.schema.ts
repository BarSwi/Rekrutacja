import { Schema, Document } from 'mongoose';

export interface ISingleItem extends Document {
  estimateId: string;
  type: 'material' | 'service';
  name: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export const SingleItemMongoSchema = new Schema(
  {
    estimateId: { type: String, required: true, index: true },
    type: { type: String, enum: ['material', 'service'], required: true },
    name: { type: String, required: true, maxlength: 255 },
    quantity: { type: Number, required: false },
    unit: { type: String, required: false },
    unitPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);
