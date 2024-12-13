import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from 'app/app.controller';
import { AppService } from 'app/app.service';
import { MESSAGES } from 'constants/messages.enum';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const mockAppService = {
      getHello: jest.fn().mockReturnValue(MESSAGES.HELLO_GREETINGS),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should return Greetings', () => {
    expect(appController.getHello()).toBe(MESSAGES.HELLO_GREETINGS);
  });

  it('should call appService.getHello once', () => {
    appController.getHello();
    expect(appService.getHello).toHaveBeenCalledTimes(1);
  });
});
