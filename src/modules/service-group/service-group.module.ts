import { Module } from '@nestjs/common';
import { ServiceGroupService } from './services/service-group.service';
import { ServiceGroupController } from './controllers/service-group.controller';
import { ServiceGroup } from './entities/service-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceGroup]), UserModule],
  controllers: [ServiceGroupController],
  providers: [ServiceGroupService],
})
export class ServiceGroupModule {}
