import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Get()
  async getReviews(@Query('placeId') placeId: string) {
    return await this.reviewsService.getPlaceReviews(placeId);
  }
}
