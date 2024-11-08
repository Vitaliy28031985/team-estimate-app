import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ErrorsApp } from 'src/common/errors';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { User } from 'src/mongo/schemas/user/user.schema';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly secretKey = process.env.SECRET_KEY;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization || '';
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException(ErrorsApp.NOT_AUTHORIZED);
    }
    try {
      const { id } = jwt.verify(token, this.secretKey) as {
        id: string;
      };
      const user = await this.userModel.findById(id).exec();
      if (!user || !user.token) {
        throw new UnauthorizedException(ErrorsApp.NOT_AUTHORIZED);
      }

      req.user = user;

      next();
    } catch (error: unknown) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        throw new UnauthorizedException(ErrorsApp.NOT_AUTHORIZED);
      }
      next(error as Error);
    }
  }
}
