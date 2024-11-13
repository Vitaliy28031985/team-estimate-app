import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class IsValidIdMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    // const { reviewId } = req.params;
    const keys = Object.keys(req.params);
    keys.forEach((key) => {
      if (!isValidObjectId(req.params[key])) {
        throw new NotFoundException(`${req.params[key]} is not valid id`);
      }
      console.log(req.params[key]);
    });
    next();
  }
}
