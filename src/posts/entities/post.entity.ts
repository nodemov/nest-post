import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  @ApiProperty({ description: 'Post ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Post title', example: 'My Blog Post' })
  title: string;

  @ApiProperty({
    description: 'Post detailed content',
    example: 'This is the detailed content of the post.',
  })
  detail: string;

  @ApiProperty({
    description: 'Post cover image URL',
    example: 'https://example.com/images/cover.jpg',
    nullable: true,
  })
  cover: string | null;

  @ApiProperty({
    description: 'Whether the post is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Soft delete timestamp',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
