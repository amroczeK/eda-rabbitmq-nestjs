import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [RabbitmqModule, RabbitMqModule],
})
export class CommonModule {}
