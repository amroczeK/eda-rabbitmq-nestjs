import { Module } from '@nestjs/common';
import { InventoryServiceController } from './inventory-service.controller';
import { InventoryService } from './inventory-service.service';
import { RabbitMqModule } from '@app/common/rabbit-mq/rabbit-mq.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_INVENTORY_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/order-service/.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Inventory]),
    RabbitMqModule,
  ],
  controllers: [InventoryServiceController],
  providers: [InventoryService],
})
export class InventoryServiceModule {}
