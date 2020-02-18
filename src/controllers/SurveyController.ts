import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { RSVP } from "../entity/RSVP";
import { Toad } from "../entity/Toad";
import { Survey } from "../entity/Survey";
import * as fuzzysort from "fuzzysort";

const pretzeler = async response => {
  const result = await fuzzysort.go(response, [
    "these pretzels are making me thirsty"
  ]);
  if (result[0].score > -100) {
    return true;
  }
  return false;
};

class SurveyController {
  static saveResponse = async (req: Request, res: Response) => {
    const { cat, response } = req.body;
    const surveyRepo = getRepository(Survey);
    const survey = new Survey();
    survey.cat = cat;
    survey.response = response.trim();
    surveyRepo.save(survey);
    const isPretzel = await pretzeler(response.trim());
    if (isPretzel) return res.send({ message: "pretzel_saved" });
    res.send({ message: "response_saved" });
  };
}

export default SurveyController;
