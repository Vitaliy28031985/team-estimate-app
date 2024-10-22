import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema({ versionKey: false, timestamps: true })
export class Unit {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
