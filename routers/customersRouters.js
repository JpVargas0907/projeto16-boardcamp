import { Router } from 'express';
import { getCustomers, getCustomerById } from '../controllers/customersControllers.js';
const router = Router();

router.get("/customers", getCustomers);
router.post("/customers:id ", getCustomerById);

export default router;