import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateInventoryDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}
