import { Injectable } from '@nestjs/common';

const HELLO_GREETINGS = 'Hello!';

@Injectable()
export class AppService {
  getHello(): string {
    return HELLO_GREETINGS;
  }
}
