import { Test, TestingModule } from '@nestjs/testing';
import { TranscriptService } from './services/transcript.service';
import { TRANSCRIPT_REPOSITORY } from './repositories/transcript.repository.interface';
import { TranscriptNotFoundException } from './exceptions/transcript-not-found.exception';
import { Logger } from '@nestjs/common';
import { CreateTranscriptDto, UpdateTranscriptDto } from './dtos/transcript.dto';
import { isValidObjectId } from 'mongoose';

// Mock isValidObjectId from mongoose
jest.mock('mongoose', () => ({
  isValidObjectId: jest.fn(),
}));

describe('TranscriptService', () => {
  let service: TranscriptService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      findByStudentId: jest.fn(),
      findByCourseId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranscriptService,
        {
          provide: TRANSCRIPT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TranscriptService>(TranscriptService);
    
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
    it('should call repository create with transcript data', async () => {
      const createDto: CreateTranscriptDto = {
        ma_so_sinh_vien: 'SV001',
        ma_mon_hoc: 'MON001',
        diem: 8,
        trang_thai: 'active',
        hoc_ky: '2023-1',
        nam_hoc: "2023"
      };
      
      const expectedResult = {
        _id: 'transcript-id',
        ...createDto,
      };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from repository', async () => {
      const createDto: CreateTranscriptDto = {
        ma_so_sinh_vien: 'SV001',
        ma_mon_hoc: 'MON001',
        diem: 8,
        trang_thai: 'active',
        hoc_ky: '2023-1',
        nam_hoc: "2023"
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
        data: [{ _id: 'transcript-id', ma_so_sinh_vien: 'SV001' }],
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
    it('should update a transcript when valid id and data provided', async () => {
      const id = 'valid-id';
      const updateDto: UpdateTranscriptDto = {
        diem: 9,
        trang_thai: 'active'
      };
      
      const expectedResult = {
        _id: id,
        ma_so_sinh_vien: 'SV001',
        ma_mon_hoc: 'MON001',
        ...updateDto,
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateDto);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw TranscriptNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';
      const updateDto: UpdateTranscriptDto = { diem: 9 };

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.update(id, updateDto)).rejects.toThrow(TranscriptNotFoundException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw TranscriptNotFoundException when transcript not found', async () => {
      const id = 'valid-id-not-found';
      const updateDto: UpdateTranscriptDto = { diem: 9 };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(TranscriptNotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a transcript when valid id provided', async () => {
      const id = 'valid-id';
      const deletedTranscript = {
        _id: id,
        ma_so_sinh_vien: 'SV001',
        ma_mon_hoc: 'MON001',
        deleted_at: new Date()
      };

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(deletedTranscript);

      const result = await service.delete(id);

      expect(isValidObjectId).toHaveBeenCalledWith(id);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedTranscript);
    });

    it('should throw TranscriptNotFoundException for invalid ObjectId format', async () => {
      const id = 'invalid-id';

      (isValidObjectId as jest.Mock).mockReturnValue(false);

      await expect(service.delete(id)).rejects.toThrow(TranscriptNotFoundException);
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });

    it('should throw TranscriptNotFoundException when transcript not found', async () => {
      const id = 'valid-id-not-found';

      (isValidObjectId as jest.Mock).mockReturnValue(true);
      mockRepository.softDelete.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(TranscriptNotFoundException);
    });
  });

  describe('findByStudentId', () => {
    it('should call repository findByStudentId with student id', async () => {
      const studentId = 'SV001';
      const transcripts = [
        { _id: 'transcript1', ma_so_sinh_vien: studentId, ma_mon_hoc: 'MON001' },
        { _id: 'transcript2', ma_so_sinh_vien: studentId, ma_mon_hoc: 'MON002' }
      ];

      mockRepository.findByStudentId.mockResolvedValue(transcripts);

      const result = await service.findByStudentId(studentId, {page: 1, limit: 10},{});

      expect(mockRepository.findByStudentId).toHaveBeenCalledWith(studentId);
      expect(result).toEqual(transcripts);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findByStudentId.mockRejectedValue(new Error('Repository error'));

      await expect(service.findByStudentId('SV001', {page: 1, limit: 10},{})).rejects.toThrow('Repository error');
    });
  });

  describe('findByCourseId', () => {
    it('should call repository findByCourseId with course id', async () => {
      const courseId = 'MON001';
      const transcripts = [
        { _id: 'transcript1', ma_so_sinh_vien: 'SV001', ma_mon_hoc: courseId },
        { _id: 'transcript2', ma_so_sinh_vien: 'SV002', ma_mon_hoc: courseId }
      ];

      mockRepository.findByCourseId.mockResolvedValue(transcripts);

      const result = await service.findByCourseId(courseId);

      expect(mockRepository.findByCourseId).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(transcripts);
    });

    it('should propagate errors from repository', async () => {
      mockRepository.findByCourseId.mockRejectedValue(new Error('Repository error'));

      await expect(service.findByCourseId('MON001')).rejects.toThrow('Repository error');
    });
  });
});
