import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StoreOwnerService } from './store-owner.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('store-owner')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.STORE_OWNER)
export class StoreOwnerController {
  constructor(private readonly storeOwnerService: StoreOwnerService) {}

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.storeOwnerService.getDashboard(req.user.id);
  }

  @Get('raters')
  async getRaters(@Request() req) {
    return this.storeOwnerService.getRaters(req.user.id);
  }
}
