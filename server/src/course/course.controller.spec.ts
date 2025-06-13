import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const dto = { ma_mon_hoc: 'CS101', ten: { en: 'Intro to CS', vi: 'Giới Thiệu Về Khoa Học Máy Tính' }, tin_chi: 3, khoa: '123' };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('get', () => {
    it('should call service.get with correct parameters', async () => {
      const query = { limit: 10, offset: 0 , page: 1};
      const searchString = 'CS';
      await controller.get(query, searchString, "true");
      expect(service.get).toHaveBeenCalledWith(query, searchString, "true");
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const id = '123';
      const dto = { ten: { en: 'Updated Course Name', vi: 'Tên Môn Học Đã Cập Nhật' } };
      await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('delete', () => {
    it('should call service.delete with correct parameters', async () => {
      const id = '123';
      await controller.delete(id);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getAll', () => {
    it('should call service.getAll', async () => {
      await controller.getAll();
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should call service.getById with correct parameters', async () => {
      const id = '123';
      await controller.getById(id);
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });
});