import { Module } from '@nestjs/common';
import { IntermediaryController } from './intermediary.controller';
import { IntermediaryService } from './intermediary.service';
import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [IntermediaryController],
  providers: [IntermediaryService, RabbitMqService],
})
export class IntermediaryModule {}
