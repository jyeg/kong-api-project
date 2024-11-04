import { Test, TestingModule } from '@nestjs/testing';
import { ServiceGroupService } from './service-group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceGroup } from '../entities/service-group.entity';
import { Team } from '../../team/entities/team.entity';
import { EntityManager } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FindServiceGroupsDto } from '../dto/find-service-groups.dto';
import { User } from '../../user/entities/user.entity';
import { SortDirection } from '../../../common/constants';

describe('ServiceGroupService', () => {
  let service: ServiceGroupService;
  let mockServiceGroupRepository;
  let mockTeamRepository;
  let mockEntityManager;

  beforeEach(async () => {
    mockServiceGroupRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      }),
    };

    mockTeamRepository = {
      findOne: jest.fn(),
    };

    mockEntityManager = {
      transaction: jest.fn((callback) => callback(mockEntityManager)),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceGroupService,
        {
          provide: getRepositoryToken(ServiceGroup),
          useValue: mockServiceGroupRepository,
        },
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<ServiceGroupService>(ServiceGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a service group with initial version', async () => {
      const createServiceGroupDto = {
        name: 'Test Service',
        description: 'Test Description',
        tags: ['test'],
        userId: 'user-1',
      };

      const savedServiceGroup = {
        id: 'sg-1',
        ...createServiceGroupDto,
      };

      mockEntityManager.create
        .mockReturnValueOnce(savedServiceGroup) // ServiceGroup
        .mockReturnValueOnce({
          // Version
          serviceGroupId: savedServiceGroup.id,
          version: 1,
          isActive: true,
          changelog: {
            name: savedServiceGroup.name,
            description: savedServiceGroup.description,
            tags: savedServiceGroup.tags,
            userId: createServiceGroupDto.userId,
          },
        });

      mockEntityManager.save.mockResolvedValueOnce(savedServiceGroup);

      const result = await service.create(createServiceGroupDto);

      expect(result).toEqual(savedServiceGroup);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalledTimes(2); // Once for ServiceGroup, once for Version
    });
  });

  describe('findAll', () => {
    it('should filter by team ID when user has teamId', async () => {
      const query: FindServiceGroupsDto = {
        search: 'test',
        sort: SortDirection.ASC,
        page: 1,
        limit: 10,
      };
      const user = { teamId: 'team-1' };

      const serviceGroups = [{ id: '1', name: 'Service 1', versions: [] }];
      mockEntityManager
        .createQueryBuilder()
        .getManyAndCount.mockResolvedValue([serviceGroups, 1]);

      await service.findAll(query, user as User);

      expect(
        mockEntityManager.createQueryBuilder().andWhere,
      ).toHaveBeenCalledWith(
        'serviceGroup.userId IN (SELECT id FROM users WHERE team_id = :teamId)',
        { teamId: user.teamId },
      );
    });
  });

  describe('findOne', () => {
    it('should return a service group', async () => {
      const serviceGroup = { id: '1', name: 'Service 1' };
      mockEntityManager.findOne.mockResolvedValue(serviceGroup);

      const result = await service.findOne('1');

      expect(result).toEqual(serviceGroup);
    });

    it('should throw NotFoundException if service group not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update service group and create new version', async () => {
      const id = 'sg-1';
      const updateServiceGroupDto = {
        name: 'Updated Service',
        userId: 'user-1',
      };

      const existingServiceGroup = {
        id,
        name: 'Original Service',
        versions: [
          {
            version: 1,
            isActive: true,
          },
        ],
      };

      mockEntityManager.findOne.mockResolvedValueOnce(existingServiceGroup);

      const updatedServiceGroup = {
        ...existingServiceGroup,
        name: updateServiceGroupDto.name,
        versions: [
          { version: 1, isActive: false },
          { version: 2, isActive: true },
        ],
      };

      mockEntityManager.merge.mockReturnValue(updatedServiceGroup);
      mockEntityManager.save.mockResolvedValue(updatedServiceGroup);

      const result = await service.update(id, updateServiceGroupDto);

      expect(result).toEqual(updatedServiceGroup);
      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: updateServiceGroupDto.name,
          versions: expect.arrayContaining([
            expect.objectContaining({ isActive: false }),
            expect.objectContaining({ isActive: true }),
          ]),
        }),
      );
    });

    it('should throw NotFoundException if service group not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a service group', async () => {
      mockEntityManager.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1');

      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException if service group not found', async () => {
      mockEntityManager.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
