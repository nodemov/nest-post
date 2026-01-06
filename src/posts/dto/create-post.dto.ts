import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Blog Post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The detailed content of the post',
    example: 'This is the content of my first blog post with detailed information.',
  })
  @IsString()
  @IsNotEmpty()
  detail: string;

  @ApiProperty({
    description: 'URL of the post cover image',
    example: 'https://example.com/images/cover.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({
    description: 'Whether the post is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  isActive?: boolean;
}
