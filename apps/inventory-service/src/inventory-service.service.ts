import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dtos/create-inventory.dto';
import { UpdateInventoryDto } from './dtos/update-inventory.dto';
import { DeleteInventoryDto } from './dtos/delete-inventory.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly dataSource: DataSource,
  ) {}

  async createInventory(inventoryData: CreateInventoryDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (!inventoryData.length) throw 'No items to add to inventory.';

      for (const item of inventoryData) {
        const { product_name, quantity, price } = item;
        const newProduct = new Inventory();
        newProduct.product_name = product_name;
        newProduct.quantity = quantity;
        newProduct.price = price;
        await queryRunner.manager.save(newProduct);
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `Created items in inventory: ${JSON.stringify(inventoryData)}`,
      );
    } catch (error) {
      this.logger.error(`Error creating items in inventory: ${error}`);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async listInventory(): Promise<void> {
    try {
      const items = await this.inventoryRepository.find();
      this.logger.log(`Inventory list: ${JSON.stringify(items)}`);
      // Implement logic to retrieve all items from inventory and send to presentation layer via TCP/Websockets
    } catch (error) {
      this.logger.error(`Error retrieving items in inventory: ${error}`);
    }
  }

  async updateInventory(inventoryData: UpdateInventoryDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const item of inventoryData) {
        const { id, product_name, quantity, price } = item;

        const existingProduct = await queryRunner.manager.findOne(Inventory, {
          where: { id: id },
        });

        if (!existingProduct) {
          throw new Error(
            `Product with ID ${id} and product name ${product_name} not found.`,
          );
        }
        existingProduct.quantity = quantity;
        existingProduct.price = price;
        await queryRunner.manager.save(existingProduct);
      }
      await queryRunner.commitTransaction();

      this.logger.log(
        `Updating inventory, items: ${JSON.stringify(inventoryData)}`,
      );
    } catch (error) {
      this.logger.error(`Error updating inventory: ${error}`);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async removeFromInventory(
    inventoryData: DeleteInventoryDto[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const itemIds = inventoryData.map(({ id }) => id);

      await queryRunner.manager.delete(Inventory, itemIds);

      await queryRunner.commitTransaction();
      this.logger.log(`Removing items from inventory.`);
    } catch (error) {
      this.logger.error(`Error removing items from inventory: ${error}`);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async decrementQuantity(inventoryData: UpdateInventoryDto[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const item of inventoryData) {
        this.logger.log(`Ordered item: ${JSON.stringify(item)}`);
        const { id, product_name, quantity } = item;

        const existingProduct = await queryRunner.manager.findOne(Inventory, {
          where: { id: id },
        });

        if (!existingProduct) {
          throw new Error(
            `Product with ID ${id} and product name ${product_name} not found.`,
          );
        }
        const updatedQuantity = Math.max(
          existingProduct.quantity - quantity,
          0,
        );
        existingProduct.quantity = updatedQuantity;
        await queryRunner.manager.save(existingProduct);
        this.logger.log(`Updated item: ${JSON.stringify(existingProduct)}`);
      }
      await queryRunner.commitTransaction();

      this.logger.log(
        `Updating inventory, items: ${JSON.stringify(inventoryData)}`,
      );
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Error updating ordered items quantity in inventory: ${error}`,
      );
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async checkInventory(inventoryData: Inventory[]): Promise<boolean> {
    try {
      for (const item of inventoryData) {
        this.logger.log(`Ordered Item: ${JSON.stringify(item)}`);
        const existingProduct = await this.inventoryRepository.findOne({
          where: {
            id: item.id,
          },
        });
        this.logger.log(`Existing Item: ${JSON.stringify(item)}`);

        if (!existingProduct) {
          this.logger.error(
            `Product with ID ${item.id} not found in inventory.`,
          );
          return false;
        }

        if (existingProduct.quantity < item.quantity) {
          this.logger.log(
            `Not enough stock for product: ${item.product_name}. Required: ${item.quantity}, Available: ${existingProduct.quantity}`,
          );
          return false;
        }
      }

      this.logger.log(
        `Inventory is available for: ${JSON.stringify(inventoryData)}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Error checking inventory: ${error}`);
      throw new Error('Failed to check inventory'); // Or return false if you prefer not to throw
    }
  }
}
