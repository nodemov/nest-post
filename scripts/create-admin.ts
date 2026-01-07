import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';

async function createDefaultAdmin() {
  const prisma = new PrismaService();

  try {
    await prisma.$connect();

    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    const hashedPassword = await argon2.hash('admin123');
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        name: 'Admin User',
        isActive: true,
      },
    });

    console.log('Default admin created:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email:', admin.email);
    console.log('\nPlease change this password in production!');
  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultAdmin();
