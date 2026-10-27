import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  category: string;
  quantity: number;
  price: number;
}

const ItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>('Item', ItemSchema);