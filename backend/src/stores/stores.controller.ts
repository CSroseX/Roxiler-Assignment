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
  Query,
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
  async getAll(
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'name',
    @Query('sortOrder') sortOrder = 'ASC',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const sortOrderUpper = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    return this.storesService.findAll(search, pageNum, limitNum, sortBy, sortOrderUpper as 'ASC' | 'DESC');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('ratings/my')
  async getMyRatings(@Req() req: any) {
    const userId = req.user?.id;
    return this.storesService.getUserRatings(userId);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateStoreDto) {
    const ownerId = req.user?.id;
    return this.storesService.create(ownerId, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  @Put(':id')
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  @Delete(':id')
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/admin/stores')
  async getAllForAdmin() {
    return this.storesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('/admin/stores')
  async createForAdmin(@Body() dto: CreateStoreDto) {
    // For admin, ownerId can be null or specified, but for now, assume admin creates without owner
    return this.storesService.create(null, dto);
  }
}
