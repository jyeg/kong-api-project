import { Test, TestingModule } from '@nestjs/testing';
import { ServiceGroupController } from './service-group.controller';
import { ServiceGroupService } from '../services/service-group.service';
import { CreateServiceGroupDto } from '../dto/create-service-group.dto';
import { UpdateServiceGroupDto } from '../dto/update-service-group.dto';
import { FindServiceGroupsDto } from '../dto/find-service-groups.dto';

describe('ServiceGroupController', () => {
  let controller: ServiceGroupController;
  let service: ServiceGroupService;

  const mockServiceGroupService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceGroupController],
      providers: [
        {
          provide: ServiceGroupService,
          useValue: mockServiceGroupService,
        },
      ],
    }).compile();

    controller = module.get<ServiceGroupController>(ServiceGroupController);
    service = module.get<ServiceGroupService>(ServiceGroupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a service group with user ID from request', async () => {
      const createDto: CreateServiceGroupDto = {
        name: 'Test Service',
        description: 'Test Description',
        tags: ['test'],
        userId: 'user-1',
      };
      const mockUser = { id: 'user-1' };
      const mockRequest = { user: mockUser };
      const expectedServiceGroup = {
        id: 'sg-1',
        ...createDto,
        userId: mockUser.id,
      };

      mockServiceGroupService.create.mockResolvedValue(expectedServiceGroup);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(expectedServiceGroup);
      expect(service.create).toHaveBeenCalledWith({
        ...createDto,
        userId: mockUser.id,
      });
    });
  });

  describe('findAll', () => {
    it('should return all service groups with pagination and user context', async () => {
      const query: FindServiceGroupsDto = {
        search: 'test',
        sort: 1,
        page: 1,
        limit: 10,
      };
      const mockUser = { id: 'user-1', teamId: 'team-1' };
      const mockRequest = { user: mockUser };
      const expectedResult = {
        items: [{ id: 'sg-1', name: 'Test Service' }],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockServiceGroupService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(query, mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a single service group by ID', async () => {
      const serviceGroupId = 'sg-1';
      const expectedServiceGroup = {
        id: serviceGroupId,
        name: 'Test Service',
      };

      mockServiceGroupService.findOne.mockResolvedValue(expectedServiceGroup);

      const result = await controller.findOne(serviceGroupId);

      expect(result).toEqual(expectedServiceGroup);
      expect(service.findOne).toHaveBeenCalledWith(serviceGroupId);
    });
  });

  describe('update', () => {
    it('should update a service group with user ID from request', async () => {
      const serviceGroupId = 'sg-1';
      const updateDto: UpdateServiceGroupDto = {
        name: 'Updated Service',
      };
      const mockUser = { id: 'user-1' };
      const mockRequest = { user: mockUser };
      const expectedServiceGroup = {
        id: serviceGroupId,
        ...updateDto,
        userId: mockUser.id,
      };

      mockServiceGroupService.update.mockResolvedValue(expectedServiceGroup);

      const result = await controller.update(
        serviceGroupId,
        updateDto,
        mockRequest,
      );

      expect(result).toEqual(expectedServiceGroup);
      expect(service.update).toHaveBeenCalledWith(serviceGroupId, {
        ...updateDto,
        userId: mockUser.id,
      });
    });
  });

  describe('remove', () => {
    it('should remove a service group', async () => {
      const serviceGroupId = 'sg-1';
      const expectedResult = { deleted: true };

      mockServiceGroupService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(serviceGroupId);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(serviceGroupId);
    });
  });
});
