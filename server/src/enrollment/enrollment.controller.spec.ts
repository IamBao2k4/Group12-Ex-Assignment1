import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './controllers/enrollment.controller';
import { EnrollmentService } from './services/enrollment.service';
import { EnrollmentNotFoundException, EnrollmentValidationException } from './exceptions';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;
  let service: EnrollmentService;

  beforeEach(async () => {
    const mockService = {
      upsert: jest.fn(),
      get: jest.fn(),
      detail: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        {
          provide: EnrollmentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
    service = module.get<EnrollmentService>(EnrollmentService);

    // Mock the logger to prevent console outputs during tests
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upsert', () => {
    it('should call service upsert method with enrollment data', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: 'LOP001',
      };
      const expectedResult = { id: 'some-id', ...enrollmentData };

      jest.spyOn(service, 'upsert').mockResolvedValue(expectedResult as any);

      const result = await controller.upsert(enrollmentData);

      expect(service.upsert).toHaveBeenCalledWith(enrollmentData);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate EnrollmentValidationException', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: 'LOP001',
      };

      const validationError = new EnrollmentValidationException('Validation failed');
      jest.spyOn(service, 'upsert').mockRejectedValue(validationError);

      await expect(controller.upsert(enrollmentData)).rejects.toThrow(EnrollmentValidationException);
    });

    it('should wrap unknown errors in HttpException', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: 'LOP001',
      };

      const unknownError = new Error('Unknown error');
      jest.spyOn(service, 'upsert').mockRejectedValue(unknownError);

      await expect(controller.upsert(enrollmentData)).rejects.toThrow(HttpException);
    });
  });

  describe('get', () => {
    it('should call service get method with pagination options', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const expectedResult = {
        data: [{ id: 'enrollment1' }],
        meta: { page: 1, limit: 10, totalPages: 1, total: 1 }
      };

      jest.spyOn(service, 'get').mockResolvedValue(expectedResult as any);

      const result = await controller.get(paginationOptions);

      expect(service.get).toHaveBeenCalledWith(paginationOptions);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors and wrap them in HttpException', async () => {
      const paginationOptions = { page: 1, limit: 10 };

      jest.spyOn(service, 'get').mockRejectedValue(new Error('Service error'));

      await expect(controller.get(paginationOptions)).rejects.toThrow(HttpException);
    });
  });

  describe('detail', () => {
    it('should call service detail method with enrollment id', async () => {
      const id = '  enrollment-id  '; // With spaces to test trimming
      const expectedResult = { id: 'enrollment-id', ma_sv: 'SV001' };

      jest.spyOn(service, 'detail').mockResolvedValue(expectedResult as any);

      const result = await controller.detail(id);

      expect(service.detail).toHaveBeenCalledWith('enrollment-id'); // Trimmed
      expect(result).toEqual(expectedResult);
    });

    it('should propagate EnrollmentNotFoundException', async () => {
      const id = 'non-existent-id';
      const notFoundError = new EnrollmentNotFoundException(id);

      jest.spyOn(service, 'detail').mockRejectedValue(notFoundError);

      await expect(controller.detail(id)).rejects.toThrow(EnrollmentNotFoundException);
    });

    it('should wrap unknown errors in HttpException', async () => {
      const id = 'enrollment-id';

      jest.spyOn(service, 'detail').mockRejectedValue(new Error('Unknown error'));

      await expect(controller.detail(id)).rejects.toThrow(HttpException);
    });
  });

  describe('delete', () => {
    it('should call service delete method with enrollment id', async () => {
      const id = '  enrollment-id  '; // With spaces to test trimming
      const expectedResult = { id: 'enrollment-id', deleted_at: new Date() };

      jest.spyOn(service, 'delete').mockResolvedValue(expectedResult as any);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith('enrollment-id'); // Trimmed
      expect(result).toEqual(expectedResult);
    });

    it('should propagate EnrollmentNotFoundException', async () => {
      const id = 'non-existent-id';
      const notFoundError = new EnrollmentNotFoundException(id);

      jest.spyOn(service, 'delete').mockRejectedValue(notFoundError);

      await expect(controller.delete(id)).rejects.toThrow(EnrollmentNotFoundException);
    });

    it('should wrap unknown errors in HttpException', async () => {
      const id = 'enrollment-id';

      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Unknown error'));

      await expect(controller.delete(id)).rejects.toThrow(HttpException);
    });
  });
}); 