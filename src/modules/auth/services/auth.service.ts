import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Team } from '../../team/entities/team.entity';
import { Role } from '../../../common/interfaces';
import { UserDto } from '../../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: UserDto }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
      teamId: user.teamId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  // TODO: Add role validation for the teamId
  async register(registerDto: RegisterDto): Promise<{
    access_token: string;
    user: UserDto;
  }> {
    const { email, password, username } = registerDto;

    // Validate input
    if (!email || !password || !username) {
      throw new BadRequestException(
        'Email, password, and username are required',
      );
    }

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password
    const newPasswordHash = await bcrypt.hash(password, 10); // Ensure password is defined

    const newUser = this.usersRepository.create({
      email,
      passwordHash: newPasswordHash,
      username,
      roles: [Role.USER],
    });

    const team = await this.teamsRepository.findOne({
      where: { id: registerDto.teamId }, // TODO: correctly handle teamId
    });

    if (team) {
      newUser.team = team;
    }

    const savedUser = await this.usersRepository.save(newUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = savedUser;

    const payload = {
      email: result.email,
      sub: result.id,
      roles: result.roles,
      teamId: result.teamId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }
}
