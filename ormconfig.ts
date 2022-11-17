import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';

loadEnv();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOSTNAME,
  port: parseInt(process.env.MYSQL_PORT, 10),
  database: process.env.MYSQL_DB_NAME,
  username: process.env.MYSQL_USER_NAME,
  password: process.env.MYSQL_USER_PSWD,
  migrations: ['./migrations/*.ts'],
});

export default dataSource;
