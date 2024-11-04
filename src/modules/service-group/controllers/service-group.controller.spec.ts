import { Test, TestingModule } from '@nestjs/testing';
import { ServiceGroupController } from './service-group.controller';
import { ServiceGroupService } from '../services/service-group.service';
import { CreateServiceGroupDto } from '../dto/create-service-group.dto';
import { UpdateServiceGroupDto } from '../dto/update-service-group.dto';
import { FindServiceGroupsDto } from '../dto/find-service-groups.dto';
import { SortDirection } from '../../../common/constants';
import { UserService } from '../../user/services/user.service';
import { HttpStatus } from '@nestjs/common';

describe('ServiceGroupController', () => {
  let controller: ServiceGroupController;
  let service: ServiceGroupService;
  let mockResponse: any;

  const mockServiceGroupService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceGroupController],
      providers: [
        {
          provide: ServiceGroupService,
          useValue: mockServiceGroupService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<ServiceGroupController>(ServiceGroupController);
    service = module.get<ServiceGroupService>(ServiceGroupService);
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
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

      await controller.create(createDto, mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedServiceGroup);
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
        sort: SortDirection.ASC,
        page: 1,
        limit: 10,
      };
      const mockUser = { id: 'user-1', teamId: 'team-1' };
      const mockRequest = { user: mockUser };
      const expectedResult = {
        items: [{ id: 'sg-1', name: 'Test Service' }],
        total: 1,
      };

      mockServiceGroupService.findAll.mockResolvedValue([
        expectedResult.items,
        expectedResult.total,
      ]);

      await controller.findAll(query, mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
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

      await controller.findOne(serviceGroupId, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedServiceGroup);
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

      await controller.update(
        serviceGroupId,
        updateDto,
        mockRequest,
        mockResponse,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedServiceGroup);
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

      await controller.remove(serviceGroupId, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(serviceGroupId);
    });
  });
});
