import { db } from '../database/postgres.js';
import { gameSchema } from '../schemas/gameSchema.js';

async function validateGame(req, res, next){
    const validation = gameSchema.validate(req.body);
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    const verifyGameNameExists = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);

    if(validation.error){
        return res.status(422);
    } else if (name === null || stockTotal <= 0 || pricePerDay <= 0){
        return res.status(400);
    } else if (verifyGameNameExists.rowCount > 0){
        return res.status(409);
    }

    next();
}

export default validateGame;