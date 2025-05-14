import { Test, TestingModule } from '@nestjs/testing';
import { OpenClassController } from './controllers/open_class.controller';
import { OpenClassService } from './services/open_class.service';
import { Logger } from '@nestjs/common';
import { CreateOpenClassDto, UpdateOpenClassDto } from './dtos/open_class.dto';
import { OpenClassNotFoundException } from './exceptions/class-not-found.exception';
import { SearchOptions } from './dtos/search_options.dto';

describe('OpenClassController', () => {
  let controller: OpenClassController;
  let service: OpenClassService;

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
      controllers: [OpenClassController],
      providers: [
        {
          provide: OpenClassService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OpenClassController>(OpenClassController);
    service = module.get<OpenClassService>(OpenClassService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service create with open_class data', async () => {
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

      const expectedResult = {
        _id: 'open_class-id',
        ...createDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from service', async () => {
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

      jest.spyOn(service, 'create').mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createDto)).rejects.toThrow('Service error');
    });
  });

  describe('get', () => {
    it('should call service get with query parameters', async () => {
      const query = { limit: 10, skip: 0 };
      const searchString: SearchOptions = { ma_mon_hoc: 'CS101' };
      const expectedResult = {
        data: [{ _id: 'open_class-id', ma_lop: 'CS101', ma_mon_hoc: 'CS101' }],
        meta: { page: 1, limit: 10, totalPages: 1, total: 1 },
      };

      jest.spyOn(service, 'get').mockResolvedValue(expectedResult as any);

      const result = await controller.get(query, searchString);

      expect(service.get).toHaveBeenCalledWith(query, searchString);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from service', async () => {
      const query = { limit: 10, skip: 0 };
      const searchString: SearchOptions = { ma_mon_hoc: 'CS101' };

      jest.spyOn(service, 'get').mockRejectedValue(new Error('Service error'));

      await expect(controller.get(query, searchString)).rejects.toThrow('Service error');
    });
  });

  describe('update', () => {
    it('should call service update with id and update data', async () => {
      const id = 'open_class-id';
      const updateDto: UpdateOpenClassDto = {
        si_so: 35,
        phong_hoc: 'Room 102',
      };

      const expectedResult = {
        _id: id,
        ma_lop: 'CS101',
        ma_mon_hoc: 'CS101',
        si_so: 35,
        phong_hoc: 'Room 102',
        updated_at: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate OpenClassNotFoundException', async () => {
      const id = 'non-existent-id';
      const updateDto: UpdateOpenClassDto = { si_so: 35 };

      jest.spyOn(service, 'update').mockRejectedValue(new OpenClassNotFoundException(id));

      await expect(controller.update(id, updateDto)).rejects.toThrow(OpenClassNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'open_class-id';
      const updateDto: UpdateOpenClassDto = { phong_hoc: 'Room 103' };

      jest.spyOn(service, 'update').mockRejectedValue(new Error('Service error'));

      await expect(controller.update(id, updateDto)).rejects.toThrow('Service error');
    });
  });

  describe('delete', () => {
    it('should call service delete with id', async () => {
      const id = 'open_class-id';
      const expectedResult = {
        _id: id,
        ma_lop: 'CS101',
        deleted_at: new Date(),
      };

      jest.spyOn(service, 'delete').mockResolvedValue(expectedResult as any);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate OpenClassNotFoundException', async () => {
      const id = 'non-existent-id';

      jest.spyOn(service, 'delete').mockRejectedValue(new OpenClassNotFoundException(id));

      await expect(controller.delete(id)).rejects.toThrow(OpenClassNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'open_class-id';

      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Service error'));

      await expect(controller.delete(id)).rejects.toThrow('Service error');
    });
  });

  describe('getAll', () => {
    it('should call service getAll', async () => {
      const expectedResult = [
        { _id: 'open_class1', ma_lop: 'CS101', si_so: 30 },
        { _id: 'open_class2', ma_lop: 'CS102', si_so: 25 },
      ];

      jest.spyOn(service, 'getAll').mockResolvedValue(expectedResult as any);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from service', async () => {
      jest.spyOn(service, 'getAll').mockRejectedValue(new Error('Service error'));

      await expect(controller.getAll()).rejects.toThrow('Service error');
    });
  });

  describe('getById', () => {
    it('should call service getById with id', async () => {
      const id = 'open_class-id';
      const expectedResult = { _id: id, ma_lop: 'CS101', si_so: 30 };

      jest.spyOn(service, 'getById').mockResolvedValue(expectedResult as any);

      const result = await controller.getById(id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate OpenClassNotFoundException', async () => {
      const id = 'non-existent-id';

      jest.spyOn(service, 'getById').mockRejectedValue(new OpenClassNotFoundException(id));

      await expect(controller.getById(id)).rejects.toThrow(OpenClassNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'open_class-id';

      jest.spyOn(service, 'getById').mockRejectedValue(new Error('Service error'));

      await expect(controller.getById(id)).rejects.toThrow('Service error');
    });
  });
});