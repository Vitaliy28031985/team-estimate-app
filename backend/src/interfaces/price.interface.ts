import { Types } from 'mongoose';

export interface PriceInterfaceLow {
  id?: Types.ObjectId;

  title: string;

  price: number;

  updateAllow?: boolean;
}
