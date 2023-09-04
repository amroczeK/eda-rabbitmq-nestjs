import { Test, TestingModule } from '@nestjs/testing';
import { LoggingServiceController } from './logging-service.controller';
import { LoggingServiceService } from './logging-service.service';

describe('LoggingServiceController', () => {
  let loggingServiceController: LoggingServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoggingServiceController],
      providers: [LoggingServiceService],
    }).compile();

    loggingServiceController = app.get<LoggingServiceController>(LoggingServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(loggingServiceController.getHello()).toBe('Hello World!');
    });
  });
});
