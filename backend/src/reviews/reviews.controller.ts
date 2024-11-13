import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto, ReviewUpdateDto } from './review.dto';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { Review } from 'src/mongo/schemas/reviews.schema';
import { Types } from 'mongoose';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get()
  async getAllReviews() {
    return await this.reviewsService.getAll();
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  async createReview(
    @Body() reviewDto: ReviewDto,
    @Req() req: RequestWithUser,
  ): Promise<Review> {
    return await this.reviewsService.create(req, reviewDto);
  }

  @Put(':reviewId')
  @UsePipes(new ValidationPipe())
  async updateReview(
    @Param('reviewId') reviewId: Types.ObjectId,
    @Body() reviewUpdateDto: ReviewUpdateDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.reviewsService.update(reviewId, reviewUpdateDto, req);
  }

  @Delete(':reviewId')
  async delete(
    @Param('reviewId') reviewId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ) {
    return this.reviewsService.deleteReview(reviewId, req);
  }
}
