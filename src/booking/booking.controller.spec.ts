import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from 'booking/booking.service';
import { BookingEntity } from 'booking/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from 'booking/dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { Request, Response } from 'express';

describe('BookingController', () => {
    let controller: BookingController;
    let bookingService: BookingService;

    const mockBookingService = {
        getAllBookings: jest.fn(),
        getBookingById: jest.fn().mockResolvedValue({
            id: '1',
            hotel: 'Hotel A',
            userId: 'user-id',
            startDate: new Date(),
            endDate: new Date(),
            user: {
                name: '',
                id: 'user-id',
                email: 'test@example.com',
                password: '1234567'
            }
        }),
        createBooking: jest.fn(),
        updateBookingById: jest.fn(),
        deleteBooking: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingController],
            providers: [
                { provide: BookingService, useValue: mockBookingService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<BookingController>(BookingController);
        bookingService = module.get<BookingService>(BookingService);
    });

    describe('getAll', () => {
        it('should return an array of bookings for the authenticated user', async () => {
            const mockBookings: BookingEntity[] = [
                {
                    id: '1',
                    hotel: 'Hotel A',
                    userId: 'user-id',
                    startDate: new Date(),
                    endDate: new Date(),
                    user: {
                        name: '',
                        id: 'user-id',
                        email: 'test@example.com',
                        password: '1234567'
                    }
                },
                {
                    id: '2',
                    hotel: 'Hotel B',
                    userId: 'user-id',
                    startDate: new Date(),
                    endDate: new Date(),
                    user: {
                        name: '',
                        id: 'user-id',
                        email: 'test@example.com',
                        password: '1234567'
                    }
                },
            ];
            const mockRequest: Partial<Request> = { user: { id: 'user-id' } };
            mockBookingService.getAllBookings.mockResolvedValue(mockBookings);

            const result = await controller.getAll(mockRequest as Request);

            expect(result).toEqual(mockBookings);
            expect(mockBookingService.getAllBookings).toHaveBeenCalledWith('user-id');
        });

        it('should throw an error if no bookings are found', async () => {
            const mockRequest: Partial<Request> = { user: { id: 'user-id' } };
            mockBookingService.getAllBookings.mockResolvedValue(null);

            await expect(controller.getAll(mockRequest as Request)).rejects.toThrow(
                new HttpException('Not found', HttpStatus.NOT_FOUND),
            );
        });
    });

    describe('getAlone', () => {
        it('should return a single booking for the authenticated user', async () => {
            const mockBooking: BookingEntity = {
                id: '1',
                hotel: 'Hotel A',
                userId: 'user-id',
                startDate: new Date(),
                endDate: new Date(),
                user: {
                    name: '',
                    id: 'user-id',
                    email: 'test@example.com',
                    password: '1234567'
                }
            };
            const mockRequest: Partial<Request> = { user: { id: 'user-id' } };
            mockBookingService.getBookingById.mockResolvedValueOnce(mockBooking);

            const result = await controller.getAlone('1', mockRequest as Request);

            expect(result).toEqual(mockBooking);
            expect(mockBookingService.getBookingById).toHaveBeenCalledWith('1', 'user-id');
        });

        it('should throw an error if booking is not found', async () => {
            const mockRequest: Partial<Request> = { user: { id: 'another-user-id' } };
            mockBookingService.getBookingById.mockResolvedValue(null);

            await expect(controller.getAlone('1', mockRequest as Request)).resolves.toEqual(
                new HttpException('Not found', HttpStatus.NOT_FOUND),
            );
        });
    });

    describe('create', () => {
        it('should create a new booking and return it', async () => {
            const createBookingDto: CreateBookingDto = { hotel: 'Hotel A', startDate: new Date(), endDate: new Date(), userId: 'user-id' };
            const mockBooking: BookingEntity = {
                id: '1',
                hotel: 'Hotel A',
                userId: 'user-id',
                startDate: new Date(),
                endDate: new Date(),
                user: {
                    name: '',
                    id: 'user-id',
                    email: 'test@example.com',
                    password: '1234567'
                }
            };
            const mockRequest: Partial<Request> = { user: { id: 'user-id' } };
            mockBookingService.createBooking.mockResolvedValue(mockBooking);

            const result = await controller.create(mockRequest as Request, createBookingDto, {} as Response);

            expect(result).toEqual(mockBooking);
            expect(mockBookingService.createBooking).toHaveBeenCalledWith({
                userId: 'user-id',
                ...createBookingDto,
            });
        });

        it('should throw an error if start date is later than end date', async () => {
            const createBookingDto: CreateBookingDto = { hotel: 'Hotel A', startDate: new Date('2024-12-01'), endDate: new Date('2024-11-30'), userId: 'user-id' };
            const mockRequest: Partial<Request> = { user: { id: 'user-id' } };

            mockBookingService.createBooking.mockRejectedValue(new HttpException('Start date can\'t be later than end date', HttpStatus.BAD_REQUEST));

            await expect(controller.create(mockRequest as Request, createBookingDto, {} as Response)).rejects.toThrow(
                new HttpException('Start date can\'t be later than end date', HttpStatus.BAD_REQUEST),
            );
        });
    });

    describe('update', () => {
        it('should update a booking and return it', async () => {
            const updateBookingDto: UpdateBookingDto = { hotel: 'Hotel B', startDate: new Date(), endDate: new Date() };
            const mockBooking: BookingEntity = {
                id: '1',
                hotel: 'Hotel A',
                userId: 'user-id',
                startDate: new Date(),
                endDate: new Date(),
                user: {
                    name: '',
                    id: 'user-id',
                    email: 'test@example.com',
                    password: '1234567'
                }
            };
            mockBookingService.updateBookingById.mockResolvedValue(mockBooking);

            const result = await controller.update('1', updateBookingDto);

            expect(result).toEqual(mockBooking);
            expect(mockBookingService.updateBookingById).toHaveBeenCalledWith('1', updateBookingDto);
        });
    });

    describe('delete', () => {
        it('should delete a booking successfully', async () => {
            mockBookingService.deleteBooking.mockResolvedValue(undefined);

            await expect(controller.delete('1')).resolves.toBeUndefined();
            expect(mockBookingService.deleteBooking).toHaveBeenCalledWith('1');
        });
    });
});
