import {
  ConflictException,
  Injectable,
  Param,
  Req,
  UnauthorizedException,
  UploadedFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import { ErrorsApp } from 'src/common/errors';
import { EmailService } from 'src/email/email.service';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { UserGet } from 'src/interfaces/userGet';
import { User } from 'src/mongo/schemas/user/user.schema';
import { UserUpdateEmailDto } from './dtos/user.update.email.dto';
import { UserUpdatePhone } from './dtos/user.update.phone.dto';
import { UserUpdatePassword } from './dtos/user.update.password.dto';
import cloudinary from 'src/utils/cloudinary';
import { Readable } from 'stream';
import { UploadApiResponse } from 'cloudinary';
import { MessageApp } from 'src/common/message';
import { UserUpdateRoleDto } from './dtos/user.update.role.dto';
import { UserUpdateName } from './dtos/user.update.name.dto';
config();
const { VERIFY_EMAIL_LINK } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async getAllUsers() {
    const allUsers = await this.userModel.find();
    return allUsers;
  }

  async getCurrentUser(@Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.NOT_AUTHORIZED);
    }
    const typedUser = user as unknown as UserGet;

    return await typedUser;
  }

  async changeName(dto: UserUpdateName, @Req() req: RequestWithUser) {
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

  async changeRole(dto: UserUpdateRoleDto, @Req() req: RequestWithUser) {
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

  async changePassword(dto: UserUpdatePassword, @Req() req: RequestWithUser) {
    const { oldPassword, newPassword } = dto;
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.NOT_AUTHORIZED);
    }
    const typedUser = user as unknown as UserGet;

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException(ErrorsApp.BAD_PASSWORD);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return await this.userModel.findByIdAndUpdate(
      typedUser._id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true },
    );
  }

  async changeAvatar(
    @UploadedFile() file: Express.Multer.File,
    req: RequestWithUser,
  ) {
    if (!file || !file.buffer) {
      throw new Error(ErrorsApp.NOT_UPDATE_AVATAR);
    }

    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (error, data) => {
          if (error) {
            reject(new Error(ErrorsApp.NOT_UPDATE_AVATAR + error.message));
          }
          resolve(data as UploadApiResponse);
        },
      );

      bufferStream.pipe(uploadStream);
    });
    const avatarUrl = result.secure_url;

    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.NOT_AUTHORIZED);
    }
    const typedUser = user as unknown as UserGet;

    await this.userModel.findByIdAndUpdate(
      { _id: typedUser._id },
      { avatar: avatarUrl },
      {
        new: true,
        fields: ['-createdAt', '-updatedAt'],
      },
    );

    return { message: MessageApp.UPDATE_AVATAR };
  }
}
