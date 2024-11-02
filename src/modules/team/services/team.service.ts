import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Team } from '../entities/team.entity';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager, // Inject EntityManager
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const team = this.manager.create(Team, createTeamDto);
    return this.manager.save(team);
  }

  async findAll() {
    return this.manager.find(Team);
  }

  async findOne(id: string) {
    const team = await this.manager.findOne(Team, { where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id); // Check if the team exists
    const updatedTeam = Object.assign(team, updateTeamDto);
    return this.manager.save(updatedTeam);
  }

  async remove(id: string) {
    const result = await this.manager.delete(Team, id);
    if (result.affected === 0) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
