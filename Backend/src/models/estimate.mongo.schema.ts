import { Schema, Document } from 'mongoose';

export interface IEstimate extends Document {
  name: string;
  createdAt: Date;
}

export const EstimateMongoSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 255 },
  },
  {
    timestamps: true,
  },
);
