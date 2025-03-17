import { Test, TestingModule } from '@nestjs/testing';
import { StudentStatusController } from './student_status.controller';

describe('StudentStatusController', () => {
  let controller: StudentStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentStatusController],
    }).compile();

    controller = module.get<StudentStatusController>(StudentStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
