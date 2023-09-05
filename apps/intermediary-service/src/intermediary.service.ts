import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from 'apps/order-service/src/dtos/create-order.dto';

@Injectable()
export class IntermediaryService {
  private readonly logger = new Logger(IntermediaryService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async CreateOrder(orderData: CreateOrderDto): Promise<string> {
    try {
      await this.amqpConnection.publish(
        'shop.topic',
        'shop.order.placed',
        orderData,
      );
      this.logger.log(`Order successfully published.`);
      return 'Order published successfully!';
    } catch (error) {
      this.logger.error(`Failed to publish order`);
      throw new Error(`Failed to publish order: ${error.message}`);
    }
  }

  async ListInventory(): Promise<string> {
    try {
      await this.amqpConnection.publish(
        'shop.topic',
        'shop.inventory.list',
        {},
      );
      this.logger.log(`List inventory successfully published.`);
      return 'Order published successfully!';
    } catch (error) {
      this.logger.error(`Failed to publish order`);
      throw new Error(`Failed to publish order: ${error.message}`);
    }
  }
}
