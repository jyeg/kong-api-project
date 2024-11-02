import { Test, TestingModule } from '@nestjs/testing';
import { ServiceGroupService } from './service-group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceGroup } from '../entities/service-group.entity';
import { Team } from '../../team/entities/team.entity';
import { EntityManager } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { FindServiceGroupsDto } from '../dto/find-service-groups.dto';

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
      getRepository: jest.fn().mockImplementation((entity) => {
        if (entity === ServiceGroup) {
          return mockServiceGroupRepository;
        }
        if (entity === Team) {
          return mockTeamRepository;
        }
      }),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
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
    it('should create a service group', async () => {
      const createServiceGroupDto = {
        name: 'Test Service',
        description: 'Test Description',
        tags: ['test'],
      };
      const team = { id: 'team-id' };

      mockTeamRepository.findOne.mockResolvedValue(team);
      mockServiceGroupRepository.save.mockResolvedValue({
        ...createServiceGroupDto,
        team,
      });

      const result = await service.create(createServiceGroupDto, { team });

      expect(result).toEqual({ ...createServiceGroupDto, team });
      expect(mockServiceGroupRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ team }),
      );
    });

    it('should throw NotFoundException if team not found', async () => {
      const createServiceGroupDto = {
        name: 'Test Service',
        description: 'Test Description',
        tags: ['test'],
      };

      mockTeamRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create(createServiceGroupDto, { team: { id: 'team-id' } }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of service groups', async () => {
      const query: FindServiceGroupsDto = {
        search: '',
        sort: 'asc',
        page: 1,
        limit: 10,
      };
      const serviceGroups = [
        { id: '1', name: 'Service 1' },
        { id: '2', name: 'Service 2' },
      ];
      mockServiceGroupRepository
        .createQueryBuilder()
        .getManyAndCount.mockResolvedValue([serviceGroups, 2]);

      const result = await service.findAll(query);

      expect(result).toEqual([serviceGroups, 2]);
      expect(mockServiceGroupRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a service group', async () => {
      const serviceGroup = { id: '1', name: 'Service 1' };
      mockServiceGroupRepository.findOne.mockResolvedValue(serviceGroup);

      const result = await service.findOne('1');

      expect(result).toEqual(serviceGroup);
    });

    it('should throw NotFoundException if service group not found', async () => {
      mockServiceGroupRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a service group', async () => {
      const serviceGroup = { id: '1', name: 'Service 1' };
      const updateServiceGroupDto = { name: 'Updated Service' };
      mockServiceGroupRepository.findOne.mockResolvedValue(serviceGroup);
      mockServiceGroupRepository.save.mockResolvedValue({
        ...serviceGroup,
        ...updateServiceGroupDto,
      });

      const result = await service.update('1', updateServiceGroupDto);

      expect(result).toEqual({ ...serviceGroup, ...updateServiceGroupDto });
    });

    it('should throw NotFoundException if service group not found', async () => {
      mockServiceGroupRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a service group', async () => {
      mockServiceGroupRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1');

      expect(result).toEqual({ deleted: true });
    });

    it('should throw NotFoundException if service group not found', async () => {
      mockServiceGroupRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
