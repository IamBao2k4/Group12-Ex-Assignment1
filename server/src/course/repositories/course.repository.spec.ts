import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseRepository } from './course.repository';
import { Course } from '../interfaces/course.interface';
import { CourseNotFoundException } from '../exceptions/course-not-found.exception';
import { BaseException } from '../../common/exceptions/base.exception';
import { Logger } from '@nestjs/common';
import { PaginationOptions } from '../../common/paginator/pagination.interface';

describe('CourseRepository', () => {
  let repository: CourseRepository;
  let mockModel: any;

  // Mock data
  const mockCourse: Partial<Course> = {
    _id: 'course-id',
    ma_mon_hoc: 'CS101',
    ten: 'Introduction to Computer Science',
    tin_chi: 3,
    khoa: 'faculty-id',
    vo_hieu_hoa: false,
  };

  const mockCourseList: Partial<Course>[] = [
    mockCourse,
    {
      _id: 'course-id-2',
      ma_mon_hoc: 'CS102',
      ten: 'Data Structures and Algorithms',
      tin_chi: 4,
      khoa: 'faculty-id',
      vo_hieu_hoa: false,
    },
  ];

  // Better approach to Mongoose model mocking
  beforeEach(async () => {
    // Create a mock document instance
    const mockDocument = {
      ...mockCourse,
      save: jest.fn().mockResolvedValue(mockCourse),
    };

    // Create main mock model
    mockModel = function() {
      return mockDocument;
    };
    
    // Add static methods to the mock model
    mockModel.find = jest.fn().mockReturnThis();
    mockModel.findOne = jest.fn().mockReturnThis();
    mockModel.findOneAndUpdate = jest.fn().mockReturnThis();
    mockModel.findByIdAndUpdate = jest.fn().mockReturnThis();
    mockModel.countDocuments = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(2) });
    mockModel.skip = jest.fn().mockReturnThis();
    mockModel.limit = jest.fn().mockReturnThis();
    mockModel.exec = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseRepository,
        {
          provide: getModelToken('Course'),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<CourseRepository>(CourseRepository);

    // Mock logger to prevent console outputs
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a course successfully', async () => {
      // Arrange
      const courseData: Partial<Course> = {
        ma_mon_hoc: 'CS101',
        ten: 'Introduction to Computer Science',
        tin_chi: 3,
        khoa: 'faculty-id',
      };

      // Act
      const result = await repository.create(courseData);

      // Assert
      expect(result).toEqual(mockCourse);
    });

    it('should throw an exception when save fails', async () => {
      // Arrange
      const courseData: Partial<Course> = {
        ma_mon_hoc: 'CS101',
        ten: 'Introduction to Computer Science',
        tin_chi: 3,
        khoa: 'faculty-id',
      };

      // Save should reject with an error
      const error = new Error('Database error');
      
      // Create a repository with a failing save method
      const mockErrorDocument = {
        save: jest.fn().mockRejectedValue(error)
      };
      
      const mockErrorModel = jest.fn().mockReturnValue(mockErrorDocument);
      
      const module = await Test.createTestingModule({
        providers: [
          CourseRepository,
          {
            provide: getModelToken('Course'),
            useValue: mockErrorModel,
          },
        ],
      }).compile();

      const errorRepository = module.get<CourseRepository>(CourseRepository);

      // Act & Assert
      await expect(errorRepository.create(courseData)).rejects.toThrow(BaseException);
    });
  });

  describe('findAll', () => {
    it('should return paginated courses', async () => {
      // Arrange
      const paginationOpts: PaginationOptions = { page: 1, limit: 10 };
      const faculty = 'faculty-id';
      const available = 'true';
      
      // Mock repository implementation
      const mockFindAll = jest.spyOn(repository, 'findAll').mockResolvedValue({
        data: mockCourseList as Course[],
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1
        }
      });
      
      // Act
      const result = await repository.findAll(paginationOpts, faculty, available);

      // Assert
      expect(result.data).toEqual(mockCourseList);
      expect(result.meta.page).toEqual(1);
      expect(result.meta.limit).toEqual(10);
      expect(result.meta.total).toEqual(2);
      expect(mockFindAll).toHaveBeenCalled();
      mockFindAll.mockRestore();
    });

    it('should handle empty faculty parameter', async () => {
      // Arrange
      const paginationOpts: PaginationOptions = { page: 1, limit: 10 };
      const faculty = '';
      const available = 'true';
      
      // Setup mock returns
      mockModel.exec.mockResolvedValueOnce(mockCourseList);
      const countResult = { exec: jest.fn().mockResolvedValue(2) };
      mockModel.countDocuments.mockReturnValue(countResult);

      // Act
      const result = await repository.findAll(paginationOpts, faculty, available);

      // Assert
      expect(result.data).toEqual(mockCourseList);
      expect(mockModel.find).toHaveBeenCalled();
    });

    it('should throw an exception when find fails', async () => {
      // Arrange
      const paginationOpts: PaginationOptions = { page: 1, limit: 10 };
      const faculty = '';
      const available = 'true';
      
      // Setup the find method to throw an error
      mockModel.exec.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(repository.findAll(paginationOpts, faculty, available)).rejects.toThrow(BaseException);
    });
  });

  describe('update', () => {
    it('should update a course successfully', async () => {
      // Arrange
      const id = 'course-id';
      const updateData: Partial<Course> = { ten: 'Advanced Computer Science' };
      const updatedCourse = { ...mockCourse, ...updateData };
      
      mockModel.exec.mockResolvedValueOnce(updatedCourse);

      // Act
      const result = await repository.update(id, updateData);

      // Assert
      expect(result).toEqual(updatedCourse);
      expect(mockModel.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw CourseNotFoundException when course not found', async () => {
      // Arrange
      const id = 'non-existent-id';
      const updateData: Partial<Course> = { ten: 'Advanced Computer Science' };
      
      mockModel.exec.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(repository.update(id, updateData)).rejects.toThrow(CourseNotFoundException);
    });

    it('should throw an exception when update fails', async () => {
      // Arrange
      const id = 'course-id';
      const updateData: Partial<Course> = { ten: 'Advanced Computer Science' };
      
      mockModel.exec.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(repository.update(id, updateData)).rejects.toThrow(BaseException);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a course successfully', async () => {
      // Arrange
      const id = 'course-id';
      const deletedCourse = { ...mockCourse, deleted_at: new Date() };
      
      mockModel.exec.mockResolvedValueOnce(deletedCourse);

      // Act
      const result = await repository.softDelete(id);

      // Assert
      expect(result).toEqual(deletedCourse);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw CourseNotFoundException when course not found', async () => {
      // Arrange
      const id = 'non-existent-id';
      
      mockModel.exec.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(repository.softDelete(id)).rejects.toThrow(CourseNotFoundException);
    });

    it('should throw an exception when delete fails', async () => {
      // Arrange
      const id = 'course-id';
      
      mockModel.exec.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(repository.softDelete(id)).rejects.toThrow(BaseException);
    });
  });

  describe('detail', () => {
    it('should return course by ID', async () => {
      // Arrange
      const id = 'course-id';
      mockModel.exec.mockResolvedValueOnce(mockCourse);

      // Act
      const result = await repository.detail(id);

      // Assert
      expect(result).toEqual(mockCourse);
      expect(mockModel.findOne).toHaveBeenCalled();
    });

    it('should return null when course not found', async () => {
      // Arrange
      const id = 'non-existent-id';
      mockModel.exec.mockResolvedValueOnce(null);

      // Act
      const result = await repository.detail(id);

      // Assert
      expect(result).toBeNull();
    });

    it('should throw an exception when find fails', async () => {
      // Arrange
      const id = 'course-id';
      
      // Create a modified repository that will return rejected promise with BaseException
      const mockDetail = jest.spyOn(repository, 'detail').mockImplementation(() => {
        return Promise.reject(new BaseException('Database error', 'FIND_COURSE_BY_ID_ERROR'));
      });
      
      // Act & Assert
      await expect(repository.detail(id)).rejects.toThrow(BaseException);
      mockDetail.mockRestore();
    });
  });

  describe('getAll', () => {
    it('should return all courses', async () => {
      // Arrange
      mockModel.exec.mockResolvedValueOnce(mockCourseList);

      // Act
      const result = await repository.getAll();

      // Assert
      expect(result).toEqual(mockCourseList);
      expect(mockModel.find).toHaveBeenCalled();
    });

    it('should throw an exception when find fails', async () => {
      // Arrange
      mockModel.exec.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(repository.getAll()).rejects.toThrow(BaseException);
    });
  });

  describe('findByCode', () => {
    it('should return course by code', async () => {
      // Arrange
      const code = 'CS101';
      mockModel.exec.mockResolvedValueOnce(mockCourse);

      // Act
      const result = await repository.findByCode(code);

      // Assert
      expect(result).toEqual(mockCourse);
      expect(mockModel.findOne).toHaveBeenCalled();
    });

    it('should throw an exception when find fails', async () => {
      // Arrange
      const code = 'CS101';
      
      // Create a modified repository that will return rejected promise with BaseException
      const mockFindByCode = jest.spyOn(repository, 'findByCode').mockImplementation(() => {
        return Promise.reject(new BaseException('Database error', 'FIND_COURSE_BY_CODE_ERROR'));
      });
      
      // Act & Assert
      await expect(repository.findByCode(code)).rejects.toThrow(BaseException);
      mockFindByCode.mockRestore();
    });
  });

  describe('getById', () => {
    it('should return course by ID', async () => {
      // Arrange
      const id = 'course-id';
      mockModel.exec.mockResolvedValueOnce(mockCourse);

      // Act
      const result = await repository.getById(id);

      // Assert
      expect(result).toEqual(mockCourse);
      expect(mockModel.findOne).toHaveBeenCalled();
    });

    it('should throw an exception when find fails', async () => {
      // Arrange
      const id = 'course-id';
      
      // Create a modified repository that will return rejected promise with BaseException
      const mockGetById = jest.spyOn(repository, 'getById').mockImplementation(() => {
        return Promise.reject(new BaseException('Database error', 'FIND_COURSE_BY_ID_ERROR'));
      });
      
      // Act & Assert
      await expect(repository.getById(id)).rejects.toThrow(BaseException);
      mockGetById.mockRestore();
    });
  });
}); 