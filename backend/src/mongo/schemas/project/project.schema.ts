import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Estimate, EstimateSchema } from './estimate.schema';
import { Material, MaterialSchema } from './material.schema';
import { Advance, AdvanceSchema } from './advance.schema';
import { Price, PriceSchema } from '../price.schema';

export type ProjectDocument = Project & Document;

@Schema({ versionKey: false, timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [EstimateSchema], default: [] })
  estimates: Estimate[];

  @Prop({ type: [EstimateSchema], default: [] })
  lowEstimates: Estimate[];

  @Prop({ type: [MaterialSchema], default: [] })
  materials: Material[];

  @Prop({ type: [AdvanceSchema], default: [] })
  advances: Advance[];

  @Prop({ type: [PriceSchema], default: [] })
  prices: Price[];

  @Prop({ type: [PriceSchema], default: [] })
  lowPrices: Price[];

  @Prop({ required: true, default: 0 })
  discount: number;

  @Prop({ required: true, default: 0 })
  lowDiscount: number;

  @Prop({ required: true, default: 0 })
  discountPercentage: number;

  @Prop({ required: true, default: 0 })
  materialsTotal: number;

  @Prop({ required: true, default: 0 })
  advancesTotal: number;

  @Prop({ required: true, default: 0 })
  lowTotal: number;

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ required: true, default: 0 })
  lowGeneral: number;

  @Prop({ required: true, default: 0 })
  general: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, default: [] })
  allowList: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
