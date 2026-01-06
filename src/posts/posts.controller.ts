import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active posts (excluding soft-deleted)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (optional, max: 100)' })
  @ApiResponse({ status: 200, description: 'List of active posts (paginated if page/limit provided)' })
  findAll(
    @Query() paginationDto?: PaginationDto,
  ): Promise<PostEntity[] | PaginatedResponseDto<PostEntity>> {
    return this.postsService.findAll(paginationDto);
  }

  @Get('all/with-deleted')
  @ApiOperation({ summary: 'Get all posts including soft-deleted ones' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (optional, max: 100)' })
  @ApiResponse({ status: 200, description: 'List of all posts (paginated if page/limit provided)' })
  findAllWithDeleted(
    @Query() paginationDto?: PaginationDto,
  ): Promise<PostEntity[] | PaginatedResponseDto<PostEntity>> {
    return this.postsService.findAllWithDeleted(paginationDto);
  }

  @Get('deleted/only')
  @ApiOperation({ summary: 'Get only soft-deleted posts' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (optional, max: 100)' })
  @ApiResponse({ status: 200, description: 'List of deleted posts (paginated if page/limit provided)' })
  findDeleted(
    @Query() paginationDto?: PaginationDto,
  ): Promise<PostEntity[] | PaginatedResponseDto<PostEntity>> {
    return this.postsService.findDeleted(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 200, description: 'Post found', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 200, description: 'Post updated successfully', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted post' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 200, description: 'Post restored successfully', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Deleted post not found' })
  restore(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.restore(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 204, description: 'Post soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postsService.remove(id);
  }

  @Delete(':id/force')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete a post (force delete)' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 204, description: 'Post permanently deleted' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async forceRemove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postsService.forceRemove(id);
  }
}
