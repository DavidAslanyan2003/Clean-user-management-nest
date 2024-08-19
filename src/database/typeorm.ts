import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { env } from 'node:process';
import { DataSource, DataSourceOptions } from 'typeorm';
config({ path: `.env.${env.NODE_ENV || 'development'}` });

export const createDataSource = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  synchronize: true,
  logging: !!configService.get<boolean>('TYPEORM_LOGGING'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

export const AppDataSource = (configService: ConfigService): DataSource => new DataSource(createDataSource(configService));
