import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

function isAlreadyHashed(password: string): boolean {
  return password.startsWith('$argon2');
}

function createPrismaClientWithExtensions() {
  return new PrismaClient().$extends({
    name: 'passwordHashingExtension',
    query: {
      admin: {
        async create({ args, query }) {
          if (args.data.password && !isAlreadyHashed(args.data.password)) {
            args.data.password = await argon2.hash(args.data.password);
          }
          return query(args);
        },
        async update({ args, query }) {
          if (args.data.password && !isAlreadyHashed(args.data.password as string)) {
            args.data.password = await argon2.hash(args.data.password as string);
          }
          return query(args);
        },
        async updateMany({ args, query }) {
          if (args.data.password && !isAlreadyHashed(args.data.password as string)) {
            args.data.password = await argon2.hash(args.data.password as string);
          }
          return query(args);
        },
      },
    },
  });
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClientWithExtensions>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: ExtendedPrismaClient;

  constructor() {
    this.client = createPrismaClientWithExtensions();
  }

  get admin() {
    return this.client.admin;
  }

  get post() {
    return this.client.post;
  }

  get users() {
    return this.client.users;
  }

  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }

  async $connect() {
    return this.client.$connect();
  }

  async $disconnect() {
    return this.client.$disconnect();
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
