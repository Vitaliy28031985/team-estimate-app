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

import { EmailService } from '../email/email.service';
import { User } from 'src/mongo/schemas/user/user.schema';
import { UserGet } from 'src/interfaces/userGet';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { AuthCreateDto } from './auth-dto/auth.create.dto';
import { AuthLoginDto } from './auth-dto/auth.login.dto';
import { ErrorsApp } from 'src/common/errors';
config();
const { VERIFY_LINK } = process.env;

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
    const verificationLink = `${VERIFY_LINK}${emailVerificationToken}`;
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
    return this.userModel.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
  }

  async validateOAuthLogin(
    googleId: string,
    email: string,
    displayName: string,
  ): Promise<User> {
    let user = await this.userModel.findOne({ googleId });

    if (!user) {
      user = await this.userModel.create({
        googleId,
        email,
        name: displayName,
        verify: true,
      });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '24h' });

    return { ...user.toObject(), token };
  }

  loginWithGoogle(user: User) {
    // console.log(user);
    if (!user) {
      throw new Error('Method not implemented.');
    }
  }

  async login(loginDto: AuthLoginDto): Promise<{ token: string }> {
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

    await this.userModel.findByIdAndUpdate(user._id, { $set: { token } });

    return { token };
  }

  async logout(@Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    return this.userModel.findByIdAndUpdate(typedUser._id, { token: null });
  }
}
