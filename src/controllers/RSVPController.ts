import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { makeQR, sendEmail, createCanvasURL } from "./utils";
const uuidv3 = require("uuid/v3");

import { RSVP } from "../entity/RSVP";
import { User } from "../entity/User";

class RSVPController {
  static resendEmail = async (req: Request, res: Response) => {
    const { email, event } = req.body;
    const rsvpRepo = getRepository(RSVP);
    const rsvp = await rsvpRepo.findOne({ where: { email, event } });

    console.log("about to make QR");
    const taxonomy = `r${email[0]}s${email[1]}v${email[2]}p`;
    const qrPng = await makeQR(`${taxonomy}?${rsvp.qrId}`);
    // Send them an email
    const canvasURL = await createCanvasURL(qrPng);

    sendEmail(email, qrPng, canvasURL);

    return res.send({ rsvp });
  };

  static rsvp = async (req: Request, res: Response) => {
    const { email, event } = req.body;
    if (!email) {
      return res.status(400).send("no_email");
    }

    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    if (user) {
      return res.status(409).send({ message: "already_account" });
    }

    let rsvp = new RSVP();
    rsvp.email = email;
    rsvp.event = "raptorhole";
    rsvp.boop = false;
    const qrId = uuidv3(email + event, process.env.U);
    rsvp.qrId = qrId;
    const rsvpRepo = getRepository(RSVP);

    try {
      await rsvpRepo.save(rsvp);
    } catch (e) {
      return res.status(409).send({ message: "already_rsvp" });
    }

    console.log("about to make QR");
    const taxonomy = `r${email[0]}s${email[1]}v${email[2]}p`;
    const qrPng = await makeQR(`${taxonomy}?${qrId}`);

    const canvasURL = await createCanvasURL(qrPng);
    sendEmail(email, qrPng, canvasURL);

    try {
      await rsvpRepo.save(rsvp);
    } catch (e) {
      return res.send({
        data: qrPng,
        message: "you have already signed up but here is your code bro"
      });
    }
    res.send({ data: qrPng, message: "yay!" });
  };

  static boop = async (req: Request, res: Response) => {
    const { result } = req.body;
    console.log("hu", result);
    return result;
  };
}

export default RSVPController;
