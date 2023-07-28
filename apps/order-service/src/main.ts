import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  const rabbitMqService = app.get<RabbitMqService>(RabbitMqService);
  app.connectMicroservice(rabbitMqService.getOptions('ORDERS'));
  await app.startAllMicroservices();
}
bootstrap();
