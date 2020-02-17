import "reflect-metadata";
require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env"
});
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import { Toad } from "./entity/Toad";
import { RSVP } from "./entity/RSVP";
import { User } from "./entity/User";
import { FormResponse } from "./entity/FormResponse";
import { Hunt } from "./entity/Hunt";
import { Survey } from "./entity/Survey";
import { devConfig, doConfig, herokuConfig } from "./config/ormFigs";
//Connects to the Database -> then starts the express
let app: any;
let zeConfig: any;
const { NODE_ENV, SPACE } = process.env;
if (NODE_ENV === "development") {
  zeConfig = devConfig();
} else {
  zeConfig = SPACE === "DO" ? doConfig() : herokuConfig();
}
createConnection({
  ...zeConfig,
  entities: [Toad, RSVP, User, FormResponse, Hunt, Survey]
})
  .then(async (connection: any) => {
    // Create a new express application instance
    app = express();
    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}!`);
    });
  })
  .catch(error => console.log(error));
export default app;
