import { ObjectId } from 'mongoose';

export interface UserGet {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  role: 'customer' | 'admin';
  numberProjects: number;
  allowToken: string | null;
  token: string;
  projectIds: ObjectId[];
  price: number[];
  createdAt: Date;
  updatedAt: Date;
}
