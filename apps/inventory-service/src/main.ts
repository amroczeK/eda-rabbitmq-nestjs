import { NestFactory } from '@nestjs/core';
import { InventoryServiceModule } from './inventory-service.module';
import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);
  const rabbitMqService = app.get<RabbitMqService>(RabbitMqService);
  app.connectMicroservice(rabbitMqService.getOptions('INVENTORY'));
  await app.startAllMicroservices();
}
bootstrap();
