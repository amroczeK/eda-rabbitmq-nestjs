import { Controller, Logger } from '@nestjs/common';
import { InventoryService } from './inventory-service.service';
import {
  RabbitPayload,
  RabbitRPC,
  RabbitRequest,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { IRabbitRequest } from '@app/common/interfaces';
import { Inventory } from './entities/inventory.entity';

@Controller()
export class InventoryServiceController {
  private readonly logger = new Logger(InventoryServiceController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @RabbitSubscribe({
    exchange: 'shop.topic',
    routingKey: 'shop.inventory.#',
    queue: 'inventory',
  })
  async handleInventory(
    @RabbitPayload()
    inventoryData: any,
    @RabbitRequest() request: IRabbitRequest,
  ): Promise<void> {
    const routingKey = request.fields.routingKey;
    this.logger.log(`handleInventory(): ${routingKey}`);
    switch (routingKey) {
      case 'shop.inventory.create': {
        // TODO: Validate payload
        this.inventoryService.createInventory(inventoryData);
        break;
      }
      case 'shop.inventory.list': {
        // TODO: Validate payload
        this.inventoryService.listInventory();
        break;
      }
      case 'shop.inventory.update': {
        // TODO: Validate payload
        this.inventoryService.updateInventory(inventoryData);
        break;
      }
      case 'shop.inventory.delete': {
        // TODO: Validate payload
        this.inventoryService.removeFromInventory(inventoryData);
        break;
      }
      case 'shop.inventory.decrement.quantity': {
        // TODO: Validate payload
        this.inventoryService.decrementQuantity(inventoryData);
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
    @RabbitPayload() inventoryData: Inventory[],
  ): Promise<boolean> {
    return this.inventoryService.checkInventory(inventoryData);
  }
}
