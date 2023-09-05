import { Controller, Logger } from '@nestjs/common';
import { OrderService } from './order-service.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Controller()
export class OrderServiceController {
  private readonly logger = new Logger(OrderServiceController.name);

  constructor(private readonly orderService: OrderService) {}

  @RabbitSubscribe({
    exchange: 'shop.topic',
    routingKey: 'shop.order.placed',
    queue: 'order',
  })
  async handleOrderPlacedEvent(
    @RabbitPayload() orderData: CreateOrderDto,
  ): Promise<void> {
    await this.orderService.createOrder(orderData);
  }
}
