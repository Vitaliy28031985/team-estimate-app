import { Types } from 'mongoose';
import { Price } from 'src/mongo/schemas/price.schema';
import { Advance } from 'src/mongo/schemas/project/advance.schema';
import { Material } from 'src/mongo/schemas/project/material.schema';

export interface LowProjectData {
  _id: Types.ObjectId;
  title: string;
  description: string;
  prices: Price[];
  materialsTotal: number;
  advancesTotal: number;
  materials: Material[];
  advances: Advance[];
}
