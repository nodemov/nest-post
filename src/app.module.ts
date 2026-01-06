import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PrismaModule, PostsModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
