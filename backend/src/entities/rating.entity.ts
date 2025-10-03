import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique, Check } from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';

@Entity('ratings')
@Unique(['userId', 'storeId'])
@Check('rating >= 1 AND rating <= 5')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  storeId: string;

  @Column('integer')
  rating: number;

  @ManyToOne(() => User, user => user.ratings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Store, store => store.ratings)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}