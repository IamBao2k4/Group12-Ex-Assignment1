import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './services/course.service';
import { CourseRepository } from './repositories/course.repository';
import { Logger, NotFoundException } from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';
import { COURSE_REPOSITORY } from './repositories/course.repository.interface';
import { CourseNotFoundException } from './exceptions/course-not-found.exception';

// Mock cho isValidObjectId từ mongoose
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    isValidObjectId: jest.fn().mockImplementation(() => true),
  };
});

// KHÔNG mock toàn bộ @nestjs/common, chỉ mock các phương thức Logger cụ thể

describe('CourseService', () => {
  let service: CourseService;
  let repository: any;

  // Tạo một valid ObjectId để sử dụng trong test
  const validObjectId = new Types.ObjectId().toString();

  const mockCourseRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    softDelete: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    detail: jest.fn(),
    findByCode: jest.fn(),
  };

  beforeEach(async () => {
    // Reset mocks trước mỗi test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: COURSE_REPOSITORY,
          useValue: mockCourseRepository,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get(COURSE_REPOSITORY);
    
    // Mock các phương thức logger sau khi module đã được compile
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'verbose').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      // Arrange
      const courseDto = { 
        ma_mon_hoc: 'CS101',
        ten: 'Course 1',
        tin_chi: 3,
        khoa: '123'
      };
      const expectedResult = { 
        _id: validObjectId, 
        ma_mon_hoc: 'CS101',
        ten: 'Course 1',
        tin_chi: 3,
        khoa: '123'
      };
      mockCourseRepository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(courseDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockCourseRepository.create).toHaveBeenCalledWith(courseDto);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      // Arrange
      const updateDto = { ten: 'Updated Course' };
      const expectedResult = { 
        _id: validObjectId, 
        ma_mon_hoc: 'CS101',
        ten: 'Updated Course',
        tin_chi: 3,
        khoa: '123'
      };
      mockCourseRepository.update.mockResolvedValue(expectedResult);
      
      // Act
      const result = await service.update(validObjectId, updateDto);

      // Assert
      expect(isValidObjectId).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
      expect(mockCourseRepository.update).toHaveBeenCalledWith(validObjectId, updateDto);
    });

    it('should throw an error if course not found', async () => {
      // Arrange
      const updateDto = { ten: 'Updated Course' };
      mockCourseRepository.update.mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.update(validObjectId, updateDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      // Arrange
      const expectedResult = {
        data: [{ _id: validObjectId, ma_mon_hoc: 'CS101', ten: 'Course 1' }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };
      mockCourseRepository.findAll.mockResolvedValue(expectedResult);
      
      // Act
      const result = await service.get({ page: 1, limit: 10 }, '', 1);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a course', async () => {
      // Arrange
      const expectedResult = { 
        _id: validObjectId, 
        ma_mon_hoc: 'CS101',
        ten: 'Course 1',
        deleted_at: new Date() 
      };
      mockCourseRepository.softDelete.mockResolvedValue(expectedResult);
      
      // Act
      const result = await service.delete(validObjectId);

      // Assert
      expect(isValidObjectId).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if course not found', async () => {
      mockCourseRepository.softDelete.mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.delete(validObjectId)).rejects.toThrow(CourseNotFoundException);
    });
  });

  describe('getAll', () => {
    it('should return all courses', async () => {
      // Arrange
      const expectedResult = [
        { _id: validObjectId, ma_mon_hoc: 'CS101', ten: 'Course 1' }
      ];
      mockCourseRepository.getAll.mockResolvedValue(expectedResult);
      
      // Act
      const result = await service.getAll();

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should return a course by id', async () => {
      // Arrange
      const mockCourse = {
        _id: validObjectId,
        ten: 'Course 1',
        ma_mon_hoc: 'CS101',
        tin_chi: 3,
        khoa: 'CNTT'
      };
      
      // Mock trực tiếp giá trị trả về từ repository
      mockCourseRepository.getById.mockResolvedValue(mockCourse);
      
      // Act
      const result = await service.getById(validObjectId);
      
      // Assert
      expect(isValidObjectId).toHaveBeenCalled();
      expect(mockCourseRepository.getById).toHaveBeenCalledWith(validObjectId);
      
      // Kiểm tra kết quả trả về
      expect(result).toBeDefined();
      // Kiểm tra ít nhất một thuộc tính quan trọng
      expect(result?.ma_mon_hoc).toBe('CS101');
    });

    it('should throw an error if course not found', async () => {
      // Arrange
      jest.spyOn(repository, 'getById').mockResolvedValueOnce(null);
      
      // Act & Assert
      await expect(service.getById(validObjectId)).rejects.toThrow(CourseNotFoundException);
    });
  });
});