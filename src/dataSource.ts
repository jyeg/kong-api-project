import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';
import { join } from 'path';

config(); // Load .env file

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'postgres',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'database', 'migrations', '*{.ts,.js}')],
  synchronize: process.env.NODE_ENV !== 'production',
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV !== 'production',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
export { dataSourceOptions };
