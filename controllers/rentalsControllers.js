import { db } from '../database/postgres.js';
import dayjs from 'dayjs';

export async function getRentals(req, res){
    try {
        const rentals = await db.query('SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id');
        res.send(rentals.rows);
    } catch (error) {
        res.status(404).send(error.message);
    }
}

export async function registerRental(req, res){
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    console.log(rentDate);
    const originalPrice = await db.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [gameId]);
    console.log(originalPrice.rows[0].pricePerDay * 3);
    const returnDate = null;
    const delayFee = null;

    try {
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")  
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice.rows[0].pricePerDay * 3, delayFee]);
        res.sendStatus(201);
    } catch (error) {
        res.send(error.message);
    }
}

export async function finalizeRental(req, res){
    const id = req.params.id;

    try {
        const rental = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);

        if (!rental.rows[0]) {
            return res.sendStatus(404);
        }
        
        if (rental.rows[0].returnDate) {
            return res.sendStatus(400);
        }

        const game = await db.query('SELECT * FROM games WHERE id = $1', [rental.rows[0].gameId]);

        const rentDate = dayjs(rental.rows[0].rentDate);
        const returnDate = dayjs();
        const rentedDays = rental.rows[0].daysRented;
        const delayDays = Math.max(0, returnDate.diff(rentDate, 'day') - rentedDays);
        const delayFee = delayDays * game.rows[0].pricePerDay;

        await db.query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3', [returnDate, delayFee, id]);
        
        res.sendStatus(200);
    } catch (error) {
        res.send(error.message);
    }
}

export async function deleteRental(req, res){
    const id = req.params.id;

    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);

        if(rental.rowCount === 0){
            return res.sendStatus(404);
        } else if (rental.rows[0].returnDate === null){
            return res.sendStatus(400);
        } else {
            await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
            return res.sendStatus(200);
        }

    } catch (error) {
        return res.send(error.message);
    }
}