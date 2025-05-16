import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from '../../src/student/controllers/student.controller';
import { StudentService } from '../../src/student/services/student.service';
import { HttpException, Logger } from '@nestjs/common';
import { CreateStudentDto, UpdateStudentDto } from '../../src/student/dtos/student.dto';
import { TranscriptService } from '../../src/transcript/services/transcript.service';
import { SearchOptions } from '../../src/transcript/dtos/search_options.dto';

/**
 * Student Controller Unit Tests
 * 
 * This file serves as a template that can be adapted for other domain controllers.
 * It demonstrates proper controller testing with mocked service layer.
 */
describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;
  let transcriptService: TranscriptService;

  beforeEach(async () => {
    // Create a mock service with all the required methods
    const mockStudentService = {
      get: jest.fn(),
      detail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Create a mock TranscriptService with required methods
    const mockTranscriptService = {
      findByStudentId: jest.fn(),
      findByCourseId: jest.fn(),
    };

    // Set up the testing module with our controller and mock dependencies
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
        {
          provide: TranscriptService,
          useValue: mockTranscriptService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
    transcriptService = module.get<TranscriptService>(TranscriptService);

    // Mock logger to avoid console output during tests
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Get Students Tests
   */
  describe('get', () => {
    it('should call service get method with correct parameters', async () => {
      // Arrange
      const paginationOpts = { page: 1, limit: 10 };
      const searchString = 'John';
      const faculty = 'faculty-id';
      
      const expectedResult = {
        data: [{ id: 'student1', ho_ten: 'John Doe' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };
      
      jest.spyOn(service, 'get').mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.get(paginationOpts, searchString, faculty, 1);

      // Assert
      expect(service.get).toHaveBeenCalledWith(paginationOpts, searchString, faculty, 1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors appropriately', async () => {
      // Arrange
      const paginationOpts = { page: 1, limit: 10 };
      
      jest.spyOn(service, 'get').mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.get(paginationOpts, '', '', 1)).rejects.toThrow();
    });
  });

  /**
   * Get Student Transcripts Tests
   */
  describe('getTranscriptsByStudentId', () => {
    it('should call transcriptService findByStudentId with correct parameters', async () => {
      // Arrange
      const studentId = '  student-id  '; // Spaces to test trimming
      const paginationOpts = { page: 1, limit: 10 };
      const searchString: SearchOptions = { nam_hoc: 2023, hoc_ky: 1 };
      
      const expectedResult = {
        data: [{ id: 'transcript1', student_id: 'student-id', course: 'Math 101' }],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };
      
      jest.spyOn(transcriptService, 'findByStudentId').mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.getTranscriptsByStudentId(studentId, paginationOpts, searchString);

      // Assert
      expect(transcriptService.findByStudentId).toHaveBeenCalledWith('student-id', paginationOpts, searchString);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors when getting transcripts', async () => {
      // Arrange
      const studentId = 'student-id';
      const paginationOpts = { page: 1, limit: 10 };
      const searchString: SearchOptions = { nam_hoc: 2023 }; // Only nam_hoc is provided
      
      jest.spyOn(transcriptService, 'findByStudentId').mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.getTranscriptsByStudentId(studentId, paginationOpts, searchString)).rejects.toThrow();
    });
  });

  /**
   * Create Student Tests
   */
  describe('create', () => {
    it('should call service create method with student data', async () => {
      // Arrange
      const studentData = {
        ho_ten: 'New Student',
        ma_so_sinh_vien: 'SV001',
        // ... other required fields
      } as unknown as CreateStudentDto;
      
      const expectedResult = {
        id: 'new-student-id',
        ...studentData,
      };
      
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.create(studentData);

      // Assert
      expect(service.create).toHaveBeenCalledWith(studentData);
      expect(result).toEqual(expectedResult);
    });

    // Additional test cases can be added here
  });

  /**
   * Detail Student Tests
   */
  describe('detail', () => {
    it('should call service detail method with student id', async () => {
      // Arrange
      const studentId = '  student-id  '; // Spaces to test trimming
      const expectedResult = {
        id: 'student-id',
        ho_ten: 'Student Name',
      };
      
      jest.spyOn(service, 'detail').mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.detail(studentId);

      // Assert
      expect(service.detail).toHaveBeenCalledWith('student-id'); // Trimmed
      expect(result).toEqual(expectedResult);
    });

    it('should handle not found errors', async () => {
      // Arrange
      const studentId = 'non-existent-id';
      
      jest.spyOn(service, 'detail').mockRejectedValue(new Error('Student not found'));

      // Act & Assert
      await expect(controller.detail(studentId)).rejects.toThrow();
    });
  });

  /**
   * Update Student Tests
   */
  describe('update', () => {
    it('should call service update method with id and student data', async () => {
      // Arrange
      const studentId = '  student-id  '; // Spaces to test trimming
      const updateData = {
        ho_ten: 'Updated Name',
        giay_to_tuy_than: [] // Empty array to pass validation
      } as unknown as UpdateStudentDto;
      
      const expectedResult = {
        id: 'student-id',
        ho_ten: 'Updated Name',
      };
      
      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.update(studentId, updateData);

      // Assert
      expect(service.update).toHaveBeenCalledWith('student-id', expect.any(Object));
      expect(result).toEqual(expectedResult);
    });

    // Additional test cases can be added here
  });

  /**
   * Delete Student Tests
   */
  describe('delete', () => {
    it('should call service delete method with student id', async () => {
      // Arrange
      const studentId = '  student-id  '; // Spaces to test trimming
      const expectedResult = {
        id: 'student-id',
        deleted_at: new Date(),
      };
      
      jest.spyOn(service, 'delete').mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.delete(studentId);

      // Assert
      expect(service.delete).toHaveBeenCalledWith('student-id'); // Trimmed
      expect(result).toEqual(expectedResult);
    });

    // Additional test cases can be added here
  });

  /**
   * Add additional method tests as needed
   */
}); 