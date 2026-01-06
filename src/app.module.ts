import { Module, ValidationPipe, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { ValidateIdMiddleware } from './common/middleware/validate-id.middleware';

@Module({
  imports: [PrismaModule, PostsModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .forRoutes('posts/:id', 'posts/:id/*');
  }
}
