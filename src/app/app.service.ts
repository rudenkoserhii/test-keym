import { Injectable } from '@nestjs/common';

const HELLO_GREETINGS = 'Hello!';

@Injectable()
export class AppService {

  /**
   * @desc Returns a greeting message.
   * @returns {string} The greeting message, which is "Hello!".
   */  
  getHello(): string {
    return HELLO_GREETINGS;
  }
}
