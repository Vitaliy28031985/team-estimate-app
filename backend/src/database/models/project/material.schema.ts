import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MaterialDocument = Material & Document;

@Schema({ versionKey: false, timestamps: true })
export class Material {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  order: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  sum: number;
}
export const MaterialSchema = SchemaFactory.createForClass(Material);
