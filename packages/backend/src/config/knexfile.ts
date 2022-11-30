const DB = process.env.DB ?? "";
const DB_HOSTNAME = process.env.DB_HOSTNAME ?? "localhost";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
const DB_USER = process.env.DB_USER ?? "";

export const db_config = {
  development: {
    client: "postgresql",
    connection: {
      database: DB,
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOSTNAME,
      port: "5432",
    },
    pool: {
      min: 5,
      max: 15,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  testing: {
    client: "postgresql",
    connection: {
      database: DB,
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOSTNAME,
      port: "5432",
    },
    pool: {
      min: 5,
      max: 15,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  production: {
    client: "postgresql",
    connection: {
      database: DB,
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOSTNAME,
    },
    pool: {
      min: 5,
      max: 15,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
