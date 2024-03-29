import Router from 'express';
import { deleteRental, finalizeRental, getRentals, registerRental } from '../controllers/rentalsControllers.js';
import validateRental from '../middleware/validateRental.js';

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateRental, registerRental);
router.post("/rentals/:id/return", finalizeRental);
router.delete("/rentals/:id", deleteRental);

export default router;