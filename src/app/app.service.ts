import { Injectable } from '@nestjs/common';

import { MESSAGES } from 'constants/messages.enum';

@Injectable()
export class AppService {

  /**
   * @desc Returns a greeting message.
   * @returns {string} The greeting message, which is "Hello!".
   */  
  getHello(): string {
    return MESSAGES.HELLO_GREETINGS;
  }
}
