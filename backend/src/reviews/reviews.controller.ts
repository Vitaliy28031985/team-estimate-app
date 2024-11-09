import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  // публічний роут не потрібно пропускати через middleware
  @Get()
  async getAllReview() {
    return await this.reviewsService.getAll();
  }

  // createReview() {} приватний Route не важливо яка роль користувача. Будь який користувач може створити відгук, потрібно пропускати через middleware щоб перевірити чи користувач аутентифікувався.

  // updateReview() {} приватний Route не важливо яка роль користувача. Будь який користувач може редагувати свій відгук, потрібно пропускати через middleware щоб перевірити чи користувач аутентифікувався.

  // removeReview() {} приватний Route не важливо яка роль користувача. Будь який користувач може видалити свій відгук, потрібно пропускати через middleware щоб перевірити чи користувач аутентифікувався.
}
