import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceGroupDto } from '../dto/create-service-group.dto';
import { UpdateServiceGroupDto } from '../dto/update-service-group.dto';
import { EntityManager } from 'typeorm';
import { ServiceGroup } from '../entities/service-group.entity';
import { FindServiceGroupsDto } from '../dto/find-service-groups.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { ServiceGroupDto } from '../dto/service-group.dto';
@Injectable()
export class ServiceGroupService {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(
    createServiceGroupDto: CreateServiceGroupDto,
    entityManager = this.manager,
  ): Promise<ServiceGroup> {
    return entityManager.transaction(async (transactionalEntityManager) => {
      const serviceGroup = transactionalEntityManager.create(ServiceGroup, {
        ...createServiceGroupDto,
      });

      const savedServiceGroup =
        await transactionalEntityManager.save(serviceGroup);

      const version = transactionalEntityManager.create('Version', {
        serviceGroupId: savedServiceGroup.id,
        version: 1,
        isActive: true,
        changelog: {
          name: savedServiceGroup.name,
          description: savedServiceGroup.description,
          tags: savedServiceGroup.tags,
          userId: createServiceGroupDto.userId,
        },
      });

      await transactionalEntityManager.save(version);

      return savedServiceGroup;
    });
  }

  async findAll(
    query: FindServiceGroupsDto,
    user: User,
    entityManager = this.manager,
  ): Promise<[ServiceGroupDto[], number]> {
    const { search, sort, page, limit } = query;

    const qb = entityManager.createQueryBuilder(ServiceGroup, 'serviceGroup');

    // include version ids array in results
    qb.leftJoinAndSelect('serviceGroup.versions', 'versions');

    // If the user is part of a team, you can also filter by team ID if needed
    if (user.teamId) {
      qb.andWhere(
        'serviceGroup.userId IN (SELECT id FROM users WHERE team_id = :teamId)',
        { teamId: user.teamId },
      );
    }

    // Fuzzy search by name, description, and tags
    if (search) {
      qb.andWhere(
        '(serviceGroup.name ILIKE :search OR serviceGroup.description ILIKE :search OR serviceGroup.tags ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    if (sort) {
      qb.orderBy('serviceGroup.name', sort);
    }

    // Pagination
    if (page && limit) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [serviceGroups, total] = await qb.getManyAndCount(); // Returns both the results and the total count

    return [
      serviceGroups.map((serviceGroup) => {
        return {
          ...serviceGroup,
          versions: serviceGroup.versions?.map((version) => version.id),
        };
      }),
      total,
    ];
  }

  async findOne(
    id: string,
    entityManager = this.manager,
  ): Promise<ServiceGroup> {
    // TODO: filter by user team if user is part of a team?
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
    entityManager = this.manager,
  ): Promise<ServiceGroup> {
    return entityManager.transaction(async (transactionalEntityManager) => {
      // TODO: check if user is part of team that owns service group

      // get existing with versions
      const serviceGroup = await this.findOne(id, transactionalEntityManager);

      // mark existing all active versions to false
      for await (const version of serviceGroup.versions) {
        version.isActive = false;
        await transactionalEntityManager.save(version);
      }

      // get max version number
      const mostRecentVersion = serviceGroup.versions.sort(
        (a, b) => a.version - b.version,
      )[0];

      // create a new version with content from update in changelog
      const newVersion = transactionalEntityManager.create('Version', {
        serviceGroupId: serviceGroup.id,
        version: mostRecentVersion.version + 1,
        isActive: true,
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
          userId: updateServiceGroupDto.userId,
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
