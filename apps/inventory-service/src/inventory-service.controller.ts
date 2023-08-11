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

@Controller()
export class InventoryServiceController {
  private readonly logger = new Logger(InventoryServiceController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern({ cmd: 'check_inventory' })
  async handleCheckStock(inventoryData: any): Promise<boolean> {
    return await this.handleCheckStock(inventoryData);
  }

  @EventPattern('shop.inventory.update')
  async handleInventoryEvent(inventoryData: UpdateInventoryDto): Promise<void> {
    this.logger.log(`Updating product: ${inventoryData.product_name}`);
    //await this.inventoryService.updateInventory(inventoryData);
  }

  @EventPattern('shop.order.created')
  async handleOrderCreated(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.logger.log(
      `Updating inventory of products from created order: \n ${JSON.stringify(
        data,
      )} \n ${JSON.stringify(context)}`,
    );
  }
}
