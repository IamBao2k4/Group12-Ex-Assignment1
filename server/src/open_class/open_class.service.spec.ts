import { Test, TestingModule } from '@nestjs/testing';
import { OpenClassService } from './services/open_class.service';
import { OPEN_CLASS_REPOSITORY } from './repositories/open_class.repository.interface';
import { OpenClassNotFoundException } from './exceptions/class-not-found.exception';
import { Logger } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateOpenClassDto, UpdateOpenClassDto } from './dtos/open_class.dto';
import { PaginationOptions } from '../common/paginator/pagination.interface';
import { SearchOptions } from './dtos/search_options.dto';

jest.mock('mongoose', () => ({
  isValidObjectId: jest.fn(),
}));

describe('OpenClassService', () => {
  let service: OpenClassService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      getAll: jest.fn(),
      detail: jest.fn(),
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenClassService,
        {
          provide: OPEN_CLASS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OpenClassService>(OpenClassService);

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
    it('should call repository create with valid data', async () => {
      const createDto: CreateOpenClassDto = {
        ma_lop: 'CS101',
        ma_mon_hoc: 'CS101',
        si_so: 0,
        nam_hoc: 2025,
        hoc_ky: 1,
        giang_vien: 'Dr. John Doe',
        so_luong_toi_da: 50,
        lich_hoc: 'Monday 9:00-11:00',
        phong_hoc: 'Room 101',
      };

      const expectedResult = { _id: 'open_class-id', ...createDto };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const createDto: CreateOpenClassDto = {
        ma_lop: 'CS101',
        ma_mon_hoc: 'CS101',
        si_so: 0,
        nam_hoc: 2025,
        hoc_ky: 1,
        giang_vien: 'Dr. John Doe',
        so_luong_toi_da: 50,
        lich_hoc: 'Monday 9:00-11:00',
        phong_hoc: 'Room 101',
      };

      mockRepository.create.mockRejectedValue(new Error('Repository error'));

      await expect(service.create(createDto)).rejects.toThrow('Repository error');
    });
  });

  describe('get', () => {
    it('should call repository findAll with pagination and search options', async () => {
      const paginationOptions: PaginationOptions = { limit: 10, page: 1 };
      const searchOptions: SearchOptions = { ma_mon_hoc: 'CS101' };
      const expectedResult = {
        data: [{ _id: 'open_class-id', ma_lop: 'CS101' }],
        meta: { page: 1, limit: 10, totalPages: 1, total: 1 },
      };

      mockRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.get(paginationOptions, searchOptions);

      expect(mockRepository.findAll).toHaveBeenCalledWith(paginationOptions, searchOptions);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.get({}, {})).rejects.toThrow('Repository error');
    });
  });

  describe('update', () => {
    it('should update an open class with valid id and data', async () => {
      const id = 'valid-id';
      const updateDto: UpdateOpenClassDto = { si_so: 35, phong_hoc: 'Room 102' };
      const expectedResult = { _id: id, ...updateDto };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateDto);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw OpenClassNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';
      const updateDto: UpdateOpenClassDto = { si_so: 35 };

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.update(id, updateDto)).rejects.toThrow(OpenClassNotFoundException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw OpenClassNotFoundException when open class not found', async () => {
      const id = 'valid-id';
      const updateDto: UpdateOpenClassDto = { si_so: 35 };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(OpenClassNotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete an open class with valid id', async () => {
      const id = 'valid-id';
      const expectedResult = { _id: id, deleted_at: new Date() };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(expectedResult);

      const result = await service.delete(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should throw OpenClassNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.delete(id)).rejects.toThrow(OpenClassNotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw OpenClassNotFoundException when open class not found', async () => {
      const id = 'valid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(OpenClassNotFoundException);
    });
  });

  describe('getAll', () => {
    it('should call repository getAll', async () => {
      const expectedResult = [
        { _id: 'open_class1', ma_lop: 'CS101' },
        { _id: 'open_class2', ma_lop: 'CS102' },
      ];

      mockRepository.getAll.mockResolvedValue(expectedResult);

      const result = await service.getAll();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.getAll()).rejects.toThrow('Repository error');
    });
  });

  describe('detail', () => {
    it('should return open class details for valid id', async () => {
      const id = 'valid-id';
      const expectedResult = { _id: id, ma_lop: 'CS101' };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(expectedResult);

      const result = await service.detail(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.detail).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should throw OpenClassNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.detail(id)).rejects.toThrow(OpenClassNotFoundException);
      expect(mockRepository.detail).not.toHaveBeenCalled();
    });

    it('should throw OpenClassNotFoundException when open class not found', async () => {
      const id = 'valid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.detail.mockResolvedValue(null);

      await expect(service.detail(id)).rejects.toThrow(OpenClassNotFoundException);
    });
  });

  describe('getById', () => {
    it('should call repository getById with valid id', async () => {
      const id = 'valid-id';
      const expectedResult = { _id: id, ma_lop: 'CS101' };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.getById.mockResolvedValue(expectedResult);

      const result = await service.getById(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should throw OpenClassNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.getById(id)).rejects.toThrow(OpenClassNotFoundException);
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