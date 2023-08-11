// inventory-service/src/inventory.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { UpdateInventoryDto } from './dtos/inventory.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async checkInventory(inventoryData: any): Promise<boolean> {
    try {
      this.logger.log(
        `Inventory is available for: ${JSON.stringify(inventoryData)}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Error checking inventory: ${error.message}`);
    }
  }

  // async updateInventory(inventoryData: UpdateInventoryDto): Promise<void> {
  //   const { product_name, quantity, price } = inventoryData;

  //   // Attempt to insert the new product record
  //   try {
  //     const newProduct = new Inventory();
  //     newProduct.product_name = product_name;
  //     newProduct.quantity = quantity;
  //     newProduct.price = price;
  //     await this.inventoryRepository.save(newProduct);
  //     this.logger.log(
  //       `Inventory updated successfully for product: ${inventoryData.product_name}`,
  //     );
  //   } catch (error) {
  //     // If the insert fails due to a uniqueness constraint violation, it means the product already exists.
  //     // In that case, update the existing product.
  //     try {
  //       const existingProduct = await this.inventoryRepository.findOne({
  //         where: { product_name },
  //       });
  //       existingProduct.quantity = quantity;
  //       existingProduct.price = price;
  //       await this.inventoryRepository.save(existingProduct);
  //     } catch (error) {
  //       this.logger.error(
  //         `Error processing inventory update event: ${error.message}`,
  //       );
  //     }
  //   }
  // }
}
