import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Order } from 'apps/order-service/src/entities/order.entity';
import { OrderItem } from 'apps/order-service/src/entities/order-item.entity';
import { Inventory } from 'apps/inventory-service/src/entities/inventory.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  database: configService.getOrThrow('POSTGRES_DB'),
  migrations: ['migrations/**'],
  entities: [Order, OrderItem, Inventory],
});
