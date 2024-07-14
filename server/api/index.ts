import { Application, Request, Response, NextFunction, Router } from "express";
import { createLogger } from "../utils/logger";

const logger = createLogger(module);

const getController = async (path: string): Promise<Router> => {
  const router = Router();
  const module = await import(path);
  const controller = module.default;

  router.use(controller);

  return router;
};

const useRoutes = async (app: Application) => {
  const moviesRouter = await getController("./movies");

  app.use("/api/movies", moviesRouter);

  app.use((req: Request, res: Response) => {
    logger.warn(`Unknown API: ${req.path}`);
    res.status(404).send(`Unknown API: ${req.path}`);
  });

  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(`Internal Server Error: ${error.message}`, error.stack);
    const statusCode = error.response.status;
    if (error.response && error.response.status) {
      logger.error(`Error response: ${JSON.stringify(error.response.data)}`);
      return res.status(error.response.status).send(error.response.data);
    }
    res.status(500).send(`Internal Server Error`);
  });
};

export default useRoutes;
