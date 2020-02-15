import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import toad from "./toad";
import rsvp from "./rsvp";
import guild from "./guild";
// import hunt from "./hunt";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/toad", toad);
routes.use("/rsvp", rsvp);
routes.use("/guild", guild);

// [1, 2, 3, 4, 5, 6].map(r => {
//   routes.use(`/${r}`, hunt);
// });
export default routes;
