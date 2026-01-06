import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'The title of the post',
    example: 'Updated Blog Post Title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'The detailed content of the post',
    example: 'Updated content for the blog post.',
  })
  @IsString()
  @IsOptional()
  detail?: string;

  @ApiPropertyOptional({
    description: 'URL of the post cover image',
    example: 'https://example.com/images/new-cover.jpg',
  })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiPropertyOptional({
    description: 'Whether the post is active',
    example: true,
  })
  @IsOptional()
  isActive?: boolean;
}
