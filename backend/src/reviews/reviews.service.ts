import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { Review } from 'src/mongo/schemas/reviews.schema';
import { ReviewDto } from './review.dto';
import { ErrorsApp } from 'src/common/errors';
import { UserGet } from 'src/interfaces/userGet';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private ReviewsModule: Model<Review>) {}
  async getAll() {
    return await this.ReviewsModule.find();
  }

  async create(@Req() req: RequestWithUser, reviewDto: ReviewDto) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;
    const newReview = await this.ReviewsModule.create({
      ...reviewDto,
      owner: typedUser._id,
      name: user.name,
    });
    return newReview;
  }
}
