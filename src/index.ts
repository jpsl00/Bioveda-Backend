import "reflect-metadata";

import * as dotenv from "dotenv";
import { createConnection } from "typeorm";

// Express + Middleware
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes";

//import { User } from "./entity/User";

dotenv.config();

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    app.use("/", routes);

    // setup express app here
    // ...

    // start express server
    const PORT = process.argv.splice(4)[0] || process.env.PORT || 3000;
    app.listen(PORT);

    // insert new users for test
    /* await connection.manager.save(
      connection.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27,
      })
    );
    await connection.manager.save(
      connection.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24,
      })
    ); */

    console.log(
      `Express server has started on port ${PORT}. Open http://localhost:${PORT}/users to see results`
    );
  })
  .catch((error) => console.log(error));
