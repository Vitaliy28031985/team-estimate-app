import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
// import * as jwt from 'jsonwebtoken';
import { User } from 'src/database/models/user/user.schema';
import { EmailService } from '../email/email.service';

const { VERIFY_LINK } = process.env;

@Injectable()
export class AuthService {
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
    await this.emailService.sendVerificationEmail(
      normalizedEmail,
      verificationLink,
    );
    return newUser;
  }
}
