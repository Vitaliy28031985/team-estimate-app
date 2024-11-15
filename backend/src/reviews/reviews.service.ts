import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Param,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { Review } from 'src/mongo/schemas/reviews.schema';
import { ReviewDto } from './review.dto';
import { ErrorsApp } from 'src/common/errors';

interface UserGet {
  _id: string;
  name?: string;
  avatar?: string;
}

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private ReviewsModel: Model<Review>) {}
  async getAll() {
    return await this.ReviewsModel.find();
  }

  async create(@Req() req: RequestWithUser, reviewDto: ReviewDto) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;
    const newReview = await this.ReviewsModel.create({
      ...reviewDto,
      avatar: typedUser.avatar,
      owner: typedUser._id,
      name: typedUser.name,
    });
    return newReview;
  }

  async update(
    @Param('reviewId') reviewId: Types.ObjectId,
    reviewDto: ReviewDto,
    @Req() req: RequestWithUser,
  ): Promise<Review> {
    if (Object.keys(req.body).length === 0) {
      throw new BadRequestException(ErrorsApp.EMPTY_BODY);
    }
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const review = await this.ReviewsModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException(ErrorsApp.NOT_REVIEW);
    }

    if (review.owner.toString() !== typedUser._id.toString()) {
      throw new ForbiddenException("You don't have access to this action!");
    }

    return await this.ReviewsModel.findByIdAndUpdate(
      { owner: typedUser._id, _id: reviewId },
      { ...reviewDto, avatar: typedUser.avatar },
      { new: true, fields: ['-createdAt', '-updatedAt'] },
    );
  }

  async deleteReview(
    @Param('reviewId') reviewId: Types.ObjectId,
    req: RequestWithUser,
  ): Promise<Review> {
    const user = req.user;
    const review = await this.ReviewsModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException(ErrorsApp.NOT_REVIEW);
    }
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;
    if (review.owner.toString() !== typedUser._id.toString()) {
      throw new ForbiddenException("You don't have access to this action!");
    }

    return await this.ReviewsModel.findByIdAndDelete(reviewId);
  }
}
