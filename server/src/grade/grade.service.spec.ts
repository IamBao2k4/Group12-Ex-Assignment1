import { Test, TestingModule } from '@nestjs/testing';
import { GradeService } from './services/grade.service';
import { GRADE_REPOSITORY } from './repositories/grade.repository.interface';
import { GradeNotFoundException } from './exceptions/grade-not-found.exception';
import { Logger } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

// Mock isValidObjectId from mongoose
jest.mock('mongoose', () => ({
  isValidObjectId: jest.fn(),
}));

describe('GradeService', () => {
  let service: GradeService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      getAll: jest.fn(),
      findByCode: jest.fn(),
      detail: jest.fn(),
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradeService,
        {
          provide: GRADE_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GradeService>(GradeService);
    
    // Mock logger methods to avoid console outputs during tests
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
    it('should call repository create with grade data', async () => {
      const createDto = {
        ma_diem: 'A',
        diem_so: 4.0,
        diem_chu: 'A',
        muc_dat: 'Excellent',
      } as any;
      
      const expectedResult = {
        _id: 'grade-id',
        ...createDto,
      };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const createDto = {
        ma_diem: 'A',
        diem_so: 4.0,
        diem_chu: 'A',
        muc_dat: 'Excellent',
      } as any;
      
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
        data: [{ _id: 'grade-id', ma_diem: 'A' }],
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
    it('should update a grade when valid id and data provided', async () => {
      const id = 'valid-id';
      const updateDto = {
        diem_so: 3.7,
        diem_chu: 'A-',
      } as any;
      
      const expectedResult = {
        _id: id,
        ma_diem: 'A-',
        ...updateDto,
        muc_dat: 'Very Good',
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateDto);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw GradeNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';
      const updateDto = { diem_so: 3.5 } as any;

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.update(id, updateDto)).rejects.toThrow(GradeNotFoundException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw GradeNotFoundException when grade not found', async () => {
      const id = 'valid-id-not-found';
      const updateDto = { diem_chu: 'B+' } as any;

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(GradeNotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a grade when valid id provided', async () => {
      const id = 'valid-id';
      const deletedGrade = {
        _id: id,
        ma_diem: 'B',
        deleted_at: new Date()
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(deletedGrade);

      const result = await service.delete(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedGrade);
    });

    it('should throw GradeNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.delete(id)).rejects.toThrow(GradeNotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw GradeNotFoundException when grade not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(GradeNotFoundException);
    });
  });

  describe('getAll', () => {
    it('should call repository getAll', async () => {
      const grades = [
        { _id: 'grade1', ma_diem: 'A', diem_so: 4.0 },
        { _id: 'grade2', ma_diem: 'B', diem_so: 3.0 }
      ];

      mockRepository.getAll.mockResolvedValue(grades);

      const result = await service.getAll();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(grades);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.getAll()).rejects.toThrow('Repository error');
    });
  });

  describe('findByCode', () => {
    it('should call repository findByCode with code', async () => {
      const code = 'A';
      const grade = { _id: 'grade-id', ma_diem: code, diem_so: 4.0 };

      mockRepository.findByCode.mockResolvedValue(grade);

      const result = await service.findByCode(code);

      expect(mockRepository.findByCode).toHaveBeenCalledWith(code);
      expect(result).toEqual(grade);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findByCode.mockRejectedValue(new Error('Repository error'));

      await expect(service.findByCode('A')).rejects.toThrow('Repository error');
    });
  });

  describe('detail', () => {
    it('should return grade details when valid id provided', async () => {
      const id = 'valid-id';
      const grade = { _id: id, ma_diem: 'A', diem_so: 4.0 };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(grade);

      const result = await service.detail(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.detail).toHaveBeenCalledWith(id);
      expect(result).toEqual(grade);
    });

    it('should throw GradeNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.detail(id)).rejects.toThrow(GradeNotFoundException);
      expect(mockRepository.detail).not.toHaveBeenCalled();
    });

    it('should throw GradeNotFoundException when grade not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(null);

      await expect(service.detail(id)).rejects.toThrow(GradeNotFoundException);
    });
  });

  describe('getById', () => {
    it('should call repository getById with id', async () => {
      const id = 'valid-id';
      const grade = { _id: id, ma_diem: 'A', diem_so: 4.0 };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.getById.mockResolvedValue(grade);

      const result = await service.getById(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(grade);
    });

    it('should throw GradeNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.getById(id)).rejects.toThrow(GradeNotFoundException);
      expect(mockRepository.getById).not.toHaveBeenCalled();
    });

    it('should propagate errors from repository', async () => {
      const id = 'valid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.getById.mockRejectedValue(new Error('Repository error'));

      await expect(service.getById(id)).rejects.toThrow('Repository error');
    });
  });
});
