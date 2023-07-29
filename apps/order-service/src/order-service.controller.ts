// order-service/src/order.controller.ts
import { Controller, Logger, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order-service.service';
import { CreateOrderDto } from './dtos/order.dto';

@Controller()
export class OrderServiceController {
  private readonly logger = new Logger(OrderServiceController.name);

  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('order_events')
  async handleOrderEvent(orderData: CreateOrderDto) {
    try {
      const createdOrder = await this.orderService.createOrder(orderData);
      this.logger.log(`Order created successfully. ID: ${createdOrder.id}`);
    } catch (error) {
      this.logger.error(`Error processing order event: ${error.message}`);
    }
  }
}
