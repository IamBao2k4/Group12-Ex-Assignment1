import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { STUDENT_REPOSITORY } from './repositories/student.repository.interface';
import { CreateStudentDto } from './dtos/student.dto';
import { FacultyService } from '../faculty/services/faculty.service';
import { ProgramService } from '../program/services/program.service';
import { StudentStatusService } from '../student_status/services/student_status.service';

// Mock isValidObjectId 
jest.mock('../common/utils/validation.util', () => ({
  isValidObjectId: jest.fn().mockReturnValue(true),
}));

import { isValidObjectId } from '../common/utils/validation.util';

/**
 * Student Service Unit Tests
 * 
 * This file serves as a template that can be adapted for other domain services.
 * It demonstrates proper dependency injection and mocking.
 */
describe('StudentService', () => {
  let service: StudentService;
  let mockRepository: any;
  let mockFacultyService: any;
  let mockProgramService: any;
  let mockStudentStatusService: any;

  beforeEach(async () => {
    // Reset mock isValidObjectId
    (isValidObjectId as jest.Mock).mockClear();
    (isValidObjectId as jest.Mock).mockReturnValue(true);

    // Mock các repository và service
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      findByMSSV: jest.fn().mockResolvedValue(null),
      findByEmailOrPhone: jest.fn().mockResolvedValue(null),
    };

    mockFacultyService = {
      detail: jest.fn().mockResolvedValue({ _id: 'faculty-id', name: 'Faculty' }),
    };

    mockProgramService = {
      detail: jest.fn().mockResolvedValue({ _id: 'program-id', name: 'Program' }),
    };

    mockStudentStatusService = {
      detail: jest.fn().mockResolvedValue({ _id: 'status-id', tinh_trang: 'Active' }),
    };

    // Set up the testing module với tất cả các dependency
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: STUDENT_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: FacultyService,
          useValue: mockFacultyService,
        },
        {
          provide: ProgramService,
          useValue: mockProgramService,
        },
        {
          provide: StudentStatusService,
          useValue: mockStudentStatusService,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    
    // Mock logger
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Get Students Tests
   */
  describe('get', () => {
    it('should call repository findAll with correct parameters', async () => {
      // Arrange
      const paginationOpts = { page: 1, limit: 10 };
      const searchString = 'John';
      const faculty = 'faculty-id';
      
      const expectedResult = {
        data: [{ id: 'student1', ho_ten: 'John Doe' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };
      
      mockRepository.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await service.get(paginationOpts, searchString, faculty, 1);

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledWith(
        paginationOpts,
        searchString,
        faculty,
        1
      );
      expect(result).toEqual(expectedResult);
    });

    // Additional test cases can be added here
  });

  /**
   * Create Student Tests
   */
  describe('create', () => {
    it('should call repository create with student data', async () => {
      // Arrange
      const studentData = {
        ho_ten: 'New Student',
        ma_so_sinh_vien: 'SV001',
        email: 'student@example.com',
        so_dien_thoai: '123456789',
        khoa: 'faculty-id',
        chuong_trinh: 'program-id',
        tinh_trang: 'status-id',
        ngay_sinh: new Date(),
        gioi_tinh: 'Nam',
        dia_chi: 'Address',
        giay_to_tuy_than: '123456789'
      } as unknown as CreateStudentDto;
      
      const expectedResult = {
        _id: 'new-student-id',
        ...studentData,
      };
      
      mockRepository.create.mockResolvedValue(expectedResult);
      mockRepository.findByMSSV.mockResolvedValue(null);
      mockRepository.findByEmailOrPhone.mockResolvedValue(null);

      // Act
      const result = await service.create(studentData);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(studentData);
      expect(result).toEqual(expectedResult);
    });

    // Additional test cases can be added here
  });

  /**
   * Detail Student Tests
   */
  describe('detail', () => {
    it('should call repository findById with student id', async () => {
      // Arrange
      const studentId = '507f1f77bcf86cd799439011';
      const expectedResult = {
        _id: studentId,
        ho_ten: 'Student Name',
      };
      
      mockRepository.findById.mockResolvedValue(expectedResult);

      // Act
      const result = await service.detail(studentId);

      // Assert
      expect(isValidObjectId).toHaveBeenCalledWith(studentId);
      expect(mockRepository.findById).toHaveBeenCalledWith(studentId);
      expect(result).toEqual(expectedResult);
    });

    // Additional test cases for error handling can be added here
  });

  /**
   * Update Student Tests
   */
  describe('update', () => {
    it('should call repository update with id and student data', async () => {
      // Arrange
      const studentId = '507f1f77bcf86cd799439011';
      const updateData = {
        ho_ten: 'Updated Name',
        giay_to_tuy_than: [{ loai: 'CMND', so: '123456789' }]
      } as any;
      
      const currentStudent = {
        _id: studentId,
        ho_ten: 'Old Name',
        ma_so_sinh_vien: 'SV001',
        tinh_trang: 'status-id'
      };
      
      const expectedResult = {
        _id: studentId,
        ho_ten: 'Updated Name',
        ma_so_sinh_vien: 'SV001',
        tinh_trang: 'status-id'
      };
      
      mockRepository.findById.mockResolvedValue(currentStudent);
      mockRepository.update.mockResolvedValue(expectedResult);

      // Act
      const result = await service.update(studentId, updateData);

      // Assert
      expect(isValidObjectId).toHaveBeenCalledWith(studentId);
      expect(mockRepository.findById).toHaveBeenCalledWith(studentId);
      expect(mockRepository.update).toHaveBeenCalledWith(studentId, updateData);
      expect(result).toEqual(expectedResult);
    });

    // Additional test cases can be added here
  });

  /**
   * Delete Student Tests
   */
  describe('delete', () => {
    it('should call repository softDelete with student id', async () => {
      // Arrange
      const studentId = '507f1f77bcf86cd799439011';
      const expectedResult = {
        _id: studentId,
        deleted_at: expect.any(Date),
      };
      
      mockRepository.softDelete.mockResolvedValue(expectedResult);

      // Act
      const result = await service.delete(studentId);

      // Assert
      expect(isValidObjectId).toHaveBeenCalledWith(studentId);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(studentId);
      expect(result).toEqual(expectedResult);
    });

    // Additional test cases can be added here
  });

  /**
   * Add additional method tests as needed
   */
}); 