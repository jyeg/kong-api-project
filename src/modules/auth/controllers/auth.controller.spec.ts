import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import {
  BadRequestException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../../../common/interfaces';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockResponse: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
    } as any;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        access_token: 'jwt-token',
        user: {
          id: '1',
          email: loginDto.email,
          username: 'testuser',
          roles: [Role.USER],
          teamId: 'team-1',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      await controller.login(loginDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
        teamId: 'team-1',
      };

      const expectedResponse = {
        access_token: 'jwt-token',
        user: {
          id: '1',
          email: registerDto.email,
          username: registerDto.username,
          roles: [Role.USER],
          teamId: registerDto.teamId,
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      await controller.register(registerDto, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when registration fails', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser',
        teamId: 'team-1',
      };

      mockAuthService.register.mockRejectedValue(new BadRequestException());

      await expect(
        controller.register(registerDto, mockResponse),
      ).rejects.toThrow(BadRequestException);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
    });
  });
});
