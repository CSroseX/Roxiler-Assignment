import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';
import { Store } from '../entities/store.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Store) private storeRepo: Repository<Store>,
  ) {}

  async submitRating(userId: string, storeId: string, rating: number) {
    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    let existingRating = await this.ratingRepo.findOne({ where: { userId, storeId } });
    if (existingRating) {
      existingRating.rating = rating;
      return this.ratingRepo.save(existingRating);
    }

    const newRating = this.ratingRepo.create({ userId, storeId, rating });
    return this.ratingRepo.save(newRating);
  }

  async updateRating(ratingId: string, userId: string, rating: number) {
    const existingRating = await this.ratingRepo.findOne({ where: { id: ratingId } });
    if (!existingRating) throw new NotFoundException('Rating not found');
    if (existingRating.userId !== userId) throw new NotFoundException('Unauthorized');

    existingRating.rating = rating;
    return this.ratingRepo.save(existingRating);
  }

  async getMyRatings(userId: string) {
    return this.ratingRepo.find({
      where: { userId },
      relations: ['store'],
    });
  }

  async getStoreRatings(storeId: string) {
    return this.ratingRepo.find({
      where: { storeId },
      relations: ['user'],
    });
  }
}
