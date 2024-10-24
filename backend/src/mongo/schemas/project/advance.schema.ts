import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdvanceDocument = Advance & Document;

@Schema({ versionKey: false, timestamps: true })
export class Advance {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  sum: number;
}
export const AdvanceSchema = SchemaFactory.createForClass(Advance);
