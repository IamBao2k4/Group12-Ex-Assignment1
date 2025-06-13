import { Test, TestingModule } from '@nestjs/testing';
import { FacultyService } from './services/faculty.service';
import { FACULTY_REPOSITORY } from './repositories/faculty.repository.interface';
import { FacultyNotFoundException } from './exceptions/faculty-not-found.exception';
import { Logger, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateFacultyDto, UpdateFacultyDto } from './dtos/faculty.dto';

// Mock isValidObjectId từ mongoose
jest.mock('mongoose', () => ({
  isValidObjectId: jest.fn(),
}));

describe('FacultyService', () => {
  let service: FacultyService;
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
        FacultyService,
        {
          provide: FACULTY_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FacultyService>(FacultyService);
    
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
    it('should call repository create with faculty data', async () => {
      const createDto: CreateFacultyDto = {
        ma_khoa: 'IT',
        ten_khoa: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' },
      };
      
      const expectedResult = {
        _id: 'faculty-id',
        ...createDto,
      };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const createDto: CreateFacultyDto = {
        ma_khoa: 'IT',
        ten_khoa: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' },
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
        data: [{ _id: 'faculty-id', ma_khoa: 'IT', ten_khoa: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' } }],
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
    it('should update a faculty when valid id and data provided', async () => {
      const id = 'valid-id';
      const updateDto: UpdateFacultyDto = {
        ten_khoa: { en: 'Updated Faculty Name', vi: 'Tên Khoa Đã Cập Nhật' },
      };
      
      const expectedResult = {
        _id: id,
        ma_khoa: 'IT',
        ten_khoa: { en: 'Updated Faculty Name', vi: 'Tên Khoa Đã Cập Nhật' },
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateDto);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw FacultyNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';
      const updateDto: UpdateFacultyDto = { ten_khoa: { en: 'New Name', vi: 'Tên Mới' } };

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.update(id, updateDto)).rejects.toThrow(FacultyNotFoundException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw FacultyNotFoundException when faculty not found', async () => {
      const id = 'valid-id-not-found';
      const updateDto: UpdateFacultyDto = { ten_khoa: { en: 'New Name', vi: 'Tên Mới' } };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(FacultyNotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a faculty when valid id provided', async () => {
      const id = 'valid-id';
      const deletedFaculty = {
        _id: id,
        ma_khoa: 'IT',
        ten_khoa: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' },
        deleted_at: new Date()
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(deletedFaculty);

      const result = await service.delete(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedFaculty);
    });

    it('should throw FacultyNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.delete(id)).rejects.toThrow(FacultyNotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw FacultyNotFoundException when faculty not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(FacultyNotFoundException);
    });
  });

  describe('getAll', () => {
    it('should call repository getAll', async () => {
      const faculties = [
        { _id: 'faculty1', ma_khoa: 'IT', ten_khoa: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' } },
        { _id: 'faculty2', ma_khoa: 'CS', ten_khoa: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' } }
      ];

      mockRepository.getAll.mockResolvedValue(faculties);

      const result = await service.getAll();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(faculties);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.getAll()).rejects.toThrow('Repository error');
    });
  });

  describe('findByCode', () => {
    it('should call repository findByCode with code', async () => {
      const code = 'IT';
      const faculty = { _id: 'faculty-id', ma_khoa: code, ten_khoa: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' } };

      mockRepository.findByCode.mockResolvedValue(faculty);

      const result = await service.findByCode(code);

      expect(mockRepository.findByCode).toHaveBeenCalledWith(code);
      expect(result).toEqual(faculty);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findByCode.mockRejectedValue(new Error('Repository error'));

      await expect(service.findByCode('IT')).rejects.toThrow('Repository error');
    });
  });

  describe('detail', () => {
    it('should return faculty details when valid id provided', async () => {
      const id = 'valid-id';
      const faculty = { _id: id, ma_khoa: 'IT', ten_khoa: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' } };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(faculty);

      const result = await service.detail(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.detail).toHaveBeenCalledWith(id);
      expect(result).toEqual(faculty);
    });

    it('should throw FacultyNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.detail(id)).rejects.toThrow(FacultyNotFoundException);
      expect(mockRepository.detail).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when faculty not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(null);

      await expect(service.detail(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getById', () => {
    it('should call repository getById with id', async () => {
      const id = 'valid-id';
      const faculty = { _id: id, ma_khoa: 'IT', ten_khoa: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' } };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.getById.mockResolvedValue(faculty);

      const result = await service.getById(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(faculty);
    });

    it('should throw FacultyNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.getById(id)).rejects.toThrow(FacultyNotFoundException);
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
