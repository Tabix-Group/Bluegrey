import dotenv from 'dotenv';
dotenv.config();

export default {
  user: process.env.DB_USER || process.env.PGUSER || process.env.POSTGRES_USER || 'postgres',
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'wa_app',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || 'password',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : (process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432),
};
