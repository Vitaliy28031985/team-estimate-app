import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './review.dto';
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

  // приватний Route не важливо яка роль користувача. Будь який користувач може редагувати свій відгук, потрібно пропускати через middleware щоб перевірити чи користувач аутентифікувався.
  async updateReview(@Param('reviewId') reviewId: Types.ObjectId) {}

  // removeReview() {} приватний Route не важливо яка роль користувача. Будь який користувач може видалити свій відгук, потрібно пропускати через middleware щоб перевірити чи користувач аутентифікувався.
}
