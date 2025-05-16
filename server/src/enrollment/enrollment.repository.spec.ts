import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { Enrollment } from './interfaces/enrollment.interface';
import { EnrollmentNotFoundException, EnrollmentUpsertFailedException } from './exceptions';

describe('EnrollmentRepository', () => {
  let repository: EnrollmentRepository;
  let enrollmentModel: Model<Enrollment>;
  
  const mockEnrollment = {
    _id: 'enrollment-id',
    ma_sv: 'SV001',
    ma_mon: 'MON001',
    ma_lop: 'LOP001',
    thoi_gian_dang_ky: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockEnrollmentModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    new: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentRepository,
        {
          provide: getModelToken('Enrollment'),
          useValue: mockEnrollmentModel,
        },
      ],
    }).compile();

    repository = module.get<EnrollmentRepository>(EnrollmentRepository);
    enrollmentModel = module.get<Model<Enrollment>>(getModelToken('Enrollment'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return an enrollment if found', async () => {
      mockEnrollmentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEnrollment),
      });

      const result = await repository.findById('enrollment-id');

      expect(mockEnrollmentModel.findById).toHaveBeenCalledWith('enrollment-id');
      expect(result).toEqual(mockEnrollment);
    });

    it('should throw EnrollmentNotFoundException if enrollment not found', async () => {
      mockEnrollmentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(repository.findById('non-existent-id')).rejects.toThrow(EnrollmentNotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated enrollments', async () => {
      const paginationOptions = { page: 2, limit: 10 };
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockEnrollment]),
      };

      mockEnrollmentModel.find.mockReturnValue(mockQueryBuilder);
      mockEnrollmentModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(15), // Total 15 records
      });

      const result = await repository.findAll(paginationOptions);

      expect(mockEnrollmentModel.find).toHaveBeenCalledWith({ deleted_at: null });
      expect(mockEnrollmentModel.countDocuments).toHaveBeenCalledWith({ deleted_at: null });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10); // Skip (page-1)*limit = 10
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      
      expect(result.data).toEqual([mockEnrollment]);
      expect(result.meta.page).toEqual(2);
      expect(result.meta.limit).toEqual(10);
      expect(result.meta.totalPages).toEqual(2);
      expect(result.meta.total).toEqual(15);
    });
  });

  describe('delete', () => {
    it('should perform soft delete by setting deleted_at', async () => {
      mockEnrollmentModel.findByIdAndUpdate.mockResolvedValue({
        ...mockEnrollment,
        deleted_at: new Date(),
      });

      const result = await repository.delete('enrollment-id');

      expect(mockEnrollmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'enrollment-id',
        { deleted_at: expect.any(Date) },
        { new: true },
      );
      expect(result.deleted_at).toBeDefined();
    });

    it('should throw EnrollmentNotFoundException if enrollment not found', async () => {
      mockEnrollmentModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(repository.delete('non-existent-id')).rejects.toThrow(EnrollmentNotFoundException);
    });
  });

  describe('upsert', () => {
    it('should upsert an enrollment successfully', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: 'LOP001',
        thoi_gian_dang_ky: new Date(),
      };

      mockEnrollmentModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockEnrollment, ...enrollmentData }),
      });

      const result = await repository.upsert(enrollmentData);

      expect(mockEnrollmentModel.findOneAndUpdate).toHaveBeenCalledWith(
        { ma_sv: 'SV001',  ma_lop_mo: 'LOP001', deleted_at: null },
        {
          $set: expect.objectContaining({
            ...enrollmentData,
            updated_at: expect.any(Date),
          }),
          $setOnInsert: expect.objectContaining({
            created_at: expect.any(Date),
          })
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      expect(result.ma_sv).toEqual(enrollmentData.ma_sv);
      expect(result.ma_lop_mo).toEqual(enrollmentData.ma_lop_mo);
    });

    it('should throw EnrollmentUpsertFailedException if upsert fails', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: 'LOP001',
      };

      mockEnrollmentModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(repository.upsert(enrollmentData)).rejects.toThrow(EnrollmentUpsertFailedException);
    });

    it('should handle MongoDB duplicate key error (11000)', async () => {
      const enrollmentData = {
        ma_sv: 'SV001',
        ma_lop_mo: 'LOP001',
      };

      const error = new Error('Duplicate key error');
      (error as any).code = 11000;

      mockEnrollmentModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(error),
      });

      await expect(repository.upsert(enrollmentData)).rejects.toThrow(/Conflict with enrollment/);
    });
  });
}); 