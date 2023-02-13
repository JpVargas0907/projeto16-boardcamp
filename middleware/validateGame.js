import { db } from '../database/postgres.js';
import { gameSchema } from '../schemas/gameSchema.js';

async function validateGame(req, res, next){
    const validation = gameSchema.validate(req.body);
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    const verifyGameNameExists = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);

    if(validation.error){
        return res.sendStatus(400);
    } else if (name === null || stockTotal <= 0 || pricePerDay <= 0){
        return res.sendStatus(400);
    } else if (verifyGameNameExists.rowCount > 0){
        return res.sendStatus(409);
    }

    next();
}

export default validateGame;