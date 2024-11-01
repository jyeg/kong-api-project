import { User } from '../../modules/user/entities/user.entity';
import { Team } from '../../modules/team/entities/team.entity';
import { ServiceGroup } from '../../modules/service-group/entities/service-group.entity';
import { Version } from '../../modules/version/entities/version.entity';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';
import { Role } from 'src/common/interfaces';

export async function seedDatabase(manager: EntityManager) {
  const userRepository = manager.getRepository(User);
  const teamRepository = manager.getRepository(Team);
  const serviceRepository = manager.getRepository(ServiceGroup);
  const versionRepository = manager.getRepository(Version);

  try {
    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const user1 = await userRepository.save(
      userRepository.create({
        username: 'alice',
        email: 'alice@example.com',
        passwordHash: passwordHash,
        roles: [Role.ADMIN],
      }),
    );

    const user2 = await userRepository.save(
      userRepository.create({
        username: 'bob',
        email: 'bob@example.com',
        passwordHash: passwordHash,
        roles: [Role.USER],
      }),
    );

    // Create Teams
    const team1 = await teamRepository.save(
      teamRepository.create({
        name: 'Team Alpha',
        description: 'Alpha team description',
      }),
    );

    const team2 = await teamRepository.save(
      teamRepository.create({
        name: 'Team Beta',
        description: 'Beta team description',
      }),
    );

    // Create ServiceGroups
    const service1 = await serviceRepository.save(
      serviceRepository.create({
        name: 'StockApi',
        description: 'Provides stock information.',
        team: team1,
        tags: ['finance', 'stocks'],
        status: 'Active',
      }),
    );

    const service2 = await serviceRepository.save(
      serviceRepository.create({
        name: 'WeatherApi',
        description: 'Provides weather data.',
        team: team2,
        tags: ['weather', 'data'],
        status: 'Active',
      }),
    );

    // Create Versions
    await versionRepository.save([
      versionRepository.create({
        versionNumber: '1.0.0',
        releaseDate: new Date('2023-09-01'),
        changelog: 'Initial release.',
        documentationUrl: 'https://docs.example.com/stockapi/v1',
        service: service1,
      }),
      versionRepository.create({
        versionNumber: '1.1.0',
        releaseDate: new Date('2023-10-01'),
        changelog: 'Added new endpoints.',
        documentationUrl: 'https://docs.example.com/stockapi/v1.1',
        service: service1,
      }),
      versionRepository.create({
        versionNumber: '1.0.0',
        releaseDate: new Date('2023-09-15'),
        changelog: 'Initial release.',
        documentationUrl: 'https://docs.example.com/weatherapi/v1',
        service: service2,
      }),
    ]);

    // Update team-user relationships separately
    await teamRepository
      .createQueryBuilder()
      .relation(Team, 'users')
      .of(team1)
      .add([user1.id, user2.id]);

    await teamRepository
      .createQueryBuilder()
      .relation(Team, 'users')
      .of(team2)
      .add(user2.id);

    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
}
