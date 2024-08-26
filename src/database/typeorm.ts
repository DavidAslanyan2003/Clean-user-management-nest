import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { env } from 'node:process';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

config({ path: `.env.${env.NODE_ENV || 'development'}` });

export const createDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  synchronize: false,
  logging: !!configService.get<boolean>('TYPEORM_LOGGING'),
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/../database/migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

const configService = new ConfigService();
export const AppDataSource = new DataSource(
  createDataSourceOptions(configService),
);