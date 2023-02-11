import { Router } from "express";
import gamesRouters from "./gamesRouters.js";
import customersRouters from "./customersRouters.js";

const router = Router();

router.use(gamesRouters);
router.use(customersRouters);

export default router;