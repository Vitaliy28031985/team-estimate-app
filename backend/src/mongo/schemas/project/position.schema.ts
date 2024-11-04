import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PositionDocument = Position & Document;

@Schema({ versionKey: false, timestamps: true })
export class Position {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  result: number;
}
export const PositionSchema = SchemaFactory.createForClass(Position);
