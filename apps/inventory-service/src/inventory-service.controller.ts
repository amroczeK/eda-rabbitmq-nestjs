import { Controller, Logger, Inject } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { InventoryService } from './inventory-service.service';
import { UpdateInventoryDto } from './dtos/inventory.dto';
import {
  RabbitPayload,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';

@Controller()
export class InventoryServiceController {
  private readonly logger = new Logger(InventoryServiceController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @RabbitSubscribe({
    exchange: 'shop.topic',
    routingKey: 'shop.order.created',
    queue: 'inventory',
  })
  async handleOrderCreated(@RabbitPayload() data: any): Promise<void> {
    this.logger.log('handleOrderCreated() received');
    this.inventoryService.updateInventoryFromOrder(data);
  }

  @RabbitSubscribe({
    exchange: 'shop.topic',
    routingKey: 'shop.inventory.update',
    queue: 'inventory',
  })
  async handleUpdateInventory(
    @RabbitPayload() inventoryData: UpdateInventoryDto,
  ): Promise<void> {
    this.logger.log(`Updating product: ${inventoryData.product_name}`);
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
