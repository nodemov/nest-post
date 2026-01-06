import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    detail: 'Test Detail',
    cover: 'https://example.com/cover.jpg',
    deletedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    findAllWithDeleted: jest.fn(),
    findDeleted: jest.fn(),
    forceRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        detail: 'New Detail',
        cover: 'https://example.com/new.jpg',
      };

      mockPostsService.create.mockResolvedValue({
        ...mockPost,
        ...createPostDto,
      });

      const result = await controller.create(createPostDto);

      expect(service.create).toHaveBeenCalledWith(createPostDto);
      expect(result.title).toBe(createPostDto.title);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [mockPost, { ...mockPost, id: 2 }];
      mockPostsService.findAll.mockResolvedValue(posts);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });
  });

  describe('findAllWithDeleted', () => {
    it('should return all posts including deleted', async () => {
      const posts = [
        mockPost,
        { ...mockPost, id: 2, deletedAt: new Date() },
      ];
      mockPostsService.findAllWithDeleted.mockResolvedValue(posts);

      const result = await controller.findAllWithDeleted();

      expect(service.findAllWithDeleted).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });
  });

  describe('findDeleted', () => {
    it('should return only deleted posts', async () => {
      const deletedPosts = [{ ...mockPost, deletedAt: new Date() }];
      mockPostsService.findDeleted.mockResolvedValue(deletedPosts);

      const result = await controller.findDeleted();

      expect(service.findDeleted).toHaveBeenCalled();
      expect(result).toEqual(deletedPosts);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      mockPostsService.findOne.mockResolvedValue(mockPost);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };

      mockPostsService.update.mockResolvedValue({
        ...mockPost,
        ...updatePostDto,
      });

      const result = await controller.update(1, updatePostDto);

      expect(service.update).toHaveBeenCalledWith(1, updatePostDto);
      expect(result.title).toBe(updatePostDto.title);
    });
  });

  describe('restore', () => {
    it('should restore a soft-deleted post', async () => {
      const restoredPost = { ...mockPost, deletedAt: null };
      mockPostsService.restore.mockResolvedValue(restoredPost);

      const result = await controller.restore(1);

      expect(service.restore).toHaveBeenCalledWith(1);
      expect(result.deletedAt).toBeNull();
    });
  });

  describe('remove', () => {
    it('should soft delete a post', async () => {
      mockPostsService.remove.mockResolvedValue({
        ...mockPost,
        deletedAt: new Date(),
      });

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('forceRemove', () => {
    it('should permanently delete a post', async () => {
      mockPostsService.forceRemove.mockResolvedValue(mockPost);

      await controller.forceRemove(1);

      expect(service.forceRemove).toHaveBeenCalledWith(1);
    });
  });
});
