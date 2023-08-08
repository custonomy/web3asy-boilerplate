require('dotenv').config();
const DB_HOSTNAME = process.env.DB_HOSTNAME || 'localhost';

// Update with your config settings.

export const db_config = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'exhibit',
      user: 'exhibit',
      password: process.env.DB_PASSWORD ?? 'exhibit',
      host: DB_HOSTNAME,
      port: '5432',
    },
    pool: {
      min: 5,
      max: 15,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  testing: {
    client: 'postgresql',
    connection: {
      database: 'exhibit',
      user: 'exhibit',
      password: process.env.DB_PASSWORD ?? '',
      host: DB_HOSTNAME,
      port: '5432',
    },
    pool: {
      min: 5,
      max: 15,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'exhibit',
      user: 'exhibit',
      password: process.env.DB_PASSWORD ?? '',
      host: DB_HOSTNAME,
    },
    pool: {
      min: 5,
      max: 15,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};