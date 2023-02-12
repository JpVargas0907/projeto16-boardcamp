import { db } from '../database/postgres.js';

export async function getRentals(req, res){
    try {
        const rentals = await db.query('SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id');
        res.send(rentals.rows);
    } catch (error) {
        res.status(404).send(error.message);
    }
}