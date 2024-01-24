import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Transform(({ value }) => Number(value))
  page: number;

  @ApiProperty()
  @IsInt()
  @Min(1, { message: 'Page Size should not be less than 1 or Empty' })
  @IsNotEmpty()
  @Max(10)
  @Transform(({ value }) => Number(value))
  pageSize: number;
}
