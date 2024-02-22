import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateUserAddressesDto {
  @ApiProperty()
  @IsString()
  billingCity: string;

  @ApiProperty()
  @IsString()
  billingState: string;

  @ApiProperty()
  @IsString()
  billingArea: string;

  @ApiProperty()
  @IsString()
  shippingCity: string;

  @ApiProperty()
  @IsString()
  shippingArea: string;

  @ApiProperty()
  @IsString()
  shippingState: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  isDefault: boolean;
}
