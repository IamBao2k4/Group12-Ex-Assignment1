import { Test, TestingModule } from '@nestjs/testing';
import { ProgramController } from './controllers/program.controller';
import { ProgramService } from './services/program.service';
import { Logger } from '@nestjs/common';
import { CreateProgramDto, UpdateProgramDto } from './dtos/program.dto';
import { ProgramNotFoundException } from './exceptions/program-not-found.exception';

describe('ProgramController', () => {
  let controller: ProgramController;
  let service: ProgramService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramController],
      providers: [
        {
          provide: ProgramService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProgramController>(ProgramController);
    service = module.get<ProgramService>(ProgramService);

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
    it('should call service create with program data', async () => {
      const createDto: CreateProgramDto = {
        name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' },
        ma: 'CS',
      };
      
      const expectedResult = {
        _id: 'program-id',
        ...createDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from service', async () => {
      const createDto: CreateProgramDto = {
        name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' },
        ma: 'CS',
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
        data: [{ _id: 'program-id', name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' }, ma: 'CS' }],
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
      const id = 'program-id';
      const updateDto: UpdateProgramDto = {
        name: { en: 'Updated Program Name', vi: 'Tên Chương Trình Đã Cập Nhật' },
      };
      
      const expectedResult = {
        _id: id,
        name: { en: 'Updated Program Name', vi: 'Tên Chương Trình Đã Cập Nhật' },
        ma: 'CS',
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate ProgramNotFoundException', async () => {
      const id = 'non-existent-id';
      const updateDto: UpdateProgramDto = { name: { en: 'New Name', vi: 'Tên Mới' } };
      const notFoundError = new ProgramNotFoundException(id);

      jest.spyOn(service, 'update').mockRejectedValue(notFoundError);

      await expect(controller.update(id, updateDto)).rejects.toThrow(ProgramNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'program-id';
      const updateDto: UpdateProgramDto = { name: { en: 'New Name', vi: 'Tên Mới' } };

      jest.spyOn(service, 'update').mockRejectedValue(new Error('Service error'));

      await expect(controller.update(id, updateDto)).rejects.toThrow('Service error');
    });
  });

  describe('delete', () => {
    it('should call service delete with id', async () => {
      const id = 'program-id';
      const deletedProgram = {
        _id: id,
        name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' },
        ma: 'CS',
        deleted_at: new Date(),
      };

      jest.spyOn(service, 'delete').mockResolvedValue(deletedProgram as any);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedProgram);
    });

    it('should propagate ProgramNotFoundException', async () => {
      const id = 'non-existent-id';
      const notFoundError = new ProgramNotFoundException(id);

      jest.spyOn(service, 'delete').mockRejectedValue(notFoundError);

      await expect(controller.delete(id)).rejects.toThrow(ProgramNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'program-id';

      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Service error'));

      await expect(controller.delete(id)).rejects.toThrow('Service error');
    });
  });

  describe('getAll', () => {
    it('should call service getAll', async () => {
      const programs = [
        { _id: 'program1', name: { en: 'Computer Science', vi: 'Khoa Học Máy Tính' }, ma: 'CS' },
        { _id: 'program2', name: { en: 'Information Technology', vi: 'Công Nghệ Thông Tin' }, ma: 'IT' }
      ];

      jest.spyOn(service, 'getAll').mockResolvedValue(programs as any);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(programs);
    });

    it('should propagate errors from service', async () => {
      jest.spyOn(service, 'getAll').mockRejectedValue(new Error('Service error'));

      await expect(controller.getAll()).rejects.toThrow('Service error');
    });
  });
});
