import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService, RabbitMqService],
})
export class AppModule {}
