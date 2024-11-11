import { ConflictException, Injectable, Param, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import { ErrorsApp } from 'src/common/errors';
import { EmailService } from 'src/email/email.service';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { UserGet } from 'src/interfaces/userGet';
import { User } from 'src/mongo/schemas/user/user.schema';
import { UserUpdateEmailDto } from './dtos/user.update.email.dto';
import { UserUpdatePhone } from './dtos/user.update.phone.dto';
config();
const { VERIFY_EMAIL_LINK } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async getCurrentUser(@Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.NOT_AUTHORIZED);
    }
    const typedUser = user as unknown as UserGet;

    return await typedUser;
  }

  async changeName(dto: { name: string }, @Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.NOT_AUTHORIZED);
    }
    const typedUser = user as unknown as UserGet;

    return await this.userModel.findByIdAndUpdate({ _id: typedUser._id }, dto, {
      new: true,
      fields: ['-createdAt', '-updatedAt'],
    });
  }

  async changeEmail(dto: UserUpdateEmailDto, @Req() req: RequestWithUser) {
    const { email } = dto;
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.NOT_AUTHORIZED);
    }
    const typedUser = user as unknown as UserGet;

    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.userModel.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      throw new ConflictException(ErrorsApp.EXIST_USER);
    }
    const emailVerificationToken = uuidv4();

    const newEmail = await this.userModel.findByIdAndUpdate(
      typedUser._id,
      {
        $set: {
          email: normalizedEmail,
          verificationToken: emailVerificationToken,
          verify: false,
        },
      },
      { new: true },
    );

    const verificationLink = `${VERIFY_EMAIL_LINK}${emailVerificationToken}`;
    await this.emailService.sendConfirmationEmail(
      normalizedEmail,
      verificationLink,
    );

    return await newEmail;
  }

  async verifyEmail(@Param('verificationToken') verificationToken: string) {
    const user = await this.userModel.findOne({ verificationToken });
    if (!user) {
      throw new ConflictException(ErrorsApp.EMPTY_USER);
    }
    return this.userModel.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
  }

  async changePhone(dto: UserUpdatePhone, @Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.NOT_AUTHORIZED);
    }
    const typedUser = user as unknown as UserGet;

    return await this.userModel.findByIdAndUpdate({ _id: typedUser._id }, dto, {
      new: true,
      fields: ['-createdAt', '-updatedAt'],
    });
  }

  async changeRole(dto: { role: string }, @Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.NOT_AUTHORIZED);
    }
    const typedUser = user as unknown as UserGet;

    return await this.userModel.findByIdAndUpdate({ _id: typedUser._id }, dto, {
      new: true,
      fields: ['-createdAt', '-updatedAt'],
    });
  }
}
