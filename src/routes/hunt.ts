import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import HuntController from "../controllers/HuntController";
const router = Router();

router.get("/", HuntController.index);

export default router;
