import { Response, Request } from "express";

import { getRepository } from "typeorm";
import { Toad } from "../entity/Toad";
import { User } from "../entity/User";

const uuidv4 = require("uuid/v4");
const uuidv3 = require("uuid/v3");
import * as bcrypt from "bcryptjs";

import * as nodemailer from "nodemailer";
import * as QRCode from "qrcode";
import * as inlineBase64 from "nodemailer-plugin-inline-base64";
import Wab3 from "../wab3/Wab3";

class ToadController {
  static getOneById = async (req: Request, res: Response) => {
    const toadRespository = getRepository(Toad);
    return res.send("meepo");
  };

  static createToad = async (req: Request, res: Response) => {
    let { cat } = req.body;
    const { userId, username } = res.locals.jwtPayload;

    // const userRepository = getRepository(User)
    // const { email } = await userRepository.findOne({ where: { id: userId } })

    // // Maybe each raptor should have a uuid that is used to create a new one with a nonce
    const qrId = uuidv3(username, uuidv4());

    // Creates a toad
    const toadRespository = getRepository(Toad);
    let toad = new Toad();
    toad.owner = userId;
    toad.cat = cat;
    toad.qrId = qrId;

    await toadRespository.save(toad);

    const wab3 = new Wab3("geordi");
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
        from: "0xe351f32F4d0Ac84AD3B382E6B7e23F3fDF28D639",
        gas: "100000000"
      });

    // EMAIL LOGIC &&&&
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      rendererOpts: {
        quality: 0.3
      }
    };

    const makeQR = async text => {
      const qr = await QRCode.toDataURL(text, opts);
      return qr;
    };

    const qrPng = await makeQR(`${toad.id}?${qrId}`);
    // // Send them an email
    // let testAccount = await nodemailer.createTestAccount();
    // let transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: "teh@raptor.pizza", // generated ethereal user
    //     pass: "nkmttanypzbpktbr" // generated ethereal password
    //   }
    // });

    // transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));

    // const email = "arielklevecz@gmail.com";
    // let info = await transporter.sendMail({
    //   from: "teh@raptor.pizza", // sender address
    //   to: email, // list of receivers
    //   subject: "Hello ✔", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: "<b>Hello world?</b>", // html body
    //   attachments: [
    //     {
    //       filename: "shrOMP.png",
    //       content: qrPng.split("base64,")[1],
    //       encoding: "base64"
    //     }
    //   ]
    // });

    // console.log("Message sent: %s", info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // EMAIL LOGIC &&&&

    // send the QR back to be viewed
    res.set("Content-Type", "text/html");
    res.send(`<img src=${qrPng}></img>`);
  };

  static yours = async (req: Request, res: Response) => {
    const { username, userId } = res.locals.jwtPayload;
    const toadRespository = getRepository(Toad);
    const yours = await toadRespository.find({ where: { owner: userId } });
    console.log(yours);
    res.send(yours);
  };

  static boopToad = async (req: Request, res: Response) => {
    const { qr } = req.body;
    const qrSplit = qr.split("?");
    const tokenId = qrSplit[0];
    const wab3 = new Wab3("geordi");
    const toadtract = await wab3.getToadtract();
    const qrResp = await toadtract.methods.tokenURI(tokenId).call();
    const { qrId } = JSON.parse(qrResp);
    if (bcrypt.compareSync(qrSplit[1], qrId)) {
      const boopResp = await toadtract.methods.boopIt(tokenId).send({
        from: "0xe351f32F4d0Ac84AD3B382E6B7e23F3fDF28D639",
        gas: "100000000"
      });
    }
    res.send({ qrId });
  };
}

export default ToadController;
