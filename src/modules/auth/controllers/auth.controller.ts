import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    description: 'User login credentials',
    type: LoginDto,
    examples: {
      default: {
        value: {
          email: 'bob@example.com',
          password: 'password123',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const result = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto, @Res() res) {
    const result = await this.authService.register(registerDto);
    return res.status(HttpStatus.CREATED).json(result);
  }
}
