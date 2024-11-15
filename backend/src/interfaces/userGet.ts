import { Types } from 'mongoose';

export interface UserGet {
  _id: Types.ObjectId;
  role: string;
  projectIds: Array<{
    id: string;
    userId: string;
    allowLevel: string;
    lookAt: string;
    lookAtTotals: string;
    _id: Types.ObjectId;
  }>;
}
