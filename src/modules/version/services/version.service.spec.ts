import { Test, TestingModule } from '@nestjs/testing';
import { VersionService } from './version.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Version } from '../entities/version.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateVersionDto } from '../dto/create-version.dto';
import { UpdateVersionDto } from '../dto/update-version.dto';

const createVersionDto: CreateVersionDto = {
  name: 'Version 1.0',
  description: 'Initial version',
};

const mockVersionRepository = {
  find: jest.fn(),
  findOneByOrFail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

describe('VersionService', () => {
  let service: VersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersionService,
        {
          provide: getRepositoryToken(Version),
          useValue: mockVersionRepository,
        },
      ],
    }).compile();

    service = module.get<VersionService>(VersionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a version', async () => {
      mockVersionRepository.save.mockResolvedValue(createVersionDto);

      const result = await service.create(createVersionDto);

      expect(result).toEqual(createVersionDto);
      expect(mockVersionRepository.save).toHaveBeenCalledWith(createVersionDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of versions', async () => {
      const versions = [
        { id: '1', name: 'Version 1.0' },
        { id: '2', name: 'Version 2.0' },
      ];
      mockVersionRepository.find.mockResolvedValue(versions);

      const result = await service.findAll();

      expect(result).toEqual(versions);
      expect(mockVersionRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a version', async () => {
      const version = { id: '1', name: 'Version 1.0' };
      mockVersionRepository.findOneByOrFail.mockResolvedValue(version);

      const result = await service.findOne('1');

      expect(result).toEqual(version);
      expect(mockVersionRepository.findOneByOrFail).toHaveBeenCalledWith({
        id: '1',
      });
    });

    it('should throw NotFoundException if version not found', async () => {
      mockVersionRepository.findOneByOrFail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a version', async () => {
      const version = { id: '1', name: 'Version 1.0' };
      const updateVersionDto: UpdateVersionDto = { name: 'Updated Version' };
      mockVersionRepository.findOneByOrFail.mockResolvedValue(version);
      mockVersionRepository.save.mockResolvedValue({
        ...version,
        ...updateVersionDto,
      });

      const result = await service.update('1', updateVersionDto);

      expect(result).toEqual({ ...version, ...updateVersionDto });
      expect(mockVersionRepository.findOneByOrFail).toHaveBeenCalledWith({
        id: '1',
      });
      expect(mockVersionRepository.save).toHaveBeenCalledWith({
        ...version,
        ...updateVersionDto,
      });
    });

    it('should throw NotFoundException if version not found', async () => {
      mockVersionRepository.findOneByOrFail.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a version', async () => {
      mockVersionRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1');

      expect(result).toEqual({ affected: 1 });
      expect(mockVersionRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
