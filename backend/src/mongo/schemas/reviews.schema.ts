import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ versionKey: false, timestamps: true })
export class Review {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
