import { Module, ValidationPipe, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { HealthModule } from './health/health.module';
import { ValidateIdMiddleware } from './common/middleware/validate-id.middleware';

@Module({
  imports: [PrismaModule, PostsModule, HealthModule],
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
      .exclude(
        { path: 'posts/all/with-deleted', method: RequestMethod.GET },
        { path: 'posts/deleted/only', method: RequestMethod.GET },
      )
      .forRoutes('posts/*');
  }
}
