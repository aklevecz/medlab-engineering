import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FormResponse } from "../entity/FormResponse";

class GuildController {
  static getResponses = async (req: Request, res: Response) => {
    const { category } = req.params;
    const formResRepo = getRepository(FormResponse);

    const responses = await formResRepo.find({ where: { category } });

    return res.send({ responses });
  };
  static recordResponse = async (req: Request, res: Response) => {
    const { name, email, why, category } = req.body;
    if (!name || !email || !why) {
      return res.status(409).send({ error: "one of the fields was blank" });
    }
    const formResponse = new FormResponse();
    formResponse.name = name;
    formResponse.email = email;
    formResponse.why = why;
    formResponse.category = category;
    const formResRepo = getRepository(FormResponse);
    await formResRepo.save(formResponse);

    return res.send({ status: "success", name });
  };
}

export default GuildController;
