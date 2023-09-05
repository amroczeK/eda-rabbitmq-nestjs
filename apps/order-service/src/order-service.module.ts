import { Module } from '@nestjs/common';
import { OrderServiceController } from './order-service.controller';
import { OrderService } from './order-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { DatabaseModule } from '@app/common/database/database.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_ORDER_QUEUE: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
      envFilePath: './apps/order-service/.env',
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'shop.topic',
          type: 'topic',
        },
        {
          name: 'shop.direct',
          type: 'direct',
        },
      ],
      uri: process.env.RABBIT_MQ_URI,
      enableControllerDiscovery: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  controllers: [OrderServiceController],
  providers: [OrderService, OrderServiceController],
})
export class OrderServiceModule {}
