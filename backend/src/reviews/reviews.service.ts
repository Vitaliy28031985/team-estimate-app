import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from 'src/mongo/schemas/reviews.schema';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private ReviewsModule: Model<Review>) {}
  async getAll() {
    return await this.ReviewsModule.find();
  }
}
