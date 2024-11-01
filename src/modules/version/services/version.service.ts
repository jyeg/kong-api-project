import { Injectable } from '@nestjs/common';
import { CreateVersionDto } from '../dto/create-version.dto';
import { UpdateVersionDto } from '../dto/update-version.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Version } from '../entities/version.entity';

@Injectable()
export class VersionService {
  constructor(
    @InjectRepository(Version)
    private versionRepository: Repository<Version>,
  ) {}

  create(createVersionDto: CreateVersionDto) {
    return this.versionRepository.save(createVersionDto);
  }

  findAll() {
    return this.versionRepository.find();
  }

  findOne(id: string) {
    return this.versionRepository.findOneBy({ id });
  }

  update(id: string, updateVersionDto: UpdateVersionDto) {
    return this.versionRepository.update(id, updateVersionDto);
  }

  remove(id: string) {
    return this.versionRepository.delete(id);
  }
}
