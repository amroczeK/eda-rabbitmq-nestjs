import { Controller, Post, Body, Logger, HttpCode } from '@nestjs/common';
import { CreateOrderDto } from 'apps/order-service/src/dtos/order.dto';
import { IntermediaryService } from './intermediary.service';

@Controller('intermediary')
export class IntermediaryController {
  private readonly logger = new Logger(IntermediaryController.name);

  constructor(private readonly intermediaryService: IntermediaryService) {}

  @Post('/publish-order')
  @HttpCode(200)
  async publishOrder(@Body() orderData: CreateOrderDto): Promise<string> {
    this.logger.log(`Publish order controller hit.`);
    return this.intermediaryService.publishOrder(orderData);
  }
}
