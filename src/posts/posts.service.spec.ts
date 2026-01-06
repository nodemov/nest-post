import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPost = {
    id: 1,
    title: 'Test Post',
    detail: 'Test Detail',
    cover: 'https://example.com/cover.jpg',
    deletedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        detail: 'New Detail',
        cover: 'https://example.com/new.jpg',
      };

      mockPrismaService.post.create.mockResolvedValue({
        ...mockPost,
        ...createPostDto,
      });

      const result = await service.create(createPostDto);

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: createPostDto,
      });
      expect(result.title).toBe(createPostDto.title);
      expect(result.detail).toBe(createPostDto.detail);
    });
  });

  describe('findAll', () => {
    it('should return an array of active posts', async () => {
      const posts = [mockPost, { ...mockPost, id: 2 }];
      mockPrismaService.post.findMany.mockResolvedValue(posts);

      const result = await service.findAll();

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });

    it('should not return soft-deleted posts', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([mockPost]);

      await service.findAll();

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(mockPost);

      const result = await service.findOne(1);

      expect(prisma.post.findFirst).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null },
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Post with ID 999 not found',
      );
    });

    it('should not return soft-deleted post', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };

      mockPrismaService.post.findFirst.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue({
        ...mockPost,
        ...updatePostDto,
      });

      const result = await service.update(1, updatePostDto);

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePostDto,
      });
      expect(result.title).toBe(updatePostDto.title);
    });

    it('should throw NotFoundException when updating non-existent post', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);

      await expect(
        service.update(999, { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove (soft delete)', () => {
    it('should soft delete a post', async () => {
      const deletedPost = { ...mockPost, deletedAt: new Date() };
      mockPrismaService.post.findFirst.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue(deletedPost);

      const result = await service.remove(1);

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
      expect(result.deletedAt).toBeTruthy();
    });

    it('should throw NotFoundException when soft deleting non-existent post', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted post', async () => {
      const deletedPost = { ...mockPost, deletedAt: new Date() };
      const restoredPost = { ...mockPost, deletedAt: null };

      mockPrismaService.post.findFirst.mockResolvedValue(deletedPost);
      mockPrismaService.post.update.mockResolvedValue(restoredPost);

      const result = await service.restore(1);

      expect(prisma.post.findFirst).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: { not: null } },
      });
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: null },
      });
      expect(result.deletedAt).toBeNull();
    });

    it('should throw NotFoundException when restoring non-deleted post', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);

      await expect(service.restore(1)).rejects.toThrow(NotFoundException);
      await expect(service.restore(1)).rejects.toThrow(
        'Deleted post with ID 1 not found',
      );
    });
  });

  describe('findAllWithDeleted', () => {
    it('should return all posts including deleted ones', async () => {
      const posts = [
        mockPost,
        { ...mockPost, id: 2, deletedAt: new Date() },
      ];
      mockPrismaService.post.findMany.mockResolvedValue(posts);

      const result = await service.findAllWithDeleted();

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });
  });

  describe('findDeleted', () => {
    it('should return only deleted posts', async () => {
      const deletedPosts = [{ ...mockPost, deletedAt: new Date() }];
      mockPrismaService.post.findMany.mockResolvedValue(deletedPosts);

      const result = await service.findDeleted();

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
      });
      expect(result).toEqual(deletedPosts);
    });
  });

  describe('forceRemove', () => {
    it('should permanently delete a post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.forceRemove(1);

      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException when force deleting non-existent post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.forceRemove(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.forceRemove(999)).rejects.toThrow(
        'Post with ID 999 not found',
      );
    });
  });
});
