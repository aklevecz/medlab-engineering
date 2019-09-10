import * as nodemailer from "nodemailer";
import * as inlineBase64 from "nodemailer-plugin-inline-base64";
import * as QRCode from "qrcode";

import { EmailTemplate } from "./EmailTemplate";
import { createCanvas, loadImage } from "canvas";
import { chicken65 } from "../base64/constants";

export const createCanvasURL = async qrPng => {
  const canvas = createCanvas(576, 1120);
  const ctx = canvas.getContext("2d");
  const ticketTemplate = await loadImage(chicken65);
  ctx.drawImage(ticketTemplate, 0, 0);
  const qrPNG = await loadImage(qrPng);
  ctx.drawImage(qrPNG, 88, 360);
  const canvasURL = canvas.toDataURL();
  return canvasURL;
};

const opts = {
  errorCorrectionLevel: "H",
  type: "image/jpeg",
  color: { light: "#ff4500" },
  width: 400,
  rendererOpts: {
    quality: 1
  }
};
export const makeQR = async text => {
  const qr = await QRCode.toDataURL(text, opts);
  return qr;
};

export const sendEmail = async (email, qrPng, canvasURL) => {
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
    text: "THIS IS YOUR RSVP", // plain text body
    html: EmailTemplate(qrPng, email), // html body
    attachments: [
      {
        filename: `${email.split("@")[0]}_ticky.png`,
        content: canvasURL.split("base64,")[1],
        encoding: "base64"
      }
    ]
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export const randomInt = max => {
  return Math.floor(Math.random() * (max + 1));
};
