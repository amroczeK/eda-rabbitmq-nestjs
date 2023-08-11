import { Controller, Post, Body, Inject, Logger } from '@nestjs/common';
import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { CreateOrderDto } from 'apps/order-service/src/dtos/order.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject(RabbitMqService) private readonly rabbitMqService: RabbitMqService,
  ) {}

  @Post('/publish-order')
  async publishOrder(@Body() orderData: CreateOrderDto) {
    this.logger.log(`Request received with data: ${JSON.stringify(orderData)}`);
    // Assuming orderData is an object containing order details received from the frontend
    const orderEvent = JSON.stringify(orderData);

    // Connect to RabbitMQ
    await this.rabbitMqService.connect();

    // Publish the order event to the 'order_events' queue
    await this.rabbitMqService.publishMessage('shop.order.placed', orderEvent);

    // Close the RabbitMQ connection
    await this.rabbitMqService.close();

    return { message: 'Order event published successfully' };
  }
}
