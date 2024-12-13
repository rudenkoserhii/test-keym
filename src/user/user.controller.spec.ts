import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from 'user/user.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MESSAGES } from 'constants/messages.enum';

const mockUserService = {
    getUserByEmail: jest.fn(),
    updateUser: jest.fn(),
};

const mockJwtService = {};

describe('UserController', () => {
    let controller: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    describe('update', () => {
        it('should update the user name and return the updated user', async () => {
            const updateUserDto = { email: 'user@example.com', name: 'Updated Name' };
            const mockUser = { id: '1', email: 'user@example.com', name: 'Original Name' };
            const updatedUser = { ...mockUser, name: updateUserDto.name };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            mockUserService.getUserByEmail.mockResolvedValue(mockUser);
            mockUserService.updateUser.mockResolvedValue(updatedUser);

            await controller.update(updateUserDto, res);

            expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(updateUserDto.email);
            expect(mockUserService.updateUser).toHaveBeenCalledWith({ email: updateUserDto.email }, { name: updateUserDto.name });
            expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return 404 if the user is not found', async () => {
            const updateUserDto = { email: 'user@example.com', name: 'Updated Name' };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            mockUserService.getUserByEmail.mockResolvedValue(null);

            await controller.update(updateUserDto, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
            expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.USER_NOT_FOUND });
        });

        it('should return 500 if there is an internal error', async () => {
            const updateUserDto = { email: 'user@example.com', name: 'Updated Name' };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            mockUserService.getUserByEmail.mockRejectedValue(new Error(MESSAGES.INTERNAL_SERVER_ERROR));

            await controller.update(updateUserDto, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.INTERNAL_SERVER_ERROR });
        });
    });

    describe('current', () => {
        it('should return the current user data', async () => {
            const mockUser = { id: '1', email: 'user@example.com', name: 'John Doe' };
            const req = { user: { email: 'user@example.com' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            mockUserService.getUserByEmail.mockResolvedValue(mockUser);

            await controller.current(req, res);

            expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('user@example.com');
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 if the user is not found', async () => {
            const req = { user: { email: 'user@example.com' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            mockUserService.getUserByEmail.mockResolvedValue(null);

            await controller.current(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
            expect(res.json).toHaveBeenCalledWith({ message: MESSAGES.USER_NOT_FOUND });
        });

        it('should return 500 if there is an internal error', async () => {
            const req = { user: { email: 'user@example.com' } } as any;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            mockUserService.getUserByEmail.mockRejectedValue(new Error(MESSAGES.INTERNAL_SERVER_ERROR));

            await controller.current(req, res);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith(MESSAGES.INTERNAL_SERVER_ERROR);
        });
    });
});
