import { Module } from '@nestjs/common';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';
import { RabbitMqModule } from '@app/common/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [RabbitMqModule],
  controllers: [OrderServiceController],
  providers: [OrderServiceService],
})
export class OrderServiceModule {}
