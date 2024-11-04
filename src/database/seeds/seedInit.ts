import { User } from '../../modules/user/entities/user.entity';
import { Team } from '../../modules/team/entities/team.entity';
import { ServiceGroup } from '../../modules/service-group/entities/service-group.entity';
import { Version } from '../../modules/version/entities/version.entity';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';
import { Role } from '../../common/interfaces';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase(manager: EntityManager) {
  const userRepository = manager.getRepository(User);
  const teamRepository = manager.getRepository(Team);
  const serviceRepository = manager.getRepository(ServiceGroup);
  const versionRepository = manager.getRepository(Version);

  const seedUserId = uuidv4();
  const seedTeamId = uuidv4();
  const seedServiceGroupId = uuidv4();

  // truncate all tables
  await manager.query('TRUNCATE TABLE "versions" CASCADE');
  await manager.query('TRUNCATE TABLE "service_groups" CASCADE');
  await manager.query('TRUNCATE TABLE "users" CASCADE');
  await manager.query('TRUNCATE TABLE "teams" CASCADE');

  try {
    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Teams
    const teams = await teamRepository.save([
      teamRepository.create({
        id: seedTeamId,
        name: 'Team Alpha',
        description: 'Alpha team description',
      }),
      teamRepository.create({
        name: 'Team Beta',
        description: 'Beta team description',
      }),
    ]);

    const users = await userRepository.save([
      userRepository.create({
        id: seedUserId,
        username: 'alice',
        email: 'alice@example.com',
        passwordHash: passwordHash,
        roles: [Role.ADMIN],
        teamId: seedTeamId,
      }),
      userRepository.create({
        username: 'bob',
        email: 'bob@example.com',
        passwordHash: passwordHash,
        roles: [Role.USER],
        teamId: teams[0].id,
      }),
      userRepository.create({
        username: 'charlie',
        email: 'charlie@example.com',
        passwordHash: passwordHash,
        roles: [Role.USER],
        teamId: teams[1].id,
      }),
    ]);

    const animalNames = [
      'Lion',
      'Elephant',
      'Giraffe',
      'Zebra',
      'Monkey',
      'Kangaroo',
      'Penguin',
      'Koala',
      'Crocodile',
      'Tiger',
    ];
    const animalDescriptions = [
      'The king of the jungle',
      'The largest land animal',
      'The tallest mammal',
      'The black and white striped horse',
      'The mischievous primate',
      'The hopping marsupial',
      'The flightless bird',
      'The cuddly marsupial',
      'The ancient predator',
      'The majestic predator',
    ];
    const animalTags = [
      'Savannah',
      'Forest',
      'Grassland',
      'Desert',
      'Mountain',
      'River',
      'Ocean',
      'Island',
      'Swamp',
      'Tundra',
    ];

    // Create ServiceGroups
    const serviceGroups = [];
    for (let i = 0; i < 10; i++) {
      const serviceGroup = await serviceRepository.save(
        serviceRepository.create({
          id: i === 1 ? seedServiceGroupId : uuidv4(),
          name: `ServiceGroup ${animalNames[i]}`,
          description: animalDescriptions[i],
          userId: i > 7 ? users[2].id : users[i % 2].id, // Alternate between Alice and Bob
          tags: [animalTags[i]], // Use a single tag for each service group
        }),
      );
      serviceGroups.push(serviceGroup);
    }
    await serviceRepository.save(serviceGroups);
    // Create Versions for each ServiceGroup
    const versions = [];
    for (const serviceGroup of serviceGroups) {
      versions.push(
        versionRepository.create({
          serviceGroupId: serviceGroup.id,
          version: 1,
          releaseDate: new Date('2023-09-01'),
          changelog: JSON.stringify({
            name: serviceGroup.name + ' v1',
            description: serviceGroup.description,
            tags: serviceGroup.tags,
            userId: serviceGroup.userId,
          }),
          documentationUrl: `https://docs.example.com/servicegroup${serviceGroup.name}/v1`,
          isActive: false,
        }),
        versionRepository.create({
          serviceGroupId: serviceGroup.id,
          version: 2,
          releaseDate: new Date('2023-10-01'),
          changelog: JSON.stringify({
            name: serviceGroup.name,
            description: serviceGroup.description,
            tags: serviceGroup.tags,
            userId: serviceGroup.userId,
          }),
          documentationUrl: `https://docs.example.com/servicegroup${serviceGroup.name}/v1.1`,
          isActive: true,
        }),
      );
    }
    await versionRepository.save(versions);
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
}
