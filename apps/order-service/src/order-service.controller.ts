// order-service/src/order.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { OrderService } from './order-service.service';
import { CreateOrderDto } from './dtos/order.dto';

@Controller()
export class OrderServiceController {
  private readonly logger = new Logger(OrderServiceController.name);

  constructor(private readonly orderService: OrderService) {}

  @EventPattern('shop.order.placed')
  async handleOrderPlacedEvent(orderData: CreateOrderDto): Promise<void> {
    await this.orderService.createOrder(orderData);
  }
}
