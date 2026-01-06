import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.prisma.post.create({
      data: createPostDto,
    });
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PostEntity[] | PaginatedResponseDto<PostEntity>> {
    if (paginationDto && (paginationDto.page || paginationDto.limit)) {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.post.findMany({
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        this.prisma.post.count({
          where: {
            deletedAt: null,
          },
        }),
      ]);

      return new PaginatedResponseDto(data, total, page, limit);
    }

    return this.prisma.post.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    await this.findOne(id); // Check if post exists and not deleted

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: number): Promise<PostEntity> {
    await this.findOne(id); // Check if post exists and not deleted

    return this.prisma.post.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findFirst({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!post) {
      throw new NotFoundException(
        `Deleted post with ID ${id} not found`,
      );
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  async findAllWithDeleted(
    paginationDto?: PaginationDto,
  ): Promise<PostEntity[] | PaginatedResponseDto<PostEntity>> {
    if (paginationDto && (paginationDto.page || paginationDto.limit)) {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.post.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        this.prisma.post.count(),
      ]);

      return new PaginatedResponseDto(data, total, page, limit);
    }

    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findDeleted(
    paginationDto?: PaginationDto,
  ): Promise<PostEntity[] | PaginatedResponseDto<PostEntity>> {
    if (paginationDto && (paginationDto.page || paginationDto.limit)) {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.post.findMany({
          where: {
            deletedAt: { not: null },
          },
          orderBy: {
            deletedAt: 'desc',
          },
          skip,
          take: limit,
        }),
        this.prisma.post.count({
          where: {
            deletedAt: { not: null },
          },
        }),
      ]);

      return new PaginatedResponseDto(data, total, page, limit);
    }

    return this.prisma.post.findMany({
      where: {
        deletedAt: { not: null },
      },
      orderBy: {
        deletedAt: 'desc',
      },
    });
  }

  async forceRemove(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
