import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Allow, AllowSchema } from './allow.schema';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ minlength: 6, required: true })
  password: string;

  @Prop({
    default:
      'https://www.shutterstock.com/image-illustration/avatar-modern-young-guy-working-260nw-2015853839.jpg',
    required: true,
  })
  avatar?: string;

  @Prop({
    enum: ['executor', 'customer', 'admin'],
    default: 'customer',
    required: true,
  })
  role: string;

  @Prop({ type: [AllowSchema], default: [] })
  projectIds: Allow[];

  @Prop({ default: null })
  token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
