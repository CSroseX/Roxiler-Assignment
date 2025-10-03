import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepo: Repository<Store>,
    @InjectRepository(Rating)
    private ratingsRepo: Repository<Rating>,
  ) {}

  async findAll(): Promise<Store[]> {
    // Return stores with an aggregated avgRating field
    const raws = await this.storesRepo
      .createQueryBuilder('store')
      .leftJoin('store.ratings', 'rating')
      .select([
        'store.id AS id',
        'store.name AS name',
        'store.email AS email',
        'store.address AS address',
        'store.ownerId AS "ownerId"',
        'store."createdAt" AS "createdAt"',
        'store."updatedAt" AS "updatedAt"',
        'COALESCE(AVG(rating.rating), 0) AS "avgRating"',
      ])
      .groupBy('store.id')
      .getRawMany();

    return raws.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      address: r.address,
      ownerId: r.ownerId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      avgRating: parseFloat(r.avgRating),
    } as any));
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storesRepo.findOne({ where: { id }, relations: ['ratings'] });
    if (!store) throw new NotFoundException('Store not found');
    // compute avg
    const avg = await this.ratingsRepo
      .createQueryBuilder('rating')
      .select('COALESCE(AVG(rating.rating), 0)', 'avg')
      .where('rating.storeId = :storeId', { storeId: id })
      .getRawOne();

    return { ...(store as any), avgRating: parseFloat(avg?.avg || 0) } as any;
  }

  async create(ownerId: string, dto: CreateStoreDto): Promise<Store> {
    const store = this.storesRepo.create({ ...dto, ownerId });
    return this.storesRepo.save(store);
  }

  async update(id: string, dto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, dto);
    return this.storesRepo.save(store);
  }

  async remove(id: string): Promise<void> {
    const store = await this.findOne(id);
    await this.storesRepo.remove(store);
  }

  // Rate a store: create or update rating by user
  async rateStore(userId: string, storeId: string, ratingValue: number) {
    // ensure store exists
    const store = await this.storesRepo.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    let rating = await this.ratingsRepo.findOne({ where: { userId, storeId } });
    if (rating) {
      rating.rating = ratingValue;
      return this.ratingsRepo.save(rating);
    }

    rating = this.ratingsRepo.create({ userId, storeId, rating: ratingValue });
    try {
      return await this.ratingsRepo.save(rating);
    } catch (err: any) {
      // handle unique constraint, etc.
      if (/(unique|duplicate)/i.test(err.message || '')) {
        throw new ConflictException('You have already rated this store');
      }
      throw err;
    }
  }
}
