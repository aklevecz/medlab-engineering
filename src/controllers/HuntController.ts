import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { RSVP } from "../entity/RSVP";
import { Toad } from "../entity/Toad";

class HuntController {
  static index = async (req: Request, res: Response) => {
    console.log(req.originalUrl);
    res.send("frog");
  };
}

export default HuntController;
