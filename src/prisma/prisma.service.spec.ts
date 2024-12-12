import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';
import { PRISMA_SERVICE_OPTIONS } from './prisma.constants';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let prismaClientMock: Partial<PrismaClient>;
  let prismaServiceOptionsMock: any;

  beforeEach(async () => {
    // Mocking the PrismaClient methods
    prismaClientMock = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $use: jest.fn(),
      $on: jest.fn(),
      $transaction: jest.fn(),
      $runCommandRaw: jest.fn(),
      $extends: jest.fn().mockImplementation(() => {
        return {
          extArgs: {}, // 'extArgs' needs to be provided to satisfy the type
          extends: jest.fn(),
          define: jest.fn().mockReturnValue({
            $extends: {
              extArgs: {}, // Define extArgs here too
            },
          }),
        };
      }),
    };

    prismaServiceOptionsMock = {
      prismaOptions: {},
      middlewares: [],
      explicitConnect: true,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: PRISMA_SERVICE_OPTIONS,
          useValue: prismaServiceOptionsMock,
        },
      ],
    })
      .overrideProvider(PrismaClient)
      .useValue(prismaClientMock) // Use the mocked PrismaClient
      .compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('constructor', () => {
    it('should initialize PrismaClient with options and apply middlewares', () => {
      const middleware = jest.fn();
      prismaServiceOptionsMock.middlewares = [middleware];

      // Recreate PrismaService to apply the middleware.
      const newPrismaService = new PrismaService(prismaServiceOptionsMock);

      // Ensure $use was called with the middleware
      expect(newPrismaService.$use).toHaveBeenCalledWith(middleware);
    });

    it('should initialize PrismaClient with default options when no options are provided', () => {
      const serviceWithoutOptions = new PrismaService();

      // Verify $use is not called without middlewares
      expect(serviceWithoutOptions.$use).not.toHaveBeenCalled();
    });
  });

  describe('onModuleInit', () => {
    it('should connect to the database when explicitConnect is true', async () => {
      await prismaService.onModuleInit();

      // Ensure $connect was called
      expect(prismaClientMock.$connect).toHaveBeenCalled();
    });

    it('should not connect to the database when explicitConnect is false', async () => {
      prismaServiceOptionsMock.explicitConnect = false;

      const serviceWithNoConnection = new PrismaService(prismaServiceOptionsMock);
      await serviceWithNoConnection.onModuleInit();

      // Ensure $connect was not called
      expect(prismaClientMock.$connect).not.toHaveBeenCalled();
    });
  });

  describe('onApplicationShutdown', () => {
    it('should disconnect from the database during application shutdown', async () => {
      await prismaService.onApplicationShutdown();

      // Ensure $disconnect was called
      expect(prismaClientMock.$disconnect).toHaveBeenCalled();
    });
  });
});
