import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PriceList, PriceListSchema } from './prices.list';

export type MiddlePriceDocument = MiddlePrice & Document;

@Schema({ versionKey: false, timestamps: true })
export class MiddlePrice {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [PriceListSchema], default: [] })
  prices: PriceList[];
}

export const MiddlePriceSchema = SchemaFactory.createForClass(MiddlePrice);
