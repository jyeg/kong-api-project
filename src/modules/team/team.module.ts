import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from './services/team.service';
import { Team } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  providers: [TeamService],
  controllers: [],
})
export class TeamModule {}
