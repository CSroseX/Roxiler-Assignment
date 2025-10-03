import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Req,
  UseGuards,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { RateStoreDto } from './dto/rate-store.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async getAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  async create(@Req() req: any, @Body() dto: CreateStoreDto) {
    const ownerId = req.user?.id;
    return this.storesService.create(ownerId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  async update(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStoreDto) {
    // only owner or admin can update
    const store = await this.storesService.findOne(id as string);
    const requesterId = req.user?.id;
    const requesterRole = req.user?.role;
    if (requesterRole !== UserRole.ADMIN && store.ownerId !== requesterId) {
      throw new ForbiddenException('Not authorized to update this store');
    }
    return this.storesService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  async remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const store = await this.storesService.findOne(id as string);
    const requesterId = req.user?.id;
    const requesterRole = req.user?.role;
    if (requesterRole !== UserRole.ADMIN && store.ownerId !== requesterId) {
      throw new ForbiddenException('Not authorized to delete this store');
    }
    await this.storesService.remove(id);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/rate')
  async rate(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() dto: RateStoreDto) {
    const userId = req.user?.id;
    return this.storesService.rateStore(userId, id, dto.rating);
  }
}
