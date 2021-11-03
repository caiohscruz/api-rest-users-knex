require('dotenv/config');

/* Como estou fazendo deploy na Heroku e a string de conexão é atualizada de tempos em tempos */
/* e não consegui setar o knex com a string de conexão fornecida pelo JAWSDB */
/* resolvi extrair os dado que precisava para estabelecer a conexão */
/* Este é o formato da string fornecida => mysql://DB_USERNAME:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME */

const DB_USERNAME = process.env.JAWSDB_URL.split(':')[1].replace('//','');
const DB_PASSWORD = process.env.JAWSDB_URL.split(':')[2].split('@')[0];
const DB_HOST = process.env.JAWSDB_URL.split(':')[2].split('@')[1];
const DB_NAME = process.env.JAWSDB_URL.split(':')[3].split('/')[1];

var knex = require('knex')({
    client: process.env.DB_CLIENT,
    connection: {
      host : DB_HOST,
      user : DB_USERNAME,
      password : DB_PASSWORD,
      database : DB_NAME
    }
  });

/* Caso tenha os valores sejam estáticos, pode utilizar o trecho abaixo em vez do anterior */
/*
var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME
    }
  });
*/

module.exports = knex