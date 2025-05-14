import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './services/enrollment.service';
import { ENROLLMENT_REPOSITORY } from './repositories/enrollment.repository.interface';
import { EnrollmentValidationException } from './exceptions';
import { Logger } from '@nestjs/common';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      upsert: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: ENROLLMENT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    // Override the logger to avoid console outputs during tests
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsert', () => {
    it('should call repository upsert with valid data', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: 'LOP001',
        thoi_gian_dang_ky: new Date(),
      };

      mockRepository.upsert.mockResolvedValue({
        _id: 'some-id',
        ...enrollmentData,
      });

      const result = await service.upsert(enrollmentData);

      expect(mockRepository.upsert).toHaveBeenCalledWith(enrollmentData);
      expect(result).toEqual({
        _id: 'some-id',
        ...enrollmentData,
      });
    });

    it('should throw EnrollmentValidationException when ma_sv is missing', async () => {
      const enrollmentData = {
        ma_sv: '',
        ma_lop_mo: 'LOP001',
      };

      await expect(service.upsert(enrollmentData)).rejects.toThrow(EnrollmentValidationException);
      expect(mockRepository.upsert).not.toHaveBeenCalled();
    });

    it('should throw EnrollmentValidationException when ma_mon is missing', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: '',
      };

      await expect(service.upsert(enrollmentData)).rejects.toThrow(EnrollmentValidationException);
      expect(mockRepository.upsert).not.toHaveBeenCalled();
    });


    it('should propagate errors from repository', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: 'LOP001',
      };

      const error = new Error('Repository error');
      mockRepository.upsert.mockRejectedValue(error);

      await expect(service.upsert(enrollmentData)).rejects.toThrow('Repository error');
    });
  });

  describe('get', () => {
    it('should call repository findAll with pagination options', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [{ _id: 'id1', ma_sv: 'SV001' }],
        meta: { page: 1, limit: 10, totalPages: 1, total: 1 }
      };

      mockRepository.findAll.mockResolvedValue(paginatedResult);

      const result = await service.get(paginationOptions);

      expect(mockRepository.findAll).toHaveBeenCalledWith(paginationOptions);
      expect(result).toEqual(paginatedResult);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.get({})).rejects.toThrow('Repository error');
    });
  });

  describe('detail', () => {
    it('should call repository findById with id', async () => {
      const id = 'enrollment-id';
      const enrollment = { _id: id, ma_sv: 'SV001' };

      mockRepository.findById.mockResolvedValue(enrollment);

      const result = await service.detail(id);

      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(enrollment);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Repository error'));

      await expect(service.detail('id')).rejects.toThrow('Repository error');
    });
  });

  describe('delete', () => {
    it('should call repository delete with id', async () => {
      const id = 'enrollment-id';
      const enrollment = { _id: id, ma_sv: 'SV001', deleted_at: new Date() };

      mockRepository.delete.mockResolvedValue(enrollment);

      const result = await service.delete(id);

      expect(mockRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(enrollment);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Repository error'));

      await expect(service.delete('id')).rejects.toThrow('Repository error');
    });
  });
}); 