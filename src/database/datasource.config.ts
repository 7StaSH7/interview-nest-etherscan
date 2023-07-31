import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as entities from './entities';

config();

const configService = new ConfigService();

const isDev = configService.get('NODE_ENV') === 'dev';

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities,
  migrations: [
    isDev
      ? 'src/database/migrations/**/*.ts'
      : 'dist/database/migrations/**/*.js',
  ],
});
