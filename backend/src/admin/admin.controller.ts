import { Controller, Get, Post, UseGuards, Put, Param, Body, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole, User } from '../entities/user.entity';
import { Store } from '../entities/store.entity';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('stores')
  async getAllStores() {
    return this.adminService.getAllStores(); // 👈 You’ll define this in AdminService
  }

  @Post('stores')
  async createStore(@Body() dto: { name: string; email: string; address: string }) {
    return this.adminService.createStore(dto);
  }

  @Put('stores/:id')
  async updateStore(@Param('id') id: string, @Body() updateData: Partial<Store>) {
    try {
      return await this.adminService.updateStore(id, updateData);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers(); // 👈 You’ll define this in AdminService
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateData: Partial<User>) {
    try {
      return await this.adminService.updateUser(id, updateData);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
