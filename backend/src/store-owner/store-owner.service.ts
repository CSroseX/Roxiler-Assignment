import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class StoreOwnerService {
  constructor(
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getDashboard(userId: string) {
    const stores = await this.storeRepo.find({ where: { ownerId: userId } });
    const totalStores = stores.length;
    const totalRatings = await this.ratingRepo
      .createQueryBuilder('rating')
      .leftJoin('rating.store', 'store')
      .where('store.ownerId = :userId', { userId })
      .getCount();
    const avgRating = await this.ratingRepo
      .createQueryBuilder('rating')
      .leftJoin('rating.store', 'store')
      .where('store.ownerId = :userId', { userId })
      .select('AVG(rating.rating)', 'avg')
      .getRawOne();

    return {
      totalStores,
      totalRatings,
      avgRating: parseFloat(avgRating?.avg || 0),
    };
  }

  async getRaters(userId: string) {
    const raters = await this.ratingRepo
      .createQueryBuilder('rating')
      .leftJoin('rating.store', 'store')
      .leftJoinAndSelect('rating.user', 'user')
      .where('store.ownerId = :userId', { userId })
      .select(['user.id', 'user.name', 'user.email', 'rating.rating', 'store.name'])
      .getRawMany();

    return raters;
  }
}
