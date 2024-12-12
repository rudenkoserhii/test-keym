import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from 'prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BookingEntity } from 'booking/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from 'booking/dto';

describe('BookingService', () => {
  let bookingService: BookingService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    booking: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    bookingService = module.get<BookingService>(BookingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAllBookings', () => {
    it('should return an array of bookings if userId is provided', async () => {
      const userId = 'user-id';
      const mockBookings = [{ id: '1', userId, hotel: 'Hotel A', startDate: new Date(), endDate: new Date() }];
      
      mockPrismaService.booking.findMany.mockResolvedValue(mockBookings);

      const result = await bookingService.getAllBookings(userId);

      expect(result).toEqual(mockBookings);
      expect(prismaService.booking.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { user: true },
      });
    });

    it('should return null if no userId is provided', async () => {
      const result = await bookingService.getAllBookings('');
      expect(result).toBeNull();
    });
  });

  describe('getBookingById', () => {
    it('should return a booking if it belongs to the user', async () => {
      const bookingId = 'booking-id';
      const userId = 'user-id';
      const mockBooking = { id: bookingId, userId, hotel: 'Hotel A', startDate: new Date('2024-12-01'), endDate: new Date('2024-12-05') };

      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

      const result = await bookingService.getBookingById(bookingId, userId);
console.log('result', result);

      expect(result).toEqual(mockBooking);
    });

    it('should return null if booking does not belong to the user', async () => {
      const bookingId = 'booking-id';
      const userId = 'user-id';
      const mockBooking = { id: bookingId, userId: 'another-user-id', hotel: 'Hotel A', startDate: new Date('2024-12-01'), endDate: new Date('2024-12-05') };

      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

      const result = await bookingService.getBookingById(bookingId, userId);

      expect(result).toBeNull();
    });
  });

  describe('createBooking', () => {
    it('should throw an error if the start date is later than the end date', async () => {
      const createBookingDto: CreateBookingDto = {
        hotel: 'Hotel A',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-11-30'),
        userId: 'user-id',
      };

      await expect(bookingService.createBooking(createBookingDto)).rejects.toThrow(new HttpException(
        'Start date can\'t be later than end date',
        HttpStatus.BAD_REQUEST,
      ));
    });

    it('should throw an error if the hotel is already booked in the selected period', async () => {
      const createBookingDto: CreateBookingDto = {
        hotel: 'Hotel A',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-05'),
        userId: 'user-id',
      };

      const busySlots = [{ id: '1', hotel: 'Hotel A', startDate: new Date('2024-12-01'), endDate: new Date('2024-12-05') }];
      mockPrismaService.booking.findMany.mockResolvedValue(busySlots);

      await expect(bookingService.createBooking(createBookingDto)).rejects.toThrow(new HttpException(
        'This hotel is already booked during the selected time period',
        HttpStatus.BAD_REQUEST,
      ));
    });

    it('should create a new booking if the inputs are valid', async () => {
      const createBookingDto: CreateBookingDto = {
        hotel: 'Hotel A',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-05'),
        userId: 'user-id',
      };

      const newBooking = { id: '1', ...createBookingDto, user: { id: 'user-id', email: 'test@example.com' } };
      mockPrismaService.booking.create.mockResolvedValue(newBooking);

      const result = await bookingService.createBooking(createBookingDto);

      expect(result).toEqual(newBooking);
      expect(mockPrismaService.booking.create).toHaveBeenCalledWith({ data: createBookingDto, include: { user: true } });
    });
  });

  describe('updateBookingById', () => {
    it('should update the booking if it is valid and no conflicts exist', async () => {
      const bookingId = 'booking-id';
      const updateBookingDto: UpdateBookingDto = {
        hotel: 'Hotel B',
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-15'),
      };

      const mockBooking = { id: bookingId, hotel: 'Hotel A', startDate: new Date('2024-12-01'), endDate: new Date('2024-12-05') };
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.booking.findMany.mockResolvedValue([]);

      const updatedBooking = { ...mockBooking, ...updateBookingDto };
      mockPrismaService.booking.update.mockResolvedValue(updatedBooking);

      const result = await bookingService.updateBookingById(bookingId, updateBookingDto);

      expect(result).toEqual(updatedBooking);
    });

    it('should throw an error if the start date is later than the end date', async () => {
      const bookingId = 'booking-id';
      const updateBookingDto: UpdateBookingDto = {
        hotel: 'Hotel A',
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-05'),
      };

      await expect(bookingService.updateBookingById(bookingId, updateBookingDto)).rejects.toThrow(new HttpException(
        'Start date can\'t be later than end date',
        HttpStatus.BAD_REQUEST,
      ));
    });
  });

  describe('deleteBooking', () => {
    it('should delete the booking successfully', async () => {
      const bookingId = 'booking-id';
      mockPrismaService.booking.delete.mockResolvedValue(undefined);

      await expect(bookingService.deleteBooking(bookingId)).resolves.toBeUndefined();
      expect(mockPrismaService.booking.delete).toHaveBeenCalledWith({ where: { id: bookingId } });
    });
  });
});
