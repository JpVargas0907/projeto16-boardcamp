import { Router } from "express";
import gamesRouters from "./gamesRouters.js";

const router = Router();

router.use(gamesRouters);

export default router;