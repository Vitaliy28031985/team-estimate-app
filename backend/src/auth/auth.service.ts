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
config();
const { VERIFY_LINK } = process.env;

@Injectable()
export class AuthService {
  private readonly secretKey = process.env.SECRET_KEY;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async register(userDto: User): Promise<User> {
    const { email, password } = userDto;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.userModel.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      throw new ConflictException(
        'Email вже використовується іншим користувачем',
      );
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
      throw new ConflictException('Такого юзера не існує!');
    }
    return this.userModel.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
  }

  async login(loginDto: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const normalizedEmail = email.toLowerCase();

    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedException(
        `Користувача з email ${normalizedEmail} не існує!`,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Невірний пароль! Спробуйте ще!');
    }
    if (!user.verify) {
      throw new ConflictException(
        `Користувач з email ${normalizedEmail} не підтвердив своєї реєстрації! Перейдіть будь ласка на свою електронну скриньку для підтвердження реєстрації!`,
      );
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, this.secretKey, { expiresIn: '24h' });

    await this.userModel.findByIdAndUpdate(user._id, { $set: { token } });

    return { token };
  }

  async logout(@Req() req: RequestWithUser) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error('User not found');
    }
    const typedUser = user as unknown as UserGet;

    return this.userModel.findByIdAndUpdate(typedUser._id, { token: null });
  }
}
