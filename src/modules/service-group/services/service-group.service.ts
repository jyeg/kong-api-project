import { Injectable } from '@nestjs/common';
import { CreateServiceGroupDto } from '../dto/create-service-group.dto';
import { UpdateServiceGroupDto } from '../dto/update-service-group.dto';
import { Repository } from 'typeorm';
import { ServiceGroup } from '../entities/service-group.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiceGroupService {
  constructor(
    @InjectRepository(ServiceGroup)
    private serviceGroupRepository: Repository<ServiceGroup>,
  ) {}

  create(createServiceGroupDto: CreateServiceGroupDto) {
    return this.serviceGroupRepository.save(createServiceGroupDto);
  }

  findAll() {
    return this.serviceGroupRepository.find();
  }

  findOne(id: string) {
    return this.serviceGroupRepository.findOneBy({ id });
  }

  update(id: string, updateServiceGroupDto: UpdateServiceGroupDto) {
    return this.serviceGroupRepository.update(id, updateServiceGroupDto);
  }

  remove(id: string) {
    return this.serviceGroupRepository.delete(id);
  }
}
