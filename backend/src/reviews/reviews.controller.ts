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
  // публічний роут не потрібно пропускати через middleware
  @Get()
  async getAllReviews() {
    return await this.reviewsService.getAll();
  }

  @Post('create') // приватний Route не важливо яка роль користувача. Будь який користувач може створити відгук, потрібно пропускати через middleware щоб перевірити чи користувач аутентифікувався.
  @UsePipes(new ValidationPipe())
  async createReview(
    @Body() reviewDto: ReviewDto,
    @Req() req: RequestWithUser,
  ): Promise<Review> {
    return await this.reviewsService.create(req, reviewDto);
  }

  @Put('review/:reviewId') // приватний Route не важливо яка роль користувача. Будь який користувач може редагувати свій відгук, потрібно пропускати через middleware щоб перевірити чи користувач аутентифікувався.
  @UsePipes(new ValidationPipe())
  async updateReview(
    @Param('reviewId') reviewId: Types.ObjectId,
    @Body() reviewUpdateDto: ReviewUpdateDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.reviewsService.update(reviewId, reviewUpdateDto, req);
  }

  @Delete('review/:reviewId') // removeReview() {} приватний Route не важливо яка роль користувача. Будь який користувач може видалити свій відгук, потрібно пропускати через middleware щоб перевірити чи користувач аутентифікувався.
  async delete(
    @Param('reviewId') revievId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ) {
    return this.reviewsService.deleteReview(revievId, req);
  }
}
