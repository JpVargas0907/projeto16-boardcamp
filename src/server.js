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

// TESTE

server.get('/', (request, response) => {
  response.send("OK");
});

// CRUD CATEGORIAS 

server.get('/categories', async (request, response) => {
  try {
    const categorias = await connection.query('SELECT * FROM categories');
    response.send(categorias.rows)
  } catch (error) {
    response.sendStatus(404);
  }
});

server.post('/categories', async (request, response) => {
  const { name } = request
  const searchCategory = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
  try {
    if (name !== null && !searchCategory) {
      const newCategory = await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
      if (newCategory) {
        response.send('Nova Categoria Cadastrada com sucesso');
      }
    }
  } catch (error) {

  }
});

// CRUD JOGOS

server.get('/games', async (request, response) => {
  try {
    const games = await connection.query('SELECT * FROM games');
    response.send(games.rows)
  } catch (error) {
    response.sendStatus(404);
  }
});

server.get('/games/:name', async (request, response) => {
  const name = request.params.name;
  try {
    const games = await connection.query('SELECT * FROM games WHERE name = $1', [name]);
    response.send(games.rows)
  } catch (error) {
    response.sendStatus(404);
  }
});

server.post('/games', async (request, response) => {
  const { name, image, stockTotal, categoryId, pricePerDay } = request
  const verifyCategory = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);

  try {
    if (name !== null && stockTotal > 0 && pricePerDay > 0 && verifyCategory) {
      const newGame = await connection.query('INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay) VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
      if (newGame) {
        response.send('Novo jogo cadastrado com sucesso!')
      }
    }

  } catch (error) {
    response.sendStatus(404);
  }
});

// CRUD CLIENTES 

server.get('/customers', async (request, response) => {
  try {
    const customers = await connection.query('SELECT * FROM customers');
    response.send(customers.rows)
  } catch (error) {
    response.sendStatus(404);
  }
});

server.get('/customers/:cpf', async (request, response) => {
  const cpf = request.params.cpf
  try {
    const customers = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
    response.send(customers.rows)
  } catch (error) {
    response.sendStatus(404);
  }
});

server.get('/customers/:id', async (request, response) => {
  const id = request.params.id
  try {
    const customers = await connection.query('SELECT * FROM customers WHERE id = $1', [id]);
    response.send(customers.rows)
  } catch (error) {
    response.sendStatus(404);
  }
});

server.post('/customers', async (request, response) => {
  const { name, phone, cpf, birthday } = request
  const time = dayjs();
  const searchCPF = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
  try {
    if (typeof (cpf) === String && cpf.length === 10 || cpf.length === 11 && name !== null && birthday < time && !searchCPF) {
      const newCustomer = await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4, $5)', [name, phone, cpf, birthday]);

      response.sendStatus(201);
    }
  } catch (error) {
    response.sendStatus(409);
  }
});

server.put('/customers/:id', async (request, response) => {
  const id = request.params.id;
  const { name, phone, cpf, birthday } = request;
  const searchCPF = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);

  try {
    if (typeof (cpf) === String && cpf.length === 10 || cpf.length === 11 && name !== null && birthday < time && !searchCPF) {
      const updateCustomer = await connection.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5', [name, phone, cpf, birthday, id]);

      response.sendStatus(201);
    }
  } catch (error) {
    response.sendStatus(409);
  }
});

// CRUD ALUGUEIS

server.get('/rentals', async (request, response) => {
  try {
    const rentals = await connection.query('SELECT games.*, customers.* FROM games JOIN rentals ON games.id = rentals.gameId JOIN customers ON customers.id = rentals.customerId;');

    response.send(rentals.rows);
  } catch (error) {
    response.send(error);
  }
});

server.get('/rentals/:customerId', async (request, response) => {
  const { customerId } = request.params;
  const customerFilter = [];

  try {
    const rentals = await connection.query('SELECT games.*, customers.* FROM games JOIN rentals ON games.id = rentals.gameId JOIN customers ON customers.id = rentals.customerId;');

    rentals.map(rental => {
      if(rental.customerId === customerId){
        customerFilter = [...customerFilter, rental.rows];
      }
    });
    if (customerFilter !== []) {
      response.send(customerFilter);
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    response.send(error)
  }
});


server.get('/rentals/:gameId', async (request, response) => {
  const { gameId } = request.params;
  const gameFilter = [];

  try {
    const rentals = await connection.query('SELECT games.*, customers.* FROM games JOIN rentals ON games.id = rentals.gameId JOIN customers ON customers.id = rentals.customerId;');

    rentals.map(rental => {
      if(rental.gameId === gameId){
        gameFilter = [...gameFilter, rental.rows];
      }
    });

    if (gameFilter !== []) {
      response.send(gameFilter);
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    response.send(error)
  }
});

server.post('/rentals', async (request, response) => {
  try {

  } catch (error) {

  }
});

server.post('/rentals/:id', async (request, response) => {
  const {customerId, gameId, daysRented} = request;
  const date = dayjs();
  const price = await connection.query("SELECT pricePerDay FROM games WHERE id = $1", [gameId])
  const verifyCustomerId = await connection.query("SELECT * FROM customers WHERE id=$1", [customerId]);
  const verifyGameId = await connection.query("SELECT * FROM games WHERE id=$1", [gameId]);
  const totalRentPrice = price * daysRented;

  try {
    if(verifyCustomerId && verifyGameId && daysRented > 0){
      await connection.query("INSERT INTO rentals (customerId, gameId, daysRented, rentDate, originalPrice) VALUES ($1,$2,$3,$4,$5)", [customerId, gameId, daysRented, date, totalRentPrice])
    } else {
      response.sendStatus(400);
    }
  } catch (error) {

  }
});

server.delete('/rentals/:id', async (request, response) => {
  try {

  } catch (error) {

  }
});


server.listen(4000, () => {
  console.log("Listening on port 4000");
})