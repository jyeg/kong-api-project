import { Test, TestingModule } from '@nestjs/testing';
import { ServiceGroupService } from './service-group.service';

describe('ServiceGroupService', () => {
  let service: ServiceGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceGroupService],
    }).compile();

    service = module.get<ServiceGroupService>(ServiceGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
