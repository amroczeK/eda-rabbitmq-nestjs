import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from 'apps/order-service/src/dtos/order.dto';

@Injectable()
export class IntermediaryService {
  private readonly logger = new Logger(IntermediaryService.name);

  constructor(private readonly rabbitMqService: RabbitMqService) {}

  async publishOrder(orderData: CreateOrderDto): Promise<string> {
    try {
      const routingKey = 'shop.order.placed';
      await this.rabbitMqService.publishMessage(
        routingKey,
        JSON.stringify({ data: orderData }),
      );
      this.logger.log(`Order successfully published.`);
      return 'Order published successfully!';
    } catch (error) {
      this.logger.error(`Failed to publish order`);
      throw new Error(`Failed to publish order: ${error.message}`);
    }
  }
}
