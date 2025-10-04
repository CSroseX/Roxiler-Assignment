import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity'; // if exists

export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'root69',
  database: process.env.DATABASE_NAME || 'store_rating_db',
  entities: [User, Store, Rating], // ✅ include all entities with relations
  synchronize: true,
};
