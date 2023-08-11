import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import { DatabaseModule } from './database/database.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [RabbitMqModule, DatabaseModule],
})
export class CommonModule {}
