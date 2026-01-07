import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
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
      email: admin.email,
      name: admin.name,
    };
  }

  async createAdmin(
    email: string,
    password: string,
    name: string,
  ) {
    return this.prisma.admin.create({
      data: {
        password,
        email,
        name,
      },
    });
  }
}
