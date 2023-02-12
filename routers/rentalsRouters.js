import Router from 'express';
import { getRentals, registerRental } from '../controllers/rentalsControllers.js';
import validateRental from '../middleware/validateRental.js';

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateRental, registerRental);

export default router;