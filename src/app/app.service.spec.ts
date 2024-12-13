import { Test, TestingModule } from '@nestjs/testing';

import { MESSAGES } from 'constants/messages.enum';
import { AppService } from 'app/app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should return Greetengs', () => {
    expect(service.getHello()).toBe(MESSAGES.HELLO_GREETINGS);
  });
});
