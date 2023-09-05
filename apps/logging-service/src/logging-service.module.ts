import { Module } from '@nestjs/common';
import { LoggingServiceController } from './logging-service.controller';
import { LoggingService } from './logging-service.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DatabaseModule } from '@app/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLog } from './entities/event-log.entity';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
      envFilePath: './apps/logging-service/.env',
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'shop.topic',
          type: 'topic',
        },
      ],
      uri: process.env.RABBIT_MQ_URI,
      enableControllerDiscovery: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([EventLog]),
  ],
  controllers: [LoggingServiceController],
  providers: [LoggingService],
})
export class LoggingServiceModule {}
