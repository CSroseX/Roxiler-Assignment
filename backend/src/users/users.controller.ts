import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';

@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('role') role?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'name',
    @Query('sortOrder') sortOrder = 'ASC',
  ) {
    const filters = { name, email, address, role };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const sortOrderEnum = sortOrder === 'DESC' ? 'DESC' as const : 'ASC' as const;
    return this.usersService.findAll(filters, pageNum, limitNum, sortBy, sortOrderEnum);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
    return { success: true };
  }
}
