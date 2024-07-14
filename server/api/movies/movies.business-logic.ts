import PDFDocument from "pdfkit";
import TMBDHelper from "../../utils/tmbd.helper";
import { Logger } from "../../utils/logger";
import { PDF } from "../../utils/constants";

class MoviesBusinessLogic {
  private tmdbApi: TMBDHelper;
  private logger: Logger;

  constructor(tmdbApi: TMBDHelper, logger: Logger) {
    this.tmdbApi = tmdbApi;
    this.logger = logger;
  }

  async fetchPopularMoviesPDF(): Promise<Buffer> {
    const movies = await this.tmdbApi.getPopularMovies();
    const doc = new PDFDocument();
    let buffers: any[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      return Buffer.concat(buffers);
    });

    doc
      .fontSize(PDF.MAIN_TITLE_FS)
      .text(PDF.POPULAR_MOVIES_TITLE, { underline: true });

    doc.moveDown();

    movies.forEach(
      (movie: {
        title: any;
        id: any;
        release_date: any;
        vote_average: any;
      }) => {
        doc.fontSize(12).text(PDF.TITLE_DEFAULT(movie.title), {
          link: `http://localhost:${process.env.PORT}/api/movies/${movie.id}`,
          underline: true,
        });
        doc.text(PDF.RELEASE_DATE(movie.release_date));
        doc.text(PDF.VOTE_AVERAGE(movie.vote_average));
        doc.moveDown();
      }
    );

    doc.end();
    return new Promise((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
    });
  }

  async getMovieDetailsPDF(id: string): Promise<Buffer> {
    const movie = await this.tmdbApi.getMovieDetails(id);
    const doc = new PDFDocument();
    let buffers: any[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      let pdfData = Buffer.concat(buffers);
      return pdfData;
    });

    doc.fontSize(PDF.MAIN_TITLE_FS).text(movie.title, { underline: true });
    doc.moveDown();
    doc.fontSize(PDF.TEXT_FS).text(PDF.RELEASE_DATE(movie.release_date));
    doc.text(PDF.VOTE_AVERAGE(movie.vote_average));
    doc.moveDown();

    if (movie.poster_path) {
      const imageBuffer = await this.tmdbApi.getMovieImage(movie.poster_path);
      doc.image(imageBuffer, {
        fit: [250, 400],
        align: "center",
        valign: "center",
      });
    }

    doc.end();
    return new Promise((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
    });
  }
}

export default MoviesBusinessLogic;
