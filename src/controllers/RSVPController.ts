import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { createCanvas, loadImage } from "canvas";
import { chicken65 } from "../base64/constants";

const uuidv3 = require("uuid/v3");
import * as QRCode from "qrcode";

import * as nodemailer from "nodemailer";
import * as inlineBase64 from "nodemailer-plugin-inline-base64";

import { RSVP } from "../entity/RSVP";
import { EmailTemplate } from "./EmailTemplate";
import { User } from "../entity/User";

class RSVPController {
  static resendEmail = async (req: Request, res: Response) => {
    const { email, event } = req.body;
    const rsvpRepo = getRepository(RSVP);
    const rsvp = await rsvpRepo.findOne({ where: { email, event } });

    // send them an email
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      color: { light: "#ff4500" },
      width: 400,
      rendererOpts: {
        quality: 1
      }
    };
    const makeQR = async text => {
      const qr = await QRCode.toDataURL(text, opts);
      return qr;
    };
    console.log("about to make QR");
    const taxonomy = `r${email[0]}s${email[1]}v${email[2]}p`;
    const qrPng = await makeQR(`${taxonomy}?${rsvp.qrId}`);
    // Send them an email
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 1080, 1080);
    const ticketTemplate = await loadImage(chicken65);
    ctx.drawImage(ticketTemplate, 0, 0);
    const qrPNG = await loadImage(qrPng);
    ctx.drawImage(qrPNG, 650, 500);
    const canvasURL = canvas.toDataURL();
    // // Send them an email
    // let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false, // true for 465, false for other ports
      auth: {
        user: "teh@raptor.pizza", // generated ethereal user
        pass: process.env.GOOGLE_MAIL // generated ethereal password
      }
    });

    transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
    let info = await transporter.sendMail({
      from: "teh@raptor.pizza", // sender address
      to: email, // list of receivers
      subject: "VALENCIA ROOM NOV 2", // Subject line
      text: "Hello world?", // plain text body
      html: EmailTemplate(qrPng), // html body
      attachments: [
        {
          filename: "shrOMP.png",
          content: canvasURL.split("base64,")[1],
          encoding: "base64"
        }
      ]
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return res.send({ rsvp });
  };

  static rsvp = async (req: Request, res: Response) => {
    const { email, event } = req.body;
    console.log(email);
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

    // send them an email
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      color: { light: "#ff4500" },
      width: 400,
      rendererOpts: {
        quality: 1
      }
    };
    const makeQR = async text => {
      const qr = await QRCode.toDataURL(text, opts);
      return qr;
    };
    console.log("about to make QR");
    const taxonomy = `r${email[0]}s${email[1]}v${email[2]}p`;
    const qrPng = await makeQR(`${taxonomy}?${qrId}`);
    console.log(qrPng);

    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 1080, 1080);
    const ticketTemplate = await loadImage(chicken65);
    ctx.drawImage(ticketTemplate, 0, 0);
    const qrPNG = await loadImage(qrPng);
    ctx.drawImage(qrPNG, 650, 500);
    const canvasURL = canvas.toDataURL();
    // // Send them an email
    // let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false, // true for 465, false for other ports
      auth: {
        user: "teh@raptor.pizza", // generated ethereal user
        pass: process.env.GOOGLE_MAIL // generated ethereal password
      }
    });

    transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
    // let info = await transporter.sendMail({
    //   from: "teh@raptor.pizza", // sender address
    //   to: email, // list of receivers
    //   subject: "VALENCIA ROOM NOV 2", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: EmailTemplate(qrPng), // html body
    //   attachments: [
    //     {
    //       filename: "shrOMP.png",
    //       content: canvasURL.split("base64,")[1],
    //       encoding: "base64"
    //     }
    //   ]
    // });

    // console.log("Message sent: %s", info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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
