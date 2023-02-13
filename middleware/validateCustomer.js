import { db } from '../database/postgres.js';
import { customerSchema } from '../schemas/customerSchema.js';

async function validateCustomer(req, res, next){
    const validation = customerSchema.validate(req.body);
    const id = req.params.id;
    const { cpf } = req.body;
    const verifyCustomerCpfExists = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);

    if(validation.error){
        return res.status(400);
    } else if (verifyCustomerCpfExists.rowCount > 0 && verifyCustomerCpfExists.rows[0].id != id) {
        return res.status(409);
    }

    next();
}

export default validateCustomer;