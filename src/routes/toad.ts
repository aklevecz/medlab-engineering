import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import ToadController from "../controllers/ToadController";

const router = Router();

// router.post('/', [checkJwt, checkRole(['spore'])], ToadController.createToad)
router.post("/create-toad", [checkJwt], ToadController.createToad);
router.get("/yours", [checkJwt], ToadController.yours);

router.post("/boop", [checkJwt, checkRole(["ADMIN"])], ToadController.boopToad);

export default router;
