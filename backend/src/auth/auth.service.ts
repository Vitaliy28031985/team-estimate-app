import {
  ConflictException,
  Injectable,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { User } from 'src/mongo/schemas/user/user.schema';
import { UserGet } from 'src/interfaces/userGet';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { AuthCreateDto } from './auth-dto/auth.create.dto';
import { AuthLoginDto } from './auth-dto/auth.login.dto';
import { ErrorsApp } from 'src/common/errors';
import { UserUpdateEmailDto } from 'src/user/dtos/user.update.email.dto';
import { VerifyCodeDto } from './auth-dto/verify.code.dto';
import { MessageApp } from 'src/common/message';
config();
const { VERIFY_EMAIL_LINK } = process.env;

@Injectable()
export class AuthService {
  private readonly secretKey = process.env.SECRET_KEY;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async register(userDto: AuthCreateDto): Promise<User> {
    const { email, password } = userDto;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.userModel.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      throw new ConflictException(ErrorsApp.EXIST_USER);
    }
    const emailVerificationToken = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create({
      ...userDto,
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken: emailVerificationToken,
    });
    const verificationLink = `${VERIFY_EMAIL_LINK}${emailVerificationToken}`;
    await this.emailService.sendConfirmationEmail(
      normalizedEmail,
      verificationLink,
    );
    return newUser;
  }

  async verifyEmail(@Param('verificationToken') verificationToken: string) {
    const user = await this.userModel.findOne({ verificationToken });
    if (!user) {
      throw new ConflictException(ErrorsApp.EMPTY_USER);
    }
    await this.userModel.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    const payload = { id: user._id };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, this.secretKey, {
      expiresIn: '7d',
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { token, refreshToken },
    });

    return { token, refreshToken };
  }

  async validateOAuthLogin(
    googleId: string,
    email: string,
    displayName: string,
    photos: string,
  ): Promise<User> {
    let user = await this.userModel.findOne({ googleId });

    if (!user) {
      user = await this.userModel.create({
        googleId,
        email,
        name: displayName,
        avatar: photos,
        verify: true,
      });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, this.secretKey, {
      expiresIn: '7d',
    });

    return { ...user.toObject(), token, refreshToken };
  }

  async loginWithGoogle(user: any) {
    if (!user) {
      throw new Error('Користувача не знайдено');
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, this.secretKey, {
      expiresIn: '7d',
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { token, refreshToken },
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async login(
    loginDto: AuthLoginDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const normalizedEmail = email.toLowerCase();

    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedException(ErrorsApp.EMPTY_USER);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException(ErrorsApp.BAD_PASSWORD);
    }
    if (!user.verify) {
      throw new ConflictException(ErrorsApp.NOT_VERIFICATION(normalizedEmail));
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, this.secretKey, {
      expiresIn: '7d',
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { token, refreshToken },
    });

    return { token, refreshToken };
  }

  async refreshToken(
    req: RequestWithUser,
  ): Promise<{ token: string; refreshToken: string }> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;
    const payload = { id: typedUser._id };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, this.secretKey, {
      expiresIn: '7d',
    });
    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { token, refreshToken },
    });

    return { token, refreshToken };
  }

  async logout(@Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    return this.userModel.findByIdAndUpdate(typedUser._id, { token: null });
  }

  async sendVerifyCode(dto: UserUpdateEmailDto) {
    const normalizedEmail = dto.email.toLowerCase();

    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedException(ErrorsApp.EMPTY_USER);
    }

    const verifyCode = this.generateRandomNumber();

    await this.emailService.sendPinEmail(dto.email, verifyCode);

    await this.userModel.findByIdAndUpdate(user._id, {
      verifyCode,
    });

    return { message: MessageApp.SEND_VERIFY_CODE };
  }

  async verifyCode(dto: VerifyCodeDto) {
    const normalizedEmail = dto.email.toLowerCase();

    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedException(ErrorsApp.EMPTY_USER);
    }

    if (Number(user.verifyCode) !== dto.code) {
      throw new UnauthorizedException(ErrorsApp.BAD_CODE);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      verifyCode: null,
      verify: true,
    });

    return { message: MessageApp.UPDATE_PASSWORD };
  }

  generateRandomNumber(): number {
    const buffer = randomBytes(5);

    const randomNumber = buffer.readUInt32BE(0) * 256 + buffer[4];
    return (
      Math.floor(
        (randomNumber / 0xffffffffff) * (9999999999 - 1000000000 + 1),
      ) + 1000000000
    );
  }
}
