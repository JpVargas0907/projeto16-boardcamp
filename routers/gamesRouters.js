import { Router } from 'express';
import { searchGames, registerGame } from '../controllers/gamesController.js';

const router = Router();

router.get("/games", searchGames);
router.post("/games", registerGame);

export default router;