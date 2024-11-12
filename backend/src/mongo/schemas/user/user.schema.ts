import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Allow, AllowSchema } from './allow.schema';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  googleId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ minlength: 6, required: false })
  password: string;

  @Prop({
    default:
      'https://res.cloudinary.com/ddzcjknmj/image/upload/v1731220706/Group_427321632_xsewqc.png',
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

  @Prop({ default: null })
  refreshToken?: string;

  @Prop({ default: null })
  verifyCode: string;

  @Prop({ default: false })
  verify: boolean;

  @Prop({ required: false, default: null })
  verificationToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
