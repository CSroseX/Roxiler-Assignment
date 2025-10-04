import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAll(filters?: { name?: string; email?: string; address?: string; role?: string }): Promise<User[]> {
    const query = this.usersRepo.createQueryBuilder('user');

    if (filters?.name) {
      query.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    }
    if (filters?.email) {
      query.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    }
    if (filters?.address) {
      query.andWhere('user.address ILIKE :address', { address: `%${filters.address}%` });
    }
    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ ...dto, password: hashedPassword });
    return this.usersRepo.save(user);
  }

  async update(id: string, dto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findOne(id);
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }
}
