import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/ormconfig';
import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Rating } from './entities/rating.entity';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([User, Store, Rating]),
    AuthModule,
    StoresModule,
    UsersModule,
    AdminModule,
    RatingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
