import pkg from 'pg';
import dbConfig from '../config/db.js';
const { Pool } = pkg;

const pool = new Pool(dbConfig);

export default pool;
