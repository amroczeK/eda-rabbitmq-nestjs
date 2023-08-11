import { Injectable } from '@nestjs/common';

@Injectable()
export class IntermediaryService {
  getHello(): string {
    return 'Hello World!';
  }
}
