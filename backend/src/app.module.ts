import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config/ormconfig';
import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Rating } from './entities/rating.entity';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([User, Store, Rating]),
    AuthModule,
    StoresModule,
    UsersModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
