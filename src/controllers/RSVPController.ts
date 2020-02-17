import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { makeQR, sendEmail, createCanvasURL } from "./utils";
const uuidv3 = require("uuid/v3");

import { RSVP } from "../entity/RSVP";
import { User } from "../entity/User";
import { Toad } from "../entity/Toad";
import Wab3 from "../wab3/Wab3";

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
    rsvp.email = email.toLowerCase();
    rsvp.event = "meiosis";
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

    // this looks a little redundant
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

  static boopEmail = async (req: Request, res: Response) => {
    const { email, raptor } = req.body;
    console.log(raptor);
    if (raptor === "raptor") {
      const userRepo = getRepository(User);
      const toadRepo = getRepository(Toad);
      const raptor = await userRepo.findOne({ where: { email } });
      const toad = await toadRepo.findOne({ where: { owner: raptor.id } });
      toad.boop = true;
      await toadRepo.save(toad);
      const wab3 = new Wab3("geordi");
      const toadtract = await wab3.getToadtract();
      toadtract.methods.boopIt(toad.id).send({
        from: process.env.GEORDI_PUB_ADDRESS,
        gas: "100000000"
      });
      return res.send({ toad });
    } else {
      const rsvpRepo = getRepository(RSVP);
      const rsvp = await rsvpRepo.findOne({ where: { email } });
      rsvp.boop = true;
      await rsvpRepo.save(rsvp);
      return res.send({ rsvp });
    }
    return res.send({ raptor });
  };
}

export default RSVPController;
