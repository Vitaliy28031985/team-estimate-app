import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type PriceListDocument = PriceList & Document;

@Schema({ versionKey: false, timestamps: true })
export class PriceList {
  @Prop({ type: Types.ObjectId, required: true })
  id: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const PriceListSchema = SchemaFactory.createForClass(PriceList);
