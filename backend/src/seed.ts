import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { UserRole } from './entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    const adminUser = await authService.register({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPass123!',
      address: 'Admin Address',
      role: UserRole.ADMIN,
    });
    console.log('Admin user created:', adminUser);
  } catch (error) {
    console.log('Admin user already exists or error:', error.message);
  }

  await app.close();
}

seed();
