import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { RSVP } from "../entity/RSVP";
import { Toad } from "../entity/Toad";
import { Survey } from "../entity/Survey";

class SurveyController {
  static saveResponse = async (req: Request, res: Response) => {
    const { cat, response } = req.body;
    const surveyRepo = getRepository(Survey);
    const survey = new Survey();
    survey.cat = cat;
    survey.response = response.trim();
    surveyRepo.save(survey);
    res.send({ message: "response_saved" });
  };
}

export default SurveyController;
