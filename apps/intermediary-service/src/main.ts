import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMqService } from '@app/common/rabbit-mq/rabbit-mq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rabbitMqService = app.get<RabbitMqService>(RabbitMqService);
  app.connectMicroservice(rabbitMqService.getOptions('ORDERS'));
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
