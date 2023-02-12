import { Router } from "express";
import gamesRouters from "./gamesRouters.js";
import customersRouters from "./customersRouters.js";
import rentalsRouters from "./rentalsRouters.js";

const router = Router();

router.use(gamesRouters);
router.use(customersRouters);
router.use(rentalsRouters);

export default router;