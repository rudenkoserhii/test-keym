import { Controller, Get } from '@nestjs/common';

import { AppService } from 'app/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * @desc Handles the GET request for the root endpoint and returns a greeting message.
   * @returns {string} - A greeting message "Hello!" fetched from the AppService.
   */  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
