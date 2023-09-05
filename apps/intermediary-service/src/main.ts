import { NestFactory } from '@nestjs/core';
import { IntermediaryModule } from './intermediary.module';

async function bootstrap() {
  const app = await NestFactory.create(IntermediaryModule);
  await app.listen(3000, () =>
    console.log('Intermediary Service is listening on port 3000.'),
  );
}
bootstrap();
