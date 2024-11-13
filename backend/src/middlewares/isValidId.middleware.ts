import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class IsValidIdMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    const { reviewId } = req.params;
    console.log(req.params);
    if (!isValidObjectId(reviewId)) {
      throw new NotFoundException(`${reviewId} is not valid id`);
    }
    next();
  }
}
