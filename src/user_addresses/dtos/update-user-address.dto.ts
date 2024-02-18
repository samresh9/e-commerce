import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserAddressesDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  billingCity: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  billingState: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  billingArea: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shippingCity: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shippingArea: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shippingState: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isDefault: boolean;
}
