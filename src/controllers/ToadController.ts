import { Response, Request } from "express";

import { getRepository } from "typeorm";
import { Toad } from "../entity/Toad";
import { User } from "../entity/User";

const uuidv4 = require("uuid/v4");
const uuidv3 = require("uuid/v3");
import * as bcrypt from "bcryptjs";
import { createCanvas, loadImage } from "canvas";
import { chicken65 } from "../base64/constants";
import { EmailTemplate } from "./EmailTemplate";

import * as nodemailer from "nodemailer";
import * as QRCode from "qrcode";
import * as inlineBase64 from "nodemailer-plugin-inline-base64";
import Wab3 from "../wab3/Wab3";
import { RSVP } from "../entity/RSVP";

class ToadController {
  static getOneById = async (req: Request, res: Response) => {
    const toadRespository = getRepository(Toad);
    return res.send("meepo");
  };

  static createToad = async (req: Request, res: Response) => {
    let { cat } = req.body;
    const { userId, username } = res.locals.jwtPayload;

    const userRepository = getRepository(User);
    const { email } = await userRepository.findOne({ where: { id: userId } });

    // // Maybe each raptor should have a uuid that is used to create a new one with a nonce
    // this will always be the same lol what
    console.log(username);
    const qrId = uuidv3(username + cat, process.env.U);

    // Creates a toad
    const toadRespository = getRepository(Toad);
    const checkToad = await toadRespository.findOne({
      where: { qrId, owner: userId }
    });
    console.log(checkToad);
    if (checkToad) {
      return res.send({ message: "chu got a toad yo" });
    }

    console.log(qrId);
    // **** COMMENTING OUT TOAD CREATION
    let toad = new Toad();
    toad.owner = userId;
    toad.cat = cat;
    toad.qrId = qrId;

    await toadRespository.save(toad);

    const wab3 = new Wab3("geordi");

    console.log(wab3.wab3.eth.getAccounts().then(console.log));
    const toadtract = wab3.getToadtract();
    console.log(toad.id, qrId);
    const testAccount = "0xdE6b38c22C94dbcA3Eb382747b5648C5c5f13641";
    const uriData = {
      username,
      qrId: bcrypt.hashSync(qrId, 8)
    };
    console.log(uriData);
    const tx = toadtract.methods
      .mintWithTokenURI(testAccount, toad.id, JSON.stringify(uriData))
      .send({
        from: process.env.GEORDI_PUB_ADDRESS,
        gas: "100000000"
      });

    // *******

    // EMAIL LOGIC &&&&
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

    // NEED TO EITHER PLACE A MARKER TO SPLIT THE IDs THAT WILL HAVE TWO DIGITS OR THINK OF SOMETHING ELSE
    // RANDOM LETTERS PERHAPS-- BUT STILL NEED TO PICK UP THE ID
    const taxonomy = `t${toad.id * 2}o${toad.id * 3}a${toad.id * 5}d`;
    const combined = `${taxonomy}?${qrId}`;
    const qrPng = await makeQR(combined);

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

    // console.log("Message sent: %s", info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // EMAIL LOGIC &&&&

    // send the QR back to be viewed
    res.send({ qrPng });
  };

  static yours = async (req: Request, res: Response) => {
    // in this case keep it the single toad for this one thing
    // then like do other stuff ok?
    const { userId } = res.locals.jwtPayload;
    const toadRespository = getRepository(Toad);
    const yours = await toadRespository.findOne({ where: { owner: userId } });
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

    // NEED TO EITHER PLACE A MARKER TO SPLIT THE IDs THAT WILL HAVE TWO DIGITS OR THINK OF SOMETHING ELSE
    // RANDOM LETTERS PERHAPS-- BUT STILL NEED TO PICK UP THE ID
    const taxonomy = `t${yours.id * 2}o${yours.id * 3}a${yours.id * 5}d`;
    const qrPng = await makeQR(`${taxonomy}?${yours.qrId}`);
    res.send([{ qrPng, id: yours.id }]);
  };

  static boopToad = async (req: Request, res: Response) => {
    console.log(req.body);
    console.log("WHAT THE FUK", process.env.TOAD_ADDRESS);
    const { qr } = req.body;
    const qrSplit = qr.split("?");
    const taxonomy = qrSplit[0];
    const givenQR = qrSplit[1];
    console.log(givenQR);
    // WAIT IS THIS NOT LOGICAL IF THE NUMBER IS TWO DIGITS YOU DUMMY
    const type = taxonomy[0];
    if (type === "t") {
      const tokenId = parseInt(taxonomy.split("o")[0].split("t")[1]) / 2;
      console.log(tokenId, givenQR);
      const wab3 = new Wab3("geordi");
      const toadtract = await wab3.getToadtract();
      const qrResp = await toadtract.methods.tokenURI(tokenId).call();
      console.log(qrResp);
      const { qrId } = JSON.parse(qrResp);
      console.log(qrId);
      if (bcrypt.compareSync(qrSplit[1], qrId)) {
        const toadRepo = getRepository(Toad);
        console.log("looking for toad");
        const toad = await toadRepo.findOne(tokenId);
        console.log(toad);
        // don't really need to await this if the bcrypt checks out and it hasn't been booped
        toadtract.methods.boopIt(tokenId).send({
          from: process.env.GEORDI_PUB_ADDRESS,
          gas: "100000000"
        });

        toad.boop = true;
        toadRepo.save(toad);
        console.log("toad saved");
        return res.send({ qrId });
      }
    } else if (type === "r") {
      const rsvpRepo = getRepository(RSVP);
      const rsvp = await rsvpRepo.findOne({ where: { qrId: givenQR } });

      if (!rsvp) {
        return res.status(409).send("nada here");
      }

      rsvp.boop = true;

      await rsvpRepo.save(rsvp);

      return res.send({ data: rsvp });
    } else {
      res.send({ data: "nonpe" });
    }
  };
}

export default ToadController;
