import { DataSource } from 'typeorm';
import { config } from './config/ormconfig';
import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Rating } from './entities/rating.entity';
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seedAdminUser() {
  // Create a custom config with explicit entities for the seed script
  const seedConfig = {
    ...config,
    entities: [User, Store, Rating], // Explicitly import entities
  };

  const dataSource = new DataSource(seedConfig);
  await dataSource.initialize();

  try {
    const userRepository = dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmins = await userRepository.find({ where: { role: UserRole.ADMIN } });
    if (existingAdmins.length > 0) {
      console.log('Admin user already exists.');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('AdminPass123!', 10);
    const adminUser = userRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      address: 'Admin Address',
      role: UserRole.ADMIN,
    });

    const savedUser = await userRepository.save(adminUser);
    console.log('Admin user created:', { id: savedUser.id, email: savedUser.email, role: savedUser.role });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await dataSource.destroy();
  }
}

seedAdminUser();
