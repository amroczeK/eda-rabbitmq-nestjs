import { Controller, Post, Body, Logger, HttpCode, Get } from '@nestjs/common';
import { CreateOrderDto } from 'apps/order-service/src/dtos/create-order.dto';
import { IntermediaryService } from './intermediary.service';

@Controller('intermediary')
export class IntermediaryController {
  private readonly logger = new Logger(IntermediaryController.name);

  constructor(private readonly intermediaryService: IntermediaryService) {}

  @Post('/order')
  @HttpCode(200)
  async CreateOrder(@Body() orderData: CreateOrderDto): Promise<string> {
    return this.intermediaryService.CreateOrder(orderData);
  }

  @Get('/inventory')
  @HttpCode(200)
  async ListInventory(): Promise<string> {
    return this.intermediaryService.ListInventory();
  }
}
