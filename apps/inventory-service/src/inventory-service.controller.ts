import { Controller, Logger } from '@nestjs/common';
import { InventoryService } from './inventory-service.service';
import { UpdateInventoryDto } from './dtos/inventory.dto';
import {
  RabbitPayload,
  RabbitRPC,
  RabbitRequest,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';

export interface IRabbitRequest {
  fields: {
    consumerTag: string;
    deliveryTag: number;
    redelivered: boolean;
    exchange: string;
    routingKey: string;
  };
  properties: {
    headers: object;
  };
  content: {
    type: string;
    data: number[];
  };
}

@Controller()
export class InventoryServiceController {
  private readonly logger = new Logger(InventoryServiceController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @RabbitSubscribe({
    exchange: 'shop.topic',
    routingKey: 'shop.inventory.*',
    queue: 'inventory',
  })
  async handleUpdateInventory(
    @RabbitPayload() inventoryData: UpdateInventoryDto[],
    @RabbitRequest() request: IRabbitRequest,
  ): Promise<void> {
    this.logger.log(`handleUpdateInventory()`);
    const routingKey = request.fields.routingKey;
    switch (routingKey) {
      case 'shop.inventory.update': {
        this.inventoryService.updateInventory(inventoryData);
        break;
      }
      default: {
        this.logger.log(
          `There is no handler for message with routing key: ${routingKey}`,
        );
        break;
      }
    }
  }

  @RabbitRPC({
    exchange: 'shop.direct',
    routingKey: 'shop.inventory.check',
    queue: 'inventory-rpc-queue',
  })
  async handleCheckInventory(
    @RabbitPayload() inventoryData: UpdateInventoryDto,
  ): Promise<boolean> {
    this.logger.log(`handleCheckInventory()`);
    return this.inventoryService.checkInventory(inventoryData);
  }
}
