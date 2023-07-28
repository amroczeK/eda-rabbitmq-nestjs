import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMqModule } from '@app/common/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [RabbitMqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
