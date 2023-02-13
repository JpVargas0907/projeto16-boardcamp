const express = require('express');
const app = express();
const { Pool } = require('pg');
const dayjs = require('dayjs');

const pool = new Pool({
  user: 'seu-usuario',
  host: 'seu-host',
  database: 'sua-database',
  password: 'sua-senha',
  port: 5432,
});

app.post('/rentals/:id/return', async (req, res) => {
  const rentalId = req.params.id;

  // Busca o aluguel pelo ID
  const rentalResult = await pool.query('SELECT * FROM rentals WHERE id = $1', [rentalId]);
  const rental = rentalResult.rows[0];

  // Verifica se o aluguel existe
  if (!rental) {
    return res.status(404).send('Aluguel não encontrado');
  }

  // Verifica se o aluguel já foi finalizado
  if (rental.returnDate) {
    return res.status(400).send('Este aluguel já foi finalizado');
  }

  // Busca o jogo pelo ID
  const gameResult = await pool.query('SELECT * FROM games WHERE id = $1', [rental.gameId]);
  const game = gameResult.rows[0];

  // Calcula a multa por atraso
  const rentDate = dayjs(rental.rentDate);
  const returnDate = dayjs();
  const rentedDays = rental.daysRented;
  const delayDays = Math.max(0, returnDate.diff(rentDate, 'day') - rentedDays);
  const delayFee = delayDays * game.pricePerDay;

  // Atualiza o registro do aluguel no banco de dados
  await pool.query('UPDATE rentals SET returnDate = $1, delayFee = $2 WHERE id = $3', [returnDate, delayFee, rentalId]);

  return res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
