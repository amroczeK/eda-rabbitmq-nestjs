import { NestFactory } from '@nestjs/core';
import { IntermediaryModule } from './intermediary.module';

async function bootstrap() {
  const app = await NestFactory.create(IntermediaryModule);
  await app.listen(3000);
}
bootstrap();
