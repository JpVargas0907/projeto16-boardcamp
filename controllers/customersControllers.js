import { db } from "../database/postgres.js";

export async function getCustomers(req, res){
    try {
        const customers = await db.query('SELECT * FROM customers');
        return res.status(200).send(customers.rows);
    } catch (error) {
        return res.status(404).send(error.message);
    }
}

export async function getCustomerById(req, res){
    const id = req.params.id;
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        return res.send(customer.rows[0]);
    } catch (error) {
        return res.sendStatus(404);
    }
}

export async function registerCustomer(req, res){
    const {name, phone, cpf, birthday } = req.body;
    try {
        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);
        return res.sendStatus(201);
    } catch (error) {
        return res.send(error.message);
    }
}

export async function updateCustomer(req, res){
    const id = req.params.id;
    const {name, phone, cpf, birthday } = req.body;

    try {
        await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, [name, phone, cpf, birthday, id]);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(404).send(error.message);
    }
}