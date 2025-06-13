import { Test, TestingModule } from '@nestjs/testing';
import { ProgramService } from './services/program.service';
import { PROGRAM_REPOSITORY } from './repositories/program.repository.interface';
import { ProgramNotFoundException } from './exceptions/program-not-found.exception';
import { Logger, NotFoundException } from '@nestjs/common';
import { CreateProgramDto, UpdateProgramDto } from './dtos/program.dto';

// Mock isValidObjectId từ utility
jest.mock('../common/utils/validation.util', () => ({
  isValidObjectId: jest.fn(),
}));

import { isValidObjectId } from '../common/utils/validation.util';

describe('ProgramService', () => {
  let service: ProgramService;
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
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramService,
        {
          provide: PROGRAM_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProgramService>(ProgramService);
    
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
    it('should call repository create with program data', async () => {
      const createDto: CreateProgramDto = {
        name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' },
        ma: 'CS',
      };
      
      const expectedResult = {
        _id: 'program-id',
        ...createDto,
      };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const createDto: CreateProgramDto = {
        name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' },
        ma: 'CS',
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
        data: [{ _id: 'program-id', name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' }, ma: 'CS' }],
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
    it('should update a program when valid id and data provided', async () => {
      const id = 'valid-id';
      const updateDto: UpdateProgramDto = {
        name: { en: 'Updated Program Name', vi: 'Tên Chương Trình Đã Cập Nhật' },
      };
      
      const expectedResult = {
        _id: id,
        name: { en: 'Updated Program Name', vi: 'Tên Chương Trình Đã Cập Nhật' },
        ma: 'CS',
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateDto);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw ProgramNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';
      const updateDto: UpdateProgramDto = { name: { en: 'New Name', vi: 'Tên Mới' } };

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.update(id, updateDto)).rejects.toThrow(ProgramNotFoundException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ProgramNotFoundException when program not found', async () => {
      const id = 'valid-id-not-found';
      const updateDto: UpdateProgramDto = { name: { en: 'New Name', vi: 'Tên Mới' } };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(ProgramNotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a program when valid id provided', async () => {
      const id = 'valid-id';
      const deletedProgram = {
        _id: id,
        name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' },
        ma: 'CS',
        deleted_at: new Date()
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(deletedProgram);

      const result = await service.delete(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedProgram);
    });

    it('should throw ProgramNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.delete(id)).rejects.toThrow(ProgramNotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw ProgramNotFoundException when program not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(ProgramNotFoundException);
    });
  });

  describe('getAll', () => {
    it('should call repository getAll', async () => {
      const programs = [
        { _id: 'program1', name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' }, ma: 'CS' },
        { _id: 'program2', name: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' }, ma: 'IT' }
      ];

      mockRepository.getAll.mockResolvedValue(programs);

      const result = await service.getAll();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(programs);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.getAll()).rejects.toThrow('Repository error');
    });
  });

  describe('findByCode', () => {
    it('should call repository findByCode with code', async () => {
      const code = 'CS';
      const program = { _id: 'program-id', name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' }, ma: code };

      mockRepository.findByCode.mockResolvedValue(program);

      const result = await service.findByCode(code);

      expect(mockRepository.findByCode).toHaveBeenCalledWith(code);
      expect(result).toEqual(program);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findByCode.mockRejectedValue(new Error('Repository error'));

      await expect(service.findByCode('CS')).rejects.toThrow('Repository error');
    });
  });

  describe('detail', () => {
    it('should return program details when valid id provided', async () => {
      const id = 'valid-id';
      const program = { _id: id, name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' }, ma: 'CS' };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(program);

      const result = await service.detail(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.detail).toHaveBeenCalledWith(id);
      expect(result).toEqual(program);
    });

    it('should throw ProgramNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.detail(id)).rejects.toThrow(ProgramNotFoundException);
      expect(mockRepository.detail).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when program not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(null);

      await expect(service.detail(id)).rejects.toThrow(NotFoundException);
    });
  });
});
