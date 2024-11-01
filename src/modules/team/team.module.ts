import { Module } from '@nestjs/common';
import { TeamService } from './services/team.service';
import { Team } from './entities/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [],
  providers: [TeamService],
})
export class TeamModule {}
