import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceGroupDto } from '../dto/create-service-group.dto';
import { UpdateServiceGroupDto } from '../dto/update-service-group.dto';
import { EntityManager } from 'typeorm';
import { ServiceGroup } from '../entities/service-group.entity';
import { FindServiceGroupsDto } from '../dto/find-service-groups.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Version } from '../../version/entities/version.entity';
@Injectable()
export class ServiceGroupService {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(
    createServiceGroupDto: CreateServiceGroupDto,
    user: any,
    entityManager = this.manager,
  ): Promise<ServiceGroup> {
    const teamId = user.team.id;

    return entityManager.transaction(async (transactionalEntityManager) => {
      const serviceGroup = transactionalEntityManager.create(ServiceGroup, {
        ...createServiceGroupDto,
        teamId,
      });

      const savedServiceGroup =
        await transactionalEntityManager.save(serviceGroup);

      const version = transactionalEntityManager.create(Version, {
        serviceId: savedServiceGroup.id,
        versionNumber: 1,
        isActive: true,
        changelog: {
          name: savedServiceGroup.name,
          description: savedServiceGroup.description,
          tags: savedServiceGroup.tags,
          userId: user.id,
        },
      });

      await transactionalEntityManager.save(version);

      return savedServiceGroup;
    });
  }

  async findAll(
    query: FindServiceGroupsDto,
    entityManager = this.manager,
  ): Promise<[ServiceGroup[], number]> {
    const { search, sort, page, limit } = query;

    const qb = entityManager.createQueryBuilder(ServiceGroup, 'serviceGroup');

    // Fuzzy search by name, description, and tags
    if (search) {
      qb.where(
        '(serviceGroup.name ILIKE :search OR serviceGroup.description ILIKE :search OR serviceGroup.tags ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    if (sort) {
      qb.orderBy('serviceGroup.name', sort === 1 ? 'ASC' : 'DESC');
    }

    // Pagination
    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount(); // Returns both the results and the total count
  }

  async findOne(
    id: string,
    entityManager = this.manager,
  ): Promise<ServiceGroup> {
    const serviceGroup = await entityManager.findOne(ServiceGroup, {
      where: { id },
      relations: ['versions'],
    });
    if (!serviceGroup) {
      throw new NotFoundException(`Service group with ID ${id} not found`);
    }
    return serviceGroup;
  }

  async update(
    id: string,
    updateServiceGroupDto: UpdateServiceGroupDto,
    user: any,
    entityManager = this.manager,
  ): Promise<ServiceGroup> {
    return entityManager.transaction(async (transactionalEntityManager) => {
      // get existing with versions
      const serviceGroup = await this.findOne(id, transactionalEntityManager);

      // mark existing most recent active version to false
      const mostRecentVersion = serviceGroup.versions.sort(
        (a, b) => a.versionNumber - b.versionNumber,
      )[0];
      mostRecentVersion.isActive = false;

      // create a new version with content from update in changelog
      const newVersion = transactionalEntityManager.create(Version, {
        serviceId: serviceGroup.id,
        versionNumber: mostRecentVersion.versionNumber + 1,
        changelog: {
          name: updateServiceGroupDto.name
            ? updateServiceGroupDto.name
            : serviceGroup.name,
          description: updateServiceGroupDto.description
            ? updateServiceGroupDto.description
            : serviceGroup.description,
          tags: updateServiceGroupDto.tags
            ? updateServiceGroupDto.tags
            : serviceGroup.tags,
          userId: user.id,
        },
      });

      // merge updates
      const updatedServiceGroup = transactionalEntityManager.merge(
        ServiceGroup,
        serviceGroup,
        {
          ...updateServiceGroupDto,
          versions: [...serviceGroup.versions, newVersion],
        },
      );

      // save
      const savedServiceGroup =
        await transactionalEntityManager.save(updatedServiceGroup);

      return savedServiceGroup;
    });
  }

  async remove(
    id: string,
    entityManager = this.manager,
  ): Promise<{ deleted: boolean }> {
    const result = await entityManager.delete(ServiceGroup, id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service group with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
