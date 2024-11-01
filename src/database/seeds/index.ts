import dataSource from '../../dataSource';
import { seedDatabase } from './seedInit';

async function runSeed() {
  try {
    await dataSource.initialize();
    console.log('Starting database seeding...');

    await dataSource.transaction(async (manager) => {
      await seedDatabase(manager);
    });

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();
