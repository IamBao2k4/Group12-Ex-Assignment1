import { Test, TestingModule } from '@nestjs/testing';
import { StudentStatusController } from './controllers/student_status.controller';
import { StudentStatusService } from './services/student_status.service';
import { Logger } from '@nestjs/common';
import { CreateStudentStatusDto, UpdateStudentStatusDto } from './dtos/student_status.dto';
import { StudentStatusNotFoundException } from './exceptions/student_status-not-found.exception';
import { StudentStatus } from './interfaces/student_status.interface';
import { PaginatedResponse } from '../common/paginator/pagination-response.dto';

describe('StudentStatusController', () => {
  let controller: StudentStatusController;
  let service: StudentStatusService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
      detail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentStatusController],
      providers: [
        {
          provide: StudentStatusService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StudentStatusController>(StudentStatusController);
    service = module.get<StudentStatusService>(StudentStatusService);

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
    it('should create a new student status', async () => {
      const createDto: CreateStudentStatusDto = {
        tinh_trang: 'Đang học'
      };

      const expectedResult = {
        _id: 'status-id',
        ...createDto,
      } as StudentStatus;

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createDto)).toBe(expectedResult);
    });

    it('should propagate errors from service', async () => {
      const createDto: CreateStudentStatusDto = {
        tinh_trang: 'Đang học',
      };
      
      const serviceError = new Error('Service error');
      jest.spyOn(service, 'create').mockRejectedValue(serviceError);

      await expect(controller.create(createDto)).rejects.toThrow('Service error');
    });
  });

  describe('get', () => {
    it('should get paginated student statuses', async () => {
      const paginatedResult: PaginatedResponse<StudentStatus> = {
        data: [
          {
            _id: 'status-id',
            tinh_trang: 'Đang học',
          } as StudentStatus,
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      };

      jest.spyOn(service, 'get').mockResolvedValue(paginatedResult);

      const query = {};
      const searchString = 'search';
      const page = 1;

      expect(await controller.get(query, searchString, page)).toBe(paginatedResult);
      expect(service.get).toHaveBeenCalledWith(query, searchString, page);
    });

    it('should propagate errors from service', async () => {
      jest.spyOn(service, 'get').mockRejectedValue(new Error('Service error'));

      await expect(controller.get({}, '', 1)).rejects.toThrow('Service error');
    });
  });

  describe('update', () => {
    it('should update student status', async () => {
      const updateDto: UpdateStudentStatusDto = {
        tinh_trang: 'Tạm dừng'
      };

      const expectedResult = {
        _id: 'status-id',
        tinh_trang: updateDto.tinh_trang,
      } as StudentStatus;

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update('status-id', updateDto)).toBe(expectedResult);
    });

    it('should propagate errors from service', async () => {
      const id = 'status-id';
      const updateDto: UpdateStudentStatusDto = { tinh_trang: 'Đã tốt nghiệp' };

      jest.spyOn(service, 'update').mockRejectedValue(new Error('Service error'));

      await expect(controller.update(id, updateDto)).rejects.toThrow('Service error');
    });
  });

  describe('delete', () => {
    it('should delete student status', async () => {
      const expectedResult = {
        _id: 'status-id',
        tinh_trang: 'Đang học',
      } as StudentStatus;

      jest.spyOn(service, 'delete').mockResolvedValue(expectedResult);

      expect(await controller.delete('status-id')).toBe(expectedResult);
    });

    it('should propagate errors from service', async () => {
      const id = 'status-id';

      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Service error'));

      await expect(controller.delete(id)).rejects.toThrow('Service error');
    });
  });

  describe('getAll', () => {
    it('should get all student statuses', async () => {
      const expectedResult = [
        {
          _id: 'status-id',
          tinh_trang: 'Đang học',
        } as StudentStatus,
      ];

      jest.spyOn(service, 'getAll').mockResolvedValue(expectedResult);

      expect(await controller.getAll()).toBe(expectedResult);
    });

    it('should propagate errors from service', async () => {
      jest.spyOn(service, 'getAll').mockRejectedValue(new Error('Service error'));

      await expect(controller.getAll()).rejects.toThrow('Service error');
    });
  });

  describe('detail', () => {
    it('should get details of a student status', async () => {
      const studentStatus = {
        _id: 'status-id',
        tinh_trang: 'Đang học',
      } as StudentStatus;

      jest.spyOn(service, 'detail').mockResolvedValue(studentStatus);
      
      expect(await controller.detail('status-id')).toBe(studentStatus);
    });

    it('should propagate errors from service', async () => {
      const id = 'status-id';

      jest.spyOn(service, 'detail').mockRejectedValue(new Error('Service error'));

      await expect(controller.detail(id)).rejects.toThrow('Service error');
    });
  });
});
