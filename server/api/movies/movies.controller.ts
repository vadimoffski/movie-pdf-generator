import { NextFunction, Request, Response } from "express";
import di from "../../utils/dependency-injector";

const { MoviesBusinessLogic } = di.container.createProxy();

export default class MoviesController {
  static async getMovies(_req: Request, res: Response, next: NextFunction) {
    try {
      const response = await MoviesBusinessLogic.fetchPopularMoviesPDF();

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=popular_movies.pdf"
      );
      res.setHeader("Content-Type", "application/pdf");
      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMovieById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const response = await MoviesBusinessLogic.getMovieDetailsPDF(id);

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=movie_details.pdf"
      );
      res.setHeader("Content-Type", "application/pdf");
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
