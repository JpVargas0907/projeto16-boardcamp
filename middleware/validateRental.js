import { query } from 'express';
import { db } from '../database/postgres.js';

async function validateRental(req, res, next){
    const { customerId, gameId, daysRented } = req.body;
    const searchCustomer = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
    const searchGame = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
    const stockTotal = await db.query(`SELECT "stockTotal" FROM games WHERE id = $1`, [gameId]);

    if (searchCustomer.rowCount <= 0 || searchGame.rowCount <= 0 || daysRented <= 0 || stockTotal <= 0) {
        return res.sendStatus(400)
    }

    next();
}

export default validateRental;