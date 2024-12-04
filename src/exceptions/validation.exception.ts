import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  messages: string | string[] | Record<string, any>;

  constructor(response: string | string[] | Record<string, any>) {
    super(response, HttpStatus.BAD_REQUEST);
    this.messages = response;
  }
}
