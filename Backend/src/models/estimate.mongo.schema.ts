import { Schema, Document } from 'mongoose';

export enum ItemType {
  MATERIAL = 'material',
  SERVICE = 'service',
}

export interface ISingleItem {
  _id?: string;
  type: ItemType;
  name: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
}

export interface IEstimate extends Document {
  name: string;
  items: ISingleItem[];
  createdAt: Date;
}

const SingleItemSchema = new Schema({
  type: { type: String, enum: Object.values(ItemType), required: true },
  name: { type: String, required: true, maxlength: 255 },
  quantity: { type: Number, required: false },
  unit: { type: String, required: false },
  unitPrice: { type: Number, required: false },
  totalPrice: { type: Number, required: false },
});

export const EstimateMongoSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 255 },
    items: [SingleItemSchema],
  },
  {
    timestamps: true,
  },
);
