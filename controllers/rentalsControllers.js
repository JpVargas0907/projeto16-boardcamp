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