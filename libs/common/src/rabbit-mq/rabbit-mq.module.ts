import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';

@Module({
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
