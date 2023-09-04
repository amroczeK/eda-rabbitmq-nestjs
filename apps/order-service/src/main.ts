import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  await app.listen(3001, () =>
    console.log('Order Service is listening on port 3001.'),
  );
}
bootstrap();
