const { MYSQL_DB, MYSQL_HOST, MYSQL_PORT, MYSQL_PSW, MYSQL_USER } = require('../config/mysql');

const db = require('knex')({
  client: 'mysql2',
  connection: {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PSW,
    database: MYSQL_DB,
    connectTimeout: Number(process.env.MYSQL_CONNECT_TIMEOUT || 10000)
  },
  pool: {
    min: 0,
    max: Number(process.env.MYSQL_POOL_MAX || 10)
  },
  acquireConnectionTimeout: Number(process.env.MYSQL_ACQUIRE_TIMEOUT || 10000)
});

module.exports = db;
