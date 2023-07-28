import { Module } from '@nestjs/common';
import { InventoryServiceController } from './inventory-service.controller';
import { InventoryServiceService } from './inventory-service.service';
import { RabbitMqModule } from '@app/common/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [RabbitMqModule],
  controllers: [InventoryServiceController],
  providers: [InventoryServiceService],
})
export class InventoryServiceModule {}
