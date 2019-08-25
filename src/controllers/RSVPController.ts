import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

const uuidv4 = require("uuid/v4");
const uuidv3 = require("uuid/v3");
import * as QRCode from "qrcode";

import * as nodemailer from "nodemailer";
import * as inlineBase64 from "nodemailer-plugin-inline-base64";

import { RSVP } from "../entity/RSVP";

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
    return res.send({ qrPng });
    // Send them an email
    let transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      secure: false,
      auth: {
        user: "postmaster@mercury.raptor.pizza", // generated ethereal user
        pass: process.env.MAILGUN_KEY // generated ethereal password
      }
    });

    transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));

    let info = await transporter.sendMail({
      from: "lab boy <postmaster@mercury.raptor.pizza>", // sender address
      to: email, // list of receivers
      subject: "pssssst", // Subject line
      text: "", // plain text body
      html: "<b>psst here is your ticky :)</b>", // html body
      attachments: [
        {
          filename: "aticketforyou!.png",
          content: qrPng.split("base64,")[1],
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
      return res.status(400).send("I don't see an email here!");
    }

    let rsvp = new RSVP();
    rsvp.email = email;
    rsvp.event = "raptorhole";
    rsvp.boop = false;
    // const qrId = uuidv3(email + event, uuidv4());
    const qrId = uuidv3(email + event, process.env.U);
    rsvp.qrId = qrId;
    const rsvpRepo = getRepository(RSVP);

    try {
      await rsvpRepo.save(rsvp);
    } catch (e) {
      return res
        .status(409)
        .send({ error: "yOu haaaaaaaaaAAAve already signed up bro" });
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

    // Send them an email
    // let transporter = nodemailer.createTransport({
    //   host: "smtp.mailgun.org",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: "postmaster@mercury.raptor.pizza", // generated ethereal user
    //     pass: process.env.MAILGUN_KEY // generated ethereal password
    //   }
    // });

    // transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));

    // let info = await transporter.sendMail({
    //   from: "lab boy <postmaster@mercury.raptor.pizza>", // sender address
    //   to: "teh@raptor.pizza", // list of receivers
    //   subject: "pssssst", // Subject line
    //   text: "", // plain text body
    //   html: "<b>psst here is your ticky :)</b>", // html body
    //   attachments: [
    //     {
    //       filename: "aticketforyou!.png",
    //       content: qrPng.split("base64,")[1],
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
