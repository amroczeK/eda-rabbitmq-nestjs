// order-service/src/order.controller.ts
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { OrderService } from './order-service.service';
import { CreateOrderDto } from './dtos/order.dto';

@Controller()
export class OrderServiceController {
  private readonly logger = new Logger(OrderServiceController.name);

  constructor(private readonly orderService: OrderService) {}

  @EventPattern({ pattern: 'order', transport: Transport.RMQ })
  async handleOrderPlacedEvent(
    @Payload() orderData: CreateOrderDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.logger.log(`Pattern: ${context.getPattern()}`);
    this.logger.log(`Order received: ${JSON.stringify(orderData)}`);
    await this.orderService.createOrder(orderData);
  }
}
