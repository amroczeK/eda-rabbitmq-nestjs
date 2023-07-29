import { Module } from '@nestjs/common';
import { OrderServiceController } from './order-service.controller';
import { OrderService } from './order-service.service';
import { RabbitMqModule } from '@app/common/rabbit-mq/rabbit-mq.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
    }),
    ,
    RabbitMqModule,
  ],
  controllers: [OrderServiceController],
  providers: [OrderService],
})
export class OrderServiceModule {}
