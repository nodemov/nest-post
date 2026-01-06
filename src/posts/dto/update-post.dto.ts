import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsString()
  @IsOptional()
  cover?: string;
}
