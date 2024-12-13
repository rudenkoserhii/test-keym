import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';
import { PRISMA_SERVICE_OPTIONS } from './prisma.constants';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let prismaClientMock: MockProxy<PrismaClient>;
  let prismaServiceOptionsMock: any;


  beforeEach(async () => {
    prismaClientMock = mock<PrismaClient>();

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
      .useValue(prismaClientMock)
      .compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('constructor', () => {
    it('should initialize PrismaClient with options and apply middlewares', () => {
      const middleware = jest.fn();

      const newPrismaService = new PrismaService(prismaServiceOptionsMock);
      newPrismaService.$use = jest.fn();
      newPrismaService.$use(middleware);
      expect(newPrismaService.$use).toHaveBeenCalledWith(middleware);
    });

    it('should initialize PrismaClient with default options when no options are provided', () => {
      const serviceWithoutOptions = new PrismaService();
      serviceWithoutOptions.$use = jest.fn();

      expect(serviceWithoutOptions.$use).not.toHaveBeenCalled();
    });
  });

  describe('onModuleInit', () => {
    it('should connect to the database when explicitConnect is true', async () => {
      prismaServiceOptionsMock.explicitConnect = false;

      const serviceWithNoConnection = new PrismaService(prismaServiceOptionsMock);

      jest.spyOn(serviceWithNoConnection, '$connect').mockResolvedValue(undefined);
      await serviceWithNoConnection.onModuleInit();

      expect(serviceWithNoConnection.$connect).not.toHaveBeenCalled();
    });

    it('should not connect to the database when explicitConnect is false', async () => {
      prismaServiceOptionsMock.explicitConnect = false;

      const serviceWithNoConnection = new PrismaService(prismaServiceOptionsMock);
      await serviceWithNoConnection.onModuleInit();

      expect(prismaClientMock.$connect).not.toHaveBeenCalled();
    });
  });

  describe('onApplicationShutdown', () => {
    it('should disconnect from the database during application shutdown', async () => {
      const serviceWithConnection = new PrismaService({ ...prismaServiceOptionsMock, disconnectOnExit: true })

      jest.spyOn(serviceWithConnection, '$disconnect').mockResolvedValue(undefined);
      await serviceWithConnection.onApplicationShutdown();

      expect(serviceWithConnection.$disconnect).toHaveBeenCalled();
    });
  });
});
