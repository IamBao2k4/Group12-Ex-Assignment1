import { Test, TestingModule } from '@nestjs/testing';
import { TranscriptController } from './controllers/transcript.controller';
import { TranscriptService } from './services/transcript.service';
import { Logger } from '@nestjs/common';
import { CreateTranscriptDto, UpdateTranscriptDto } from './dtos/transcript.dto';
import { TranscriptNotFoundException } from './exceptions/transcript-not-found.exception';

describe('TranscriptController', () => {
  let controller: TranscriptController;
  let service: TranscriptService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByStudentId: jest.fn(),
      findByCourseId: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranscriptController],
      providers: [
        {
          provide: TranscriptService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TranscriptController>(TranscriptController);
    service = module.get<TranscriptService>(TranscriptService);

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
    it('should call service create with transcript data', async () => {
      const createDto: CreateTranscriptDto = {
        ma_so_sinh_vien: 'SV001',
        ma_mon_hoc: 'MON001',
        diem: 8.5,
        trang_thai: 'active'
      };
      
      const expectedResult = {
        _id: 'transcript-id',
        ...createDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from service', async () => {
      const createDto: CreateTranscriptDto = {
        ma_so_sinh_vien: 'SV001',
        ma_mon_hoc: 'MON001',
        diem: 8.5,
        trang_thai: 'active'
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
        data: [{
          _id: 'transcript-id',
          ma_so_sinh_vien: 'SV001',
          ma_mon_hoc: 'MON001',
          diem: 8.5,
          trang_thai: 'active'
        }],
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

  describe('delete', () => {
    it('should call service delete with trimmed id', async () => {
      const id = '  transcript-id  '; // With spaces to test trimming
      const expectedResult = { 
        _id: 'transcript-id',
        ma_so_sinh_vien: 'SV001',
        ma_mon_hoc: 'MON001',
        diem: 8.5,
        trang_thai: 'inactive',
        deleted_at: new Date()
      };

      jest.spyOn(service, 'delete').mockResolvedValue(expectedResult as any);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith('transcript-id'); // Trimmed
      expect(result).toEqual(expectedResult);
    });

    it('should propagate TranscriptNotFoundException', async () => {
      const id = 'non-existent-id';
      const notFoundError = new TranscriptNotFoundException(id);

      jest.spyOn(service, 'delete').mockRejectedValue(notFoundError);

      await expect(controller.delete(id)).rejects.toThrow(TranscriptNotFoundException);
    });

    it('should propagate other errors from service', async () => {
      const id = 'transcript-id';

      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Service error'));

      await expect(controller.delete(id)).rejects.toThrow('Service error');
    });
  });
});
