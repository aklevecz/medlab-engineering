import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import RSVPController from "../controllers/RSVPController";
const router = Router();

router.post("/create", RSVPController.rsvp);
router.post("/boop", RSVPController.boop);
router.post("/resend", RSVPController.resendEmail);
router.post("/boopemail", RSVPController.boopEmail);

export default router;
