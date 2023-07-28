import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [RabbitMqModule],
})
export class CommonModule {}
