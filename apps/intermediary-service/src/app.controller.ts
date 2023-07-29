import { Controller, Post, Body, Inject } from '@nestjs/common';
import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';

@Controller()
export class AppController {
  constructor(
    @Inject(RabbitMqService) private readonly rabbitMqService: RabbitMqService,
  ) {}

  @Post('/publish-order')
  async publishOrder(@Body() orderData: any) {
    // Assuming orderData is an object containing order details received from the frontend
    const orderEvent = JSON.stringify(orderData);

    // Connect to RabbitMQ
    await this.rabbitMqService.connect();

    // Publish the order event to the 'order_events' queue
    await this.rabbitMqService.publishMessage('order_events', orderEvent);

    // Close the RabbitMQ connection
    await this.rabbitMqService.close();

    return { message: 'Order event published successfully' };
  }
}
