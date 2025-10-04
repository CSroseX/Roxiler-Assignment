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

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }

  async createStore(dto: { name: string; email: string; address: string }): Promise<Store> {
    const store = this.storeRepo.create(dto);
    return this.storeRepo.save(store);
  }

  async updateStore(id: string, updateData: Partial<Store>): Promise<Store> {
    const store = await this.storeRepo.findOne({ where: { id } });
    if (!store) {
      throw new Error('Store not found');
    }
    Object.assign(store, updateData);
    return this.storeRepo.save(store);
  }
}
