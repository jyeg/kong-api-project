import { Module } from '@nestjs/common';
import { VersionService } from './services/version.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Version } from './entities/version.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Version])],
  controllers: [],
  providers: [VersionService],
})
export class VersionModule {}
