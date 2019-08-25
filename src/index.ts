import "reflect-metadata";
require("dotenv").config();
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
//Connects to the Database -> then starts the express
let app;
createConnection({
  name: "default",
  type: "postgres",
  synchronize: true,
  logging: true,
  url: process.env.DATABASE_URL,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
})
  .then(async connection => {
    // Create a new express application instance
    app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(4000, () => {
      console.log("Server started on port 4000!");
    });
  })
  .catch(error => console.log(error));
export default app;
