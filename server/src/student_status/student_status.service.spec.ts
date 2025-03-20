import { Test, TestingModule } from '@nestjs/testing';
import { StudentStatusService } from './services/student_status.service';

describe('StudentStatusService', () => {
  let service: StudentStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentStatusService],
    }).compile();

    service = module.get<StudentStatusService>(StudentStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
