import { Injectable } from '@nestjs/common';
import { CreateVersionDto } from '../dto/create-version.dto';
import { UpdateVersionDto } from '../dto/update-version.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Version } from '../entities/version.entity';

@Injectable()
export class VersionService {
  constructor(
    @InjectRepository(Version)
    private versionRepository: Repository<Version>,
  ) {}

  async create(createVersionDto: CreateVersionDto): Promise<Version> {
    return this.versionRepository.save(createVersionDto);
  }

  async findAll(): Promise<Version[]> {
    return this.versionRepository.find();
  }

  async findOne(id: string): Promise<Version> {
    return this.versionRepository.findOneByOrFail({ id });
  }

  async update(
    id: string,
    updateVersionDto: UpdateVersionDto,
  ): Promise<Version> {
    const existingVersion = await this.versionRepository.findOneByOrFail({
      id,
    });
    const updatedVersion = Object.assign(existingVersion, updateVersionDto);
    return this.versionRepository.save(updatedVersion);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.versionRepository.delete(id);
  }
}
