import { Types } from 'mongoose';

export interface EstimateInterface {
  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  title: string;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
  positions: any[];
}
