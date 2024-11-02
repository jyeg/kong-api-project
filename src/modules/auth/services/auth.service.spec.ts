import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Team } from '../../team/entities/team.entity';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../common/interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository;
  let mockTeamRepository;
  let mockJwtService;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockTeamRepository = {
      findOne: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        roles: [Role.USER],
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toBeDefined();
      expect(result.passwordHash).toBeUndefined();
      expect(result.id).toBe(mockUser.id);
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data when credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [Role.USER],
        teamId: 'team1',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user).toEqual(mockUser);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        roles: mockUser.roles,
        teamId: mockUser.teamId,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create new user and return access token', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password123',
        username: 'newuser',
        teamId: 'team1',
      };

      const mockTeam = { id: 'team1', name: 'Team 1' };
      const mockUser = {
        id: '1',
        email: registerDto.email,
        username: registerDto.username,
        roles: [Role.USER],
        teamId: registerDto.teamId,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          username: registerDto.username,
          roles: [Role.USER],
        }),
      );
    });

    it('should throw UnauthorizedException when user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser',
        teamId: 'team1',
      };

      mockUserRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create user without team when team is not found', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password123',
        username: 'newuser',
        teamId: 'nonexistent',
      };

      const mockUser = {
        id: '1',
        email: registerDto.email,
        username: registerDto.username,
        roles: [Role.USER],
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockTeamRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user).toEqual(mockUser);
    });
  });
});
