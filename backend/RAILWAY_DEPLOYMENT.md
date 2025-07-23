# Railway Deployment Environment Variables

For Railway deployment, your backend must connect to the PostgreSQL database using the environment variables provided by Railway. Railway typically provides the following variables:

- POSTGRESQL_URL (sometimes DATABASE_URL)
- PGHOST
- PGUSER
- PGPASSWORD
- PGPORT
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD

## How to Configure

1. **Update your backend/config/db.js** to support both local and Railway variable names. (Already being handled in the next step.)
2. **Set Railway variables in your Railway backend service**:
   - In the Railway dashboard, go to your backend service > Variables.
   - Add the following variables, mapping Railway's to your app's expected names:
     - `DB_USER` = `${PGUSER}`
     - `DB_PASSWORD` = `${PGPASSWORD}`
     - `DB_HOST` = `${PGHOST}`
     - `DB_PORT` = `${PGPORT}`
     - `DB_NAME` = `${POSTGRES_DB}`
   - Or, update your backend/config/db.js to read both sets of variable names (recommended, see below).

## Example: backend/config/db.js

```js
export default {
  user: process.env.DB_USER || process.env.PGUSER || process.env.POSTGRES_USER || 'postgres',
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'wa_app',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || 'password',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : (process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432),
};
```

This ensures your backend works both locally and on Railway without manual variable mapping.

## Summary
- Update `backend/config/db.js` as above.
- No need to manually remap variables in Railway dashboard.
- Your backend will connect to the Railway Postgres service automatically.
