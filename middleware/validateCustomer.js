import { db } from '../database/postgres.js';
import { customerSchema } from '../schemas/customerSchema.js';

async function validateCustomer(req, res, next){
    const validation = customerSchema.validate(req.body);
    const { cpf } = req.body;
    const verifyCustomerCpfExists = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);

    if(validation.error){
        return res.sendStatus(400);
    } else if (verifyCustomerCpfExists.rowCount > 0) {
        return res.sendStatus(409);
    }

    next();
}

export default validateCustomer;