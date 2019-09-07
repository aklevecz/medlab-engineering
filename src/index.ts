import "reflect-metadata";
require("dotenv").config();
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import { Toad } from "./entity/Toad";
import { RSVP } from "./entity/RSVP";
import { User } from "./entity/User";
//Connects to the Database -> then starts the express
let app;
const herokuConfig = {
  name: "default",
  type: "postgres",
  synchronize: true,
  logging: true,
  url: process.env.DATABASE_URL,
  entities: [Toad, RSVP, User]
};

const ormFig =
  process.env.NODE_ENV === "production"
    ? {
        name: "default",
        type: "postgres",
        synchronize: false,
        logging: false,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
      }
    : null;

console.log(ormFig);
createConnection(null)
  .then(async connection => {
    // Create a new express application instance
    app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server started on port 4000!");
    });
  })
  .catch(error => console.log(error));
export default app;
