import { Test, TestingModule } from '@nestjs/testing';
import { GradeController } from './controllers/grade.controller';
import { GradeService } from './services/grade.service';
import { Logger } from '@nestjs/common';
import { CreateGradeDto, UpdateGradeDto } from './dtos/grade.dto';
import { GradeNotFoundException } from './exceptions/grade-not-found.exception';

describe('GradeController', () => {
  let controller: GradeController;
  let service: GradeService;

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
      controllers: [GradeController],
      providers: [
        {
          provide: GradeService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<GradeController>(GradeController);
    service = module.get<GradeService>(GradeService);

    // Mock logger to avoid console outputs during tests
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
    it('should call service create with grade data', async () => {
      const createDto = {
        ma_diem: 'A',
        diem_so: 4.0,
        diem_chu: 'A',
        muc_dat: 'Excellent',
      } as unknown as CreateGradeDto;
      
      const expectedResult = {
        _id: 'grade-id',
        ...createDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from service', async () => {
      const createDto = {
        ma_diem: 'A',
        diem_so: 4.0,
        diem_chu: 'A',
        muc_dat: 'Excellent',
      } as unknown as CreateGradeDto;
      
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
        data: [{ _id: 'grade-id', ma_diem: 'A' }],
        meta: { page: 1, limit: 10, totalPages: 1, total: 1 }
      };

      jest.spyOn(service, 'get').mockResolvedValue(paginatedResult as any);

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
      const id = 'grade-id';
      const updateDto = {
        diem_so: 3.7,
        diem_chu: 'A-',
      } as unknown as UpdateGradeDto;
      
      const expectedResult = {
        _id: id,
        ma_diem: 'A-',
        ...updateDto,
        muc_dat: 'Very Good',
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate GradeNotFoundException', async () => {
      const id = 'non-existent-id';
      const updateDto = { diem_so: 3.5 } as unknown as UpdateGradeDto;
      const notFoundError = new GradeNotFoundException(id);

      jest.spyOn(service, 'update').mockRejectedValue(notFoundError);

      await expect(controller.update(id, updateDto)).rejects.toThrow(GradeNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'grade-id';
      const updateDto = { diem_chu: 'B+' } as unknown as UpdateGradeDto;

      jest.spyOn(service, 'update').mockRejectedValue(new Error('Service error'));

      await expect(controller.update(id, updateDto)).rejects.toThrow('Service error');
    });
  });

  describe('delete', () => {
    it('should call service delete with id', async () => {
      const id = 'grade-id';
      const deletedGrade = {
        _id: id,
        ma_diem: 'A',
        deleted_at: new Date(),
      };

      jest.spyOn(service, 'delete').mockResolvedValue(deletedGrade as any);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedGrade);
    });

    it('should propagate GradeNotFoundException', async () => {
      const id = 'non-existent-id';
      const notFoundError = new GradeNotFoundException(id);

      jest.spyOn(service, 'delete').mockRejectedValue(notFoundError);

      await expect(controller.delete(id)).rejects.toThrow(GradeNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'grade-id';

      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Service error'));

      await expect(controller.delete(id)).rejects.toThrow('Service error');
    });
  });

  describe('getAll', () => {
    it('should call service getAll', async () => {
      const grades = [
        { _id: 'grade1', ma_diem: 'A', diem_so: 4.0 },
        { _id: 'grade2', ma_diem: 'B', diem_so: 3.0 }
      ];

      jest.spyOn(service, 'getAll').mockResolvedValue(grades as any);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(grades);
    });

    it('should propagate errors from service', async () => {
      jest.spyOn(service, 'getAll').mockRejectedValue(new Error('Service error'));

      await expect(controller.getAll()).rejects.toThrow('Service error');
    });
  });

  describe('getById', () => {
    it('should call service getById with id', async () => {
      const id = 'grade-id';
      const grade = { _id: id, ma_diem: 'A', diem_so: 4.0 };

      jest.spyOn(service, 'getById').mockResolvedValue(grade as any);

      const result = await controller.getById(id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(grade);
    });

    it('should propagate GradeNotFoundException', async () => {
      const id = 'non-existent-id';
      const notFoundError = new GradeNotFoundException(id);

      jest.spyOn(service, 'getById').mockRejectedValue(notFoundError);

      await expect(controller.getById(id)).rejects.toThrow(GradeNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'grade-id';

      jest.spyOn(service, 'getById').mockRejectedValue(new Error('Service error'));

      await expect(controller.getById(id)).rejects.toThrow('Service error');
    });
  });
});
