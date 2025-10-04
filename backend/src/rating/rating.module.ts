import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';
import { Store } from '../entities/store.entity';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, User, Store])],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
