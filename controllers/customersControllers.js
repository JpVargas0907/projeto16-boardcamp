import { db } from "../database/postgres.js";

export async function getCustomers(req, res){
    try {
        const customers = await db.query('SELECT * FROM customers');
        res.status(200).send(customers.rows);
    } catch (error) {
        res.status(404).send(error.message);
    }
}

export async function getCustomerById(req, res){
    const id = req.params;
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        res.send(customer.rows[0]);
    } catch (error) {
        res.status(404);
    }
}

export async function registerCustomer(req, res){

}

export async function updateCustomer(req, res){

}