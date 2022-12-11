import express from 'express';
import pkg from 'pg';

const { Pool } = pkg;

const connection = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'driven9499',
  database: 'boardcamp'
});

const server = express();
server.use(express.json);



server.listen(4000, () => {
    console.log("Listening on port 4000");
})