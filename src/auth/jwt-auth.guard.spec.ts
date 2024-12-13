import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { MESSAGES } from 'constants/messages.enum';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('canActivate', () => {
    it('should throw UnauthorizedException if no Authorization header is provided', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException({ message: MESSAGES.AUTH_HEADER_MISSING })
      );
    });

    it('should throw UnauthorizedException if Authorization header is invalid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'InvalidHeader',
            },
          }),
        }),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException({ message: MESSAGES.NOT_AUTHORIZED })
      );
    });

    it('should throw UnauthorizedException if JWT token is invalid or expired', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer invalid-token',
            },
          }),
        }),
      } as any;

      mockJwtService.verify.mockImplementation(() => {
        throw new Error(MESSAGES.INVALID_TOKEN);
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException({
          error: MESSAGES.INVALID_TOKEN,
          message: MESSAGES.NOT_AUTHORIZED,
        })
      );
    });

    it('should attach the user to the request and return true if the token is valid', async () => {
      const request = { headers: { authorization: 'Bearer valid-token' }, user: undefined };
      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as any;
    
      const mockUser = { id: 1, email: 'test@example.com' };
      mockJwtService.verify.mockReturnValue(mockUser);
    
      const result = await guard.canActivate(context);
    
      expect(result).toBe(true);
      expect(request.user).toEqual(mockUser); // Check the 'user' property on the actual request object
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token');
    });
  });
});
