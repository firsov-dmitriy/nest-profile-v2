import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';

export const DbConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
});

console.log(DbConfig);
