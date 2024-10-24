import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AllowDocument = Allow & Document;

@Schema()
export class Allow {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ enum: ['read', 'write'], required: true })
  allowLevel: string;

  @Prop({ enum: ['large', 'small', 'all'], required: true })
  lookAt: string;

  @Prop({ enum: ['show', 'notShow'], required: true })
  lookAtTotals: string;
}

export const AllowSchema = SchemaFactory.createForClass(Allow);
