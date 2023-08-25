import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInventory1692939723066 implements MigrationInterface {
  private readonly logger = new Logger(SeedInventory1692939723066.name);

  public async up(queryRunner: QueryRunner): Promise<void> {
    this.logger.log('Seeding database');
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('inventory')
      .values([
        { product_name: 'Laptop', quantity: 50, price: 1000 },
        { product_name: 'Phone', quantity: 200, price: 500 },
        { product_name: 'Keyboard', quantity: 100, price: 50 },
        { product_name: 'Mouse', quantity: 100, price: 45 },
        { product_name: 'Laptop Stand', quantity: 150, price: 35 },
        { product_name: 'Mouse Pad', quantity: 200, price: 25 },
        { product_name: 'Phone Case', quantity: 175, price: 30 },
        { product_name: 'KVM Switch', quantity: 100, price: 175 },
      ])
      .execute();
  }

  public async down(): Promise<void> {
    this.logger.log('Removing seeded data.');
    // If needed, add query runner logic to revert the changes (like deleting the seeded data)
  }
}
