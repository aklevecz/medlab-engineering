import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import SurveyController from "../controllers/SurveyController";
const router = Router();

router.post("/", SurveyController.saveResponse);

export default router;
