import { Controller, Post, Put, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('ratings')
@UseGuards(AuthGuard('jwt'))
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async submitRating(@Request() req, @Body() dto: { storeId: string; rating: number }) {
    return this.ratingService.submitRating(req.user.id, dto.storeId, dto.rating);
  }

  @Put(':id')
  async updateRating(@Request() req, @Param('id') id: string, @Body() dto: { rating: number }) {
    return this.ratingService.updateRating(id, req.user.id, dto.rating);
  }

  @Get('my-ratings')
  async getMyRatings(@Request() req) {
    return this.ratingService.getMyRatings(req.user.id);
  }

  @Get('store/:storeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER)
  async getStoreRatings(@Request() req, @Param('storeId') storeId: string) {
    // TODO: check if store belongs to user
    return this.ratingService.getStoreRatings(storeId);
  }
}
