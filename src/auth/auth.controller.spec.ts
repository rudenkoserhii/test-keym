import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from 'auth/auth.service';
import { AuthDto, AuthForgotDto } from 'auth/dto';
import { CreateUserDto } from 'user/dto';
import { AuthEntity } from 'auth/auth.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        registration: jest.fn(),
        login: jest.fn(),
        forgot: jest.fn(),
    };

    const mockJwtService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService, },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('registration', () => {
        it('should register a new user and return AuthEntity', async () => {
            const userDto: CreateUserDto = { email: 'test@example.com', password: 'password', name: 'Test User' };
            const result: AuthEntity = { token: 'mock-token' } as AuthEntity;

            mockAuthService.registration.mockResolvedValue(result);

            const response = await authController.registration(userDto);

            expect(response).toEqual(result);
            expect(mockAuthService.registration).toHaveBeenCalledWith(userDto);
        });
    });

    describe('login', () => {
        it('should log in an existing user and return AuthEntity', async () => {
            const authDto: AuthDto = { email: 'test@example.com', password: 'password' };
            const result: AuthEntity = { token: 'mock-token' } as AuthEntity;

            mockAuthService.login.mockResolvedValue(result);

            const response = await authController.login(authDto);

            expect(response).toEqual(result);
            expect(mockAuthService.login).toHaveBeenCalledWith(authDto);
        });
    });

    describe('forgot', () => {
        it('should reset the password and return AuthEntity', async () => {
            const authForgotDto: AuthForgotDto = { email: 'test@example.com', password: 'newpassword' };
            const result: AuthEntity = { token: 'mock-token' } as AuthEntity;

            mockAuthService.forgot.mockResolvedValue(result);

            const response = await authController.forgot(authForgotDto);

            expect(response).toEqual(result);
            expect(mockAuthService.forgot).toHaveBeenCalledWith(authForgotDto);
        });
    });

    describe('logout', () => {
        it('should log out the user and return a logout message', () => {
            const req = { session: { destroy: jest.fn() } } as unknown as Request;

            const result = { message: 'User session has ended' };

            const response = authController.logout(req);

            expect(response).toEqual(result);
            expect(req.session.destroy).toHaveBeenCalled();
        });
    });
});
