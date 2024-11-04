import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.manager.create(User, createUserDto);
    return this.manager.save(user);
  }

  async findAll({ teamId }: { teamId?: string }): Promise<User[]> {
    const query = this.manager.createQueryBuilder(User, 'user');
    if (teamId) {
      query.where('user.teamId = :teamId', { teamId });
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.manager.findOne(User, { where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Check if the user exists
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = Object.assign(user, updateUserDto);
    return this.manager.save(updatedUser);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.manager.delete(User, id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
