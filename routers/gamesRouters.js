import { Router } from 'express';
import { searchGames, registerGame } from '../controllers/gamesController.js';
import validateGame from '../middleware/validateGame.js';

const router = Router();

router.get("/games", searchGames);
router.post("/games", validateGame , registerGame);

export default router;