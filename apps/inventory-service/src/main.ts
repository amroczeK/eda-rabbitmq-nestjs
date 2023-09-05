import { NestFactory } from '@nestjs/core';
import { InventoryServiceModule } from './inventory-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);
  await app.listen(3002, () =>
    console.log('Inventory Service is listening on port 3002.'),
  );
}
bootstrap();
