import { Response, Request } from "express";

import { getRepository } from "typeorm";
import { Toad } from "../entity/Toad";
import { User } from "../entity/User";

const uuidv3 = require("uuid/v3");
import * as bcrypt from "bcryptjs";

import Wab3 from "../wab3/Wab3";
import { RSVP } from "../entity/RSVP";
import { sendEmail, makeQR, createCanvasURL, randomInt } from "./utils";

class ToadController {
  static getOneById = async (req: Request, res: Response) => {
    const toadRespository = getRepository(Toad);
    return res.send("meepo");
  };

  static createToad = async (req: Request, res: Response) => {
    let { cat, gen } = req.body;
    const { userId, username } = res.locals.jwtPayload;

    const userRepository = getRepository(User);
    const { email, address } = await userRepository.findOne({
      where: { id: userId }
    });

    // // Maybe each raptor should have a uuid that is used to create a new one with a nonce
    // this will always be the same lol what
    const qrId = uuidv3(username + cat, process.env.U);

    // Creates a toad
    const toadRespository = getRepository(Toad);
    const checkToad = await toadRespository.findOne({
      where: { qrId, owner: userId }
    });
    if (checkToad) {
      return res.send({ message: "chu got a toad yo" });
    }

    // **** COMMENTING OUT TOAD CREATION
    let toad = new Toad();
    toad.owner = userId;
    toad.cat = cat;
    toad.qrId = qrId;
    toad.gen = gen;

    await toadRespository.save(toad);

    const wab3 = new Wab3("geordi");

    const toadtract = wab3.getToadtract();

    const r = randomInt(256);
    const g = randomInt(256);
    const b = randomInt(256);

    const uriData = {
      username,
      qrId: bcrypt.hashSync(qrId, 8),
      r,
      g,
      b
    };

    const tx = toadtract.methods
      .mintWithTokenURI(address, toad.id, JSON.stringify(uriData))
      .send({
        from: process.env.GEORDI_PUB_ADDRESS,
        gas: "100000000"
      });

    // NEED TO EITHER PLACE A MARKER TO SPLIT THE IDs THAT WILL HAVE TWO DIGITS OR THINK OF SOMETHING ELSE
    // RANDOM LETTERS PERHAPS-- BUT STILL NEED TO PICK UP THE ID
    const taxonomy = `t${toad.id * 2}o${toad.id * 3}a${toad.id * 5}d`;
    const combined = `${taxonomy}?${qrId}`;
    const qrPng = await makeQR(combined);

    const canvasURL = await createCanvasURL(qrPng);

    sendEmail(email, qrPng, canvasURL);

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
