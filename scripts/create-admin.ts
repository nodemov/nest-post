import { PrismaService } from '../src/prisma/prisma.service';

async function createDefaultAdmin() {
  const prisma = new PrismaService();

  try {
    await prisma.$connect();

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@gmail.com' },
    });

    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    const admin = await prisma.admin.create({
      data: {
        password: 'NNs6HZqeOPk9Mhq6SJHsNsHa9',
        email: 'admin@gmail.com',
        name: 'Admin User',
        isActive: true,
      },
    });

    console.log('Default admin created:');
    console.log('Email:', admin.email);
    console.log('Password: NNs6HZqeOPk9Mhq6SJHsNsHa9');
    console.log('\nPlease change this password in production!');
  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

createDefaultAdmin();
