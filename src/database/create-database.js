'use strict';

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL)
client.connect();
client.query(`SELECT * FROM favorites`)
  .catch(() => client.query(`CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    petfinderid VARCHAR(255),
    type VARCHAR(255),
    name VARCHAR(255),
    age VARCHAR(255),
    gender VARCHAR(255),
    size VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    description TEXT,
    photo VARCHAR(255),
    url TEXT
  );`))
client.on('err', err => console.error(err));