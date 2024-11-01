import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const dataSourceOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: ['./src/database/migrations/*{.ts,.js}'],
  entities: ['./src/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production' ? true : false,
  namingStrategy: new SnakeNamingStrategy(),
  autoLoadEntities: true,
};

const dataSource = new DataSource({
  ...dataSourceOptions,
  type: 'postgres',
});

export default dataSource;
