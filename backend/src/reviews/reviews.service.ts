import {
  BadRequestException,
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
import { UserGet } from 'src/interfaces/userGet';
// import { ReviewsModule } from './reviews.module';

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
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;
    if (Object.keys(req.body).length === 0) {
      throw new BadRequestException(ErrorsApp.EMPTY_BODY);
    }

    // const pricesList = await this.ReviewsModel.find({
    //   owner: typedUser._id,
    // });

    // if (pricesList.length === 0) {
    //   throw new NotFoundException(ErrorsApp.NOT_PRICE);
    // }
    // const targetPrice = pricesList.some(
    //   ({ _id }) => _id.toString() === String(priceId),
    // );
    // if (!targetPrice) {
    //   throw new NotFoundException(ErrorsApp.NOT_PRICE);
    // }
    const rewiew = await this.ReviewsModel.findById(reviewId);
    if (!rewiew) {
      console.log('NOT_REVIEW');
      throw new NotFoundException(ErrorsApp.NOT_REVIEW);
    }

    return await this.ReviewsModel.findByIdAndUpdate(
      { owner: typedUser._id, _id: reviewId },
      reviewDto,
      { new: true, fields: ['-createdAt', '-updatedAt'] },
    );
  }
}
