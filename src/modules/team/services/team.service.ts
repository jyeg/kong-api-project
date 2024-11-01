import { Inject, Injectable } from '@nestjs/common';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @Inject('TEAM_REPOSITORY')
    private teamRepository: Repository<Team>,
  ) {}

  create(createTeamDto: CreateTeamDto) {
    return this.teamRepository.save(createTeamDto);
  }

  findAll() {
    return this.teamRepository.find();
  }

  findOne(id: string) {
    return this.teamRepository.findOneBy({ id });
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.teamRepository.update(id, updateTeamDto);
  }

  remove(id: string) {
    return this.teamRepository.delete(id);
  }
}
