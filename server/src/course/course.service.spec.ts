import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './services/course.service';
import { COURSE_REPOSITORY } from './repositories/course.repository.interface';

describe('CourseService', () => {
  let service: CourseService;
  let repositoryMock: any;

  beforeEach(async () => {
    repositoryMock = {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      softDelete: jest.fn(),
      getAll: jest.fn(),
      findByCode: jest.fn(),
      detail: jest.fn(),
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: COURSE_REPOSITORY,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.create with correct parameters', async () => {
      const dto = { ma_mon_hoc: 'CS101', ten: 'Intro to CS', tin_chi: 3, khoa: '123' };
      await service.create(dto);
      expect(repositoryMock.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call repository.update with correct parameters', async () => {
      const id = '123';
      const dto = { ten: 'Updated Course Name' };
      await service.update(id, dto);
      expect(repositoryMock.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('findAll', () => {
    it('should call repository.findAll with correct parameters', async () => {
      const paginationOpts = { limit: 10, offset: 0 };
      const searchString = 'CS';
      const page = 1;
      await service.get(paginationOpts, searchString, page);
      expect(repositoryMock.findAll).toHaveBeenCalledWith(paginationOpts, searchString, page);
    });
  });

  describe('delete', () => {
    it('should call repository.softDelete with correct parameters', async () => {
      const id = '123';
      await service.delete(id);
      expect(repositoryMock.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('getAll', () => {
    it('should call repository.getAll', async () => {
      await service.getAll();
      expect(repositoryMock.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should call repository.getById with correct parameters', async () => {
      const id = '123';
      await service.getById(id);
      expect(repositoryMock.getById).toHaveBeenCalledWith(id);
    });
  });
});