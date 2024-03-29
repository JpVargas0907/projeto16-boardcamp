import { db } from '../database/postgres.js';

export async function searchGames(req, res){
    try {
        const games = await db.query('SELECT * FROM games');
        return res.status(200).send(games.rows);
    } catch (error) {
        return res.status(404).send(error.message);
    }
}

export async function registerGame(req, res){
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4 )`, [name, image, stockTotal, pricePerDay]);
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}