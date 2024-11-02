import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { Role } from '../../../common/interfaces';

const createUserDto: CreateUserDto = {
  username: 'testuser',
  email: 'test@example.com',
  passwordHash: 'hashedpassword',
  role: Role.USER,
  teamId: '1',
};

describe('UserService', () => {
  let service: UserService;
  let mockEntityManager: Partial<EntityManager>;
  beforeEach(async () => {
    mockEntityManager = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn().mockResolvedValue(createUserDto),
      create: jest.fn().mockReturnValue(createUserDto),
      remove: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getEntityManagerToken(),
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const result = await service.create(createUserDto);

      expect(result).toEqual(createUserDto);
      expect(mockEntityManager.create).toHaveBeenCalledWith(
        User,
        createUserDto,
      );
      expect(mockEntityManager.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: '1', username: 'user1' },
        { id: '2', username: 'user2' },
      ];
      jest.spyOn(mockEntityManager, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockEntityManager.find).toHaveBeenCalledWith(User);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: '1', username: 'user1' };
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, {
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = { id: '1', username: 'user1' };
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValue(user);
      jest.spyOn(mockEntityManager, 'save').mockResolvedValue({
        ...user,
        ...updateUserDto,
      });

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual({ ...user, ...updateUserDto });
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, {
        where: { id: '1' },
      });
      expect(mockEntityManager.save).toHaveBeenCalledWith({
        ...user,
        ...updateUserDto,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest
        .spyOn(mockEntityManager, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await service.remove('1');

      expect(result).toEqual({ deleted: true });
      expect(mockEntityManager.delete).toHaveBeenCalledWith(User, '1');
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(mockEntityManager, 'delete')
        .mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
