import { Router } from 'express';
import { getCustomers, getCustomerById, registerCustomer, updateCustomer } from '../controllers/customersControllers.js';
import validateCustomer from '../middleware/validateCustomer.js';
const router = Router();

router.get("/customers", getCustomers);
router.get("/customers:id", getCustomerById);
router.post("/customers", validateCustomer, registerCustomer);
router.put("/customers:id", validateCustomer, updateCustomer);

export default router;