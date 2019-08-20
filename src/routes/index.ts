import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import toad from "./toad";
import rsvp from "./rsvp";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/toad", toad);
routes.use("/rsvp", rsvp);

export default routes;
