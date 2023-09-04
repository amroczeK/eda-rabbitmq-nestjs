import { Controller, Get } from '@nestjs/common';
import { LoggingService } from './logging-service.service';

@Controller()
export class LoggingServiceController {
  constructor(private readonly loggingServiceService: LoggingService) {}

  @Get()
  getHello(): string {
    return this.loggingServiceService.getHello();
  }
}
