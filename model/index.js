const { MySQL } = require("fxsql");
const { CONNECT } = MySQL;
require('dotenv').config();

const POOL = CONNECT({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
// console.log(POOL);

module.exports = POOL;