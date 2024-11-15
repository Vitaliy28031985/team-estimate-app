import { Types } from 'mongoose';

export interface PriceInterface {
  title: string;
  price: number;
  owner?: Types.ObjectId;
  _id?: Types.ObjectId;
  createdAt?: string;
  updatedAt?: string;
}
