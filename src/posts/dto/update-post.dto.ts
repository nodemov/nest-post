import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}
