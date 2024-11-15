import { Module } from '@nestjs/common';

import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from 'src/mongo/schemas/reviews.schema';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
