import { Types } from 'mongoose';

export interface AlowUserList {
  id: string;
  userId: string;
  allowLevel: string;
  lookAt: string;
  lookAtTotals: string;
  _id: Types.ObjectId;
}
