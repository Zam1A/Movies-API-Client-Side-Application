const { MYSQL_DB, MYSQL_HOST, MYSQL_PORT, MYSQL_PSW, MYSQL_USER } = require('../config/mysql');

const db = require('knex')({
  client: 'mysql2',
  connection: {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PSW,
    database: MYSQL_DB
  },
});

module.exports = db;
