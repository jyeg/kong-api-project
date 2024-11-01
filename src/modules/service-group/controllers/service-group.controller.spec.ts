import { Test, TestingModule } from '@nestjs/testing';
import { ServiceGroupController } from './service-group.controller';
import { ServiceGroupService } from '../services/service-group.service';

describe('ServiceGroupController', () => {
  let controller: ServiceGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceGroupController],
      providers: [ServiceGroupService],
    }).compile();

    controller = module.get<ServiceGroupController>(ServiceGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
