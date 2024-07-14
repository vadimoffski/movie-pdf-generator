import express from "express";
import dotenv from "dotenv";

import useRoutes from "./api";

import di from "./utils/dependency-injector";
import { createLogger } from "./utils/logger";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const logger = createLogger(module);

process.on("uncaughtException", (err) => {
  logger.error("SERVICE_ERROR: Uncaught exception ", err);
  // Perform cleanup tasks if necessary
  // Close database connections, release resources, etc.
  process.exit(1); // Exit with non-zero code indicating failure
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`SERVICE_ERROR: Unhandled rejection at ${reason}`);
  // No need to exit process here, unless required
  process.exit(1);
});

di.init();
useRoutes(app);

const server = app.listen(port, () => {
  logger.info(`Server is running on port http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received: Closing server...");

  // Close server to stop accepting new connections
  server.close(async () => {
    logger.info("Server closed.");
    // Perform cleanup tasks if necessary
    // Close database connections, release resources, etc.
    process.exit(0); // Exit with success code
  });
});
