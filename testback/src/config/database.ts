import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '#Nersomdr4121',
  database: process.env.DB_NAME || 'reciclame',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection;