import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userRepo.count({ where: { role: UserRole.USER } });
    const totalStores = await this.storeRepo.count();
    const totalRatings = await this.ratingRepo.count();
    return { totalUsers, totalStores, totalRatings };
  }

  async getAllStores() {
    return this.storeRepo.find({ relations: ['owner'] }); // adjust relations if needed
  }

  async getAllUsers() {
    return this.userRepo.find({ where: { role: UserRole.USER } });
  }
}
