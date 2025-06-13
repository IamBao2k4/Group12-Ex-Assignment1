import { Test, TestingModule } from '@nestjs/testing';
import { StudentStatusService } from './services/student_status.service';
import { STUDENT_STATUS_REPOSITORY } from './repositories/student_status.repository.interface';
import { StudentStatusNotFoundException } from './exceptions/student_status-not-found.exception';
import { Logger, NotFoundException } from '@nestjs/common';
import { CreateStudentStatusDto, UpdateStudentStatusDto } from './dtos/student_status.dto';

// Mock isValidObjectId từ utility
jest.mock('../common/utils/validation.util', () => ({
  isValidObjectId: jest.fn(),
}));

import { isValidObjectId } from '../common/utils/validation.util';

describe('StudentStatusService', () => {
  let service: StudentStatusService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      getAll: jest.fn(),
      detail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentStatusService,
        {
          provide: STUDENT_STATUS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StudentStatusService>(StudentStatusService);
    
    // Mock logger để tránh output console trong quá trình test
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository create with student status data', async () => {
      const createDto: CreateStudentStatusDto = {
        tinh_trang: { en: 'Studying', vi: 'Đang học' },
      };
      
      const expectedResult = {
        _id: 'status-id',
        ...createDto,
      };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const createDto: CreateStudentStatusDto = {
        tinh_trang: { en: 'Studying', vi: 'Đang học' },
      };
      
      const repositoryError = new Error('Repository error');
      mockRepository.create.mockRejectedValue(repositoryError);

      await expect(service.create(createDto)).rejects.toThrow('Repository error');
    });
  });

  describe('get', () => {
    it('should call repository findAll with pagination options', async () => {
      const paginationOptions = { limit: 10, skip: 0 };
      const searchString = 'search';
      const page = 1;
      
      const paginatedResult = {
        data: [{ _id: 'status-id', tinh_trang: { en: 'Studying', vi: 'Đang học' } }],
        meta: { page: 1, limit: 10, totalPages: 1, total: 1 }
      };

      mockRepository.findAll.mockResolvedValue(paginatedResult);

      const result = await service.get(paginationOptions, searchString, page);

      expect(mockRepository.findAll).toHaveBeenCalledWith(paginationOptions, searchString, page);
      expect(result).toEqual(paginatedResult);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.get({}, '', 1)).rejects.toThrow('Repository error');
    });
  });

  describe('update', () => {
    it('should update a student status when valid id and data provided', async () => {
      const id = 'valid-id';
      const updateDto: UpdateStudentStatusDto = {
        tinh_trang: { en: 'Graduated', vi: 'Đã tốt nghiệp' },
      };
      
      const expectedResult = {
        _id: id,
        tinh_trang: { en: 'Graduated', vi: 'Đã tốt nghiệp' },
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateDto);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw StudentStatusNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';
      const updateDto: UpdateStudentStatusDto = { tinh_trang: { en: 'Graduated', vi: 'Đã tốt nghiệp' } };

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.update(id, updateDto)).rejects.toThrow(StudentStatusNotFoundException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw StudentStatusNotFoundException when student status not found', async () => {
      const id = 'valid-id-not-found';
      const updateDto: UpdateStudentStatusDto = { tinh_trang: { en: 'Graduated', vi: 'Đã tốt nghiệp' } };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(StudentStatusNotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a student status when valid id provided', async () => {
      const id = 'valid-id';
      const deletedStatus = {
        _id: id,
        tinh_trang: { en: 'Studying', vi: 'Đang học' },
        deleted_at: new Date()
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(deletedStatus);

      const result = await service.delete(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedStatus);
    });

    it('should throw StudentStatusNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.delete(id)).rejects.toThrow(StudentStatusNotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw StudentStatusNotFoundException when student status not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(StudentStatusNotFoundException);
    });
  });

  describe('getAll', () => {
    it('should call repository getAll', async () => {
      const statuses = [
        { _id: 'status1', tinh_trang: { en: 'Studying', vi: 'Đang học' } },
        { _id: 'status2', tinh_trang: { en: 'Graduated', vi: 'Đã tốt nghiệp' } }
      ];

      mockRepository.getAll.mockResolvedValue(statuses);

      const result = await service.getAll();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(statuses);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.getAll()).rejects.toThrow('Repository error');
    });
  });

  describe('detail', () => {
    it('should return student status details when valid id provided', async () => {
      const id = 'valid-id';
      const status = { _id: id, tinh_trang: { en: 'Studying', vi: 'Đang học' } };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(status);

      const result = await service.detail(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.detail).toHaveBeenCalledWith(id);
      expect(result).toEqual(status);
    });

    it('should throw StudentStatusNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.detail(id)).rejects.toThrow(StudentStatusNotFoundException);
      expect(mockRepository.detail).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when student status not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(null);

      await expect(service.detail(id)).rejects.toThrow(NotFoundException);
    });
  });
});
