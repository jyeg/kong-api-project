import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { Team } from '../entities/team.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { EntityManager } from 'typeorm';

const createTeamDto: CreateTeamDto = {
  name: 'Test Team',
  description: 'Test Description',
};

describe('TeamService', () => {
  let service: TeamService;
  let mockEntityManager: Partial<EntityManager>;

  beforeEach(async () => {
    mockEntityManager = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn().mockResolvedValue(createTeamDto),
      create: jest.fn().mockReturnValue(createTeamDto),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getEntityManagerToken(),
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a team', async () => {
      const result = await service.create(createTeamDto);

      expect(result).toEqual(createTeamDto);
      expect(mockEntityManager.create).toHaveBeenCalledWith(
        Team,
        createTeamDto,
      );
      expect(mockEntityManager.save).toHaveBeenCalledWith(createTeamDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const teams = [
        { id: '1', name: 'Team 1' },
        { id: '2', name: 'Team 2' },
      ];
      jest.spyOn(mockEntityManager, 'find').mockResolvedValue(teams);

      const result = await service.findAll();

      expect(result).toEqual(teams);
      expect(mockEntityManager.find).toHaveBeenCalledWith(Team);
    });
  });

  describe('findOne', () => {
    it('should return a team', async () => {
      const team = { id: '1', name: 'Team 1' };
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValue(team);

      const result = await service.findOne('1');

      expect(result).toEqual(team);
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Team, {
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if team not found', async () => {
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a team', async () => {
      const team = { id: '1', name: 'Team 1' };
      const updateTeamDto: UpdateTeamDto = { name: 'Updated Team' };
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValue(team);
      jest
        .spyOn(mockEntityManager, 'save')
        .mockResolvedValue({ ...team, ...updateTeamDto });

      const result = await service.update('1', updateTeamDto);

      expect(result).toEqual({ ...team, ...updateTeamDto });
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Team, {
        where: { id: '1' },
      });
      expect(mockEntityManager.save).toHaveBeenCalledWith({
        ...team,
        ...updateTeamDto,
      });
    });

    it('should throw NotFoundException if team not found', async () => {
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a team', async () => {
      jest
        .spyOn(mockEntityManager, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await service.remove('1');

      expect(result).toEqual({ deleted: true });
      expect(mockEntityManager.delete).toHaveBeenCalledWith(Team, '1');
    });

    it('should throw NotFoundException if team not found', async () => {
      jest
        .spyOn(mockEntityManager, 'delete')
        .mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
