/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Middlewares
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/notFound.middleware";

// Routes
import { appointmentsRouter } from "./appointments/appointments.router";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

// Middlewares
app.use(errorHandler);
app.use(notFoundHandler);

// Routes
app.use("/appointments", appointmentsRouter);

/**
 * Server Activation
 */

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
