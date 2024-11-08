import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Position, PositionSchema } from './position.schema';

export type EstimateDocument = Estimate & Document;

@Schema({ versionKey: false, timestamps: true })
export class Estimate {
  @Prop({ type: Types.ObjectId, required: true })
  id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [PositionSchema], default: [] })
  positions: Position[];

  @Prop({ required: true, default: 0 })
  total: number;
}
export const EstimateSchema = SchemaFactory.createForClass(Estimate);
