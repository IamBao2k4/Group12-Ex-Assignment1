import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentRepository } from './repositories/student.repository';
import { Student } from './interfaces/student.interface';
import { Logger } from '@nestjs/common';

/**
 * Student Repository Unit Tests
 * 
 * This file serves as a template that can be adapted for other domain repositories.
 * It demonstrates proper repository testing with mocked database layer.
 */
describe('StudentRepository', () => {
  let repository: StudentRepository;
  let studentModel: any;
  
  const mockStudent = {
    _id: 'student-id',
    ma_so_sinh_vien: 'SV001',
    ho_ten: 'Student Name',
    ngay_sinh: '2000-01-01',
    gioi_tinh: 'Nam',
    khoa: 'faculty-id',
    khoa_hoc: '2020-2024',
    chuong_trinh: 'program-id',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    // Tạo một mock đúng cách cho studentModel với constructor
    const mockStudentModel = function() {
      this.save = jest.fn().mockResolvedValue(mockStudent);
      return this;
    };
    
    // Thêm các phương thức tĩnh của model mongoose
    mockStudentModel.find = jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockStudent])
    });
    
    mockStudentModel.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockStudent)
    });
    
    mockStudentModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockStudent)
    });
    
    mockStudentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockStudent)
    });
    
    mockStudentModel.findOneAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockStudent)
    });
    
    mockStudentModel.countDocuments = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(15)
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentRepository,
        {
          provide: getModelToken('Student'),
          useValue: mockStudentModel,
        },
        Logger,
      ],
    }).compile();

    repository = module.get<StudentRepository>(StudentRepository);
    studentModel = module.get<Model<Student>>(getModelToken('Student'));
    
    // Mock logger
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  /**
   * Create Student Tests
   */
  describe('create', () => {
    it('should create a new student', async () => {
      // Arrange
      const studentData = {
        ma_so_sinh_vien: 'SV001',
        ho_ten: 'Student Name',
        ngay_sinh: '2000-01-01',
        gioi_tinh: 'Nam'
      };
      
      // Act
      const result = await repository.create(studentData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(mockStudent);
    });
  });

  /**
   * FindById Tests
   */
  describe('findById', () => {
    it('should find a student by id', async () => {
      // Act
      const result = await repository.findById('student-id');
      
      // Assert
      expect(studentModel.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockStudent);
    });
  });

  /**
   * FindAll Tests
   */
  describe('findAll', () => {
    it('should return paginated results', async () => {
      // Arrange
      const paginationOpts = { page: 2, limit: 10 };
      const searchString = 'John';
      const faculty = 'faculty-id';
      
      // Act
      const result = await repository.findAll(paginationOpts, searchString, faculty, 2);
      
      // Assert
      expect(studentModel.find).toHaveBeenCalled();
      expect(result.data).toEqual([mockStudent]);
      expect(result.meta).toBeDefined();
    });
  });

  /**
   * Update Tests
   */
  describe('update', () => {
    it('should update a student', async () => {
      // Arrange
      const studentId = 'student-id';
      const updateData = {
        ho_ten: 'Updated Name',
      };
      
      // Act
      const result = await repository.update(studentId, updateData);
      
      // Assert
      expect(studentModel.findOneAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(mockStudent);
    });
  });

  /**
   * SoftDelete Tests
   */
  describe('softDelete', () => {
    it('should perform soft delete by setting deleted_at', async () => {
      // Arrange
      const studentId = 'student-id';
      
      // Act
      const result = await repository.softDelete(studentId);
      
      // Assert
      expect(studentModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(mockStudent);
    });
  });

  /**
   * FindByMSSV Tests
   */
  describe('findByMSSV', () => {
    it('should find a student by MSSV', async () => {
      // Arrange
      const mssv = 'SV001';
      
      // Act
      const result = await repository.findByMSSV(mssv);
      
      // Assert
      expect(studentModel.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockStudent);
    });
  });

  /**
   * Add additional method tests as needed
   */
}); 