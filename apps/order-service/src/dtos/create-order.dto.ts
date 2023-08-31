import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsString()
  @IsNotEmpty()
  customer_email: string;

  @IsNumber()
  @Min(0)
  total_amount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  order_items: OrderItemDto[];
}
