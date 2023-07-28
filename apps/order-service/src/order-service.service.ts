import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
