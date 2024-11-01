import { Module } from '@nestjs/common';
import { ServiceGroupService } from './services/service-group.service';
import { ServiceGroupController } from './controllers/service-group.controller';
import { ServiceGroup } from './entities/service-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceGroup])],
  controllers: [ServiceGroupController],
  providers: [ServiceGroupService],
})
export class ServiceGroupModule {}
