import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  getHello(): string {
    return 'Hello World!';
  }
}
