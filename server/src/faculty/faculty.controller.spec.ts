import { Test, TestingModule } from '@nestjs/testing';
import { FacultyController } from './controllers/faculty.controller';
import { FacultyService } from './services/faculty.service';
import { Logger } from '@nestjs/common';
import { CreateFacultyDto, UpdateFacultyDto } from './dtos/faculty.dto';
import { FacultyNotFoundException } from './exceptions/faculty-not-found.exception';

describe('FacultyController', () => {
  let controller: FacultyController;
  let service: FacultyService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacultyController],
      providers: [
        {
          provide: FacultyService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FacultyController>(FacultyController);
    service = module.get<FacultyService>(FacultyService);

    // Mock logger để tránh output console trong quá trình test
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service create with faculty data', async () => {
      const createDto: CreateFacultyDto = {
        ma_khoa: 'IT',
        ten_khoa: 'Information Technology',
      };
      
      const expectedResult = {
        _id: 'faculty-id',
        ...createDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from service', async () => {
      const createDto: CreateFacultyDto = {
        ma_khoa: 'IT',
        ten_khoa: 'Information Technology',
      };
      
      const serviceError = new Error('Service error');
      jest.spyOn(service, 'create').mockRejectedValue(serviceError);

      await expect(controller.create(createDto)).rejects.toThrow('Service error');
    });
  });

  describe('get', () => {
    it('should call service get with query parameters', async () => {
      const query = { limit: 10, skip: 0 };
      const searchString = 'search';
      const page = 1;
      
      const paginatedResult = {
        data: [{ _id: 'faculty-id', ma_khoa: 'IT', ten_khoa: 'Information Technology' }],
        meta: { page: 1, limit: 10, totalPages: 1, total: 1 }
      };

      jest.spyOn(service, 'get').mockResolvedValue(paginatedResult);

      const result = await controller.get(query, searchString, page);

      expect(service.get).toHaveBeenCalledWith(query, searchString, page);
      expect(result).toEqual(paginatedResult);
    });

    it('should propagate errors from service', async () => {
      const query = { limit: 10, skip: 0 };
      
      jest.spyOn(service, 'get').mockRejectedValue(new Error('Service error'));

      await expect(controller.get(query, '', 1)).rejects.toThrow('Service error');
    });
  });

  describe('update', () => {
    it('should call service update with id and update data', async () => {
      const id = 'faculty-id';
      const updateDto: UpdateFacultyDto = {
        ten_khoa: 'Updated Faculty Name',
      };
      
      const expectedResult = {
        _id: id,
        ma_khoa: 'IT',
        ten_khoa: 'Updated Faculty Name',
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate FacultyNotFoundException', async () => {
      const id = 'non-existent-id';
      const updateDto: UpdateFacultyDto = { ten_khoa: 'New Name' };
      const notFoundError = new FacultyNotFoundException(id);

      jest.spyOn(service, 'update').mockRejectedValue(notFoundError);

      await expect(controller.update(id, updateDto)).rejects.toThrow(FacultyNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'faculty-id';
      const updateDto: UpdateFacultyDto = { ten_khoa: 'New Name' };

      jest.spyOn(service, 'update').mockRejectedValue(new Error('Service error'));

      await expect(controller.update(id, updateDto)).rejects.toThrow('Service error');
    });
  });

  describe('delete', () => {
    it('should call service delete with id', async () => {
      const id = 'faculty-id';
      const deletedFaculty = {
        _id: id,
        ma_khoa: 'IT',
        ten_khoa: 'Information Technology',
        deleted_at: new Date(),
      };

      jest.spyOn(service, 'delete').mockResolvedValue(deletedFaculty);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedFaculty);
    });

    it('should propagate FacultyNotFoundException', async () => {
      const id = 'non-existent-id';
      const notFoundError = new FacultyNotFoundException(id);

      jest.spyOn(service, 'delete').mockRejectedValue(notFoundError);

      await expect(controller.delete(id)).rejects.toThrow(FacultyNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'faculty-id';

      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Service error'));

      await expect(controller.delete(id)).rejects.toThrow('Service error');
    });
  });

  describe('getAll', () => {
    it('should call service getAll', async () => {
      const faculties = [
        { _id: 'faculty1', ma_khoa: 'IT', ten_khoa: 'Information Technology' },
        { _id: 'faculty2', ma_khoa: 'CS', ten_khoa: 'Computer Science' }
      ];

      jest.spyOn(service, 'getAll').mockResolvedValue(faculties);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(faculties);
    });

    it('should propagate errors from service', async () => {
      jest.spyOn(service, 'getAll').mockRejectedValue(new Error('Service error'));

      await expect(controller.getAll()).rejects.toThrow('Service error');
    });
  });

  describe('getById', () => {
    it('should call service getById with id', async () => {
      const id = 'faculty-id';
      const faculty = { _id: id, ma_khoa: 'IT', ten_khoa: 'Information Technology' };

      jest.spyOn(service, 'getById').mockResolvedValue(faculty);

      const result = await controller.getById(id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(faculty);
    });

    it('should propagate FacultyNotFoundException', async () => {
      const id = 'non-existent-id';
      const notFoundError = new FacultyNotFoundException(id);

      jest.spyOn(service, 'getById').mockRejectedValue(notFoundError);

      await expect(controller.getById(id)).rejects.toThrow(FacultyNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'faculty-id';

      jest.spyOn(service, 'getById').mockRejectedValue(new Error('Service error'));

      await expect(controller.getById(id)).rejects.toThrow('Service error');
    });
  });
});
