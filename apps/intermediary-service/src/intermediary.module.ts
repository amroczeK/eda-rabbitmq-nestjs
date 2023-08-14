import { Module } from '@nestjs/common';
import { IntermediaryController } from './intermediary.controller';
import { IntermediaryService } from './intermediary.service';
import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_INTERMEDIARY_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/intermediary-service/.env',
    }),
  ],
  controllers: [IntermediaryController],
  providers: [IntermediaryService, RabbitMqService],
})
export class IntermediaryModule {}
