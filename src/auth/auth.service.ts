import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateAdmin(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(admin.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
    };
  }

  async createAdmin(
    username: string,
    password: string,
    email: string,
    name: string,
  ) {
    const hashedPassword = await argon2.hash(password);
    return this.prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        email,
        name,
      },
    });
  }
}
