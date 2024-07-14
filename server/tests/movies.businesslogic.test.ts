import MoviesBusinessLogic from "../api/movies/movies.business-logic";
import TMBDHelper from "../utils/tmbd.helper";
import { Logger } from "../utils/logger";

class TMBDHelperMock extends TMBDHelper {
  constructor() {
    super("mock-api-key", console as unknown as Logger);
  }

  getPopularMovies = jest.fn().mockResolvedValue([
    { title: "Movie 1", id: 1, release_date: "2024-01-01", vote_average: 7.5 },
    { title: "Movie 2", id: 2, release_date: "2024-02-01", vote_average: 8.0 },
  ]);

  getMovieDetails = jest.fn().mockImplementation((id: string) => {
    return Promise.resolve({
      title: "Movie 123",
      release_date: "2024-03-01",
      vote_average: 7.2,
    });
  });

  getMovieImage = jest
    .fn()
    .mockResolvedValue(Buffer.from("image data", "utf-8"));
}

const loggerMock: Logger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
};

describe("MoviesBusinessLogic", () => {
  let moviesBusinessLogic: MoviesBusinessLogic;
  let tmdbHelperMock: TMBDHelperMock;

  beforeEach(() => {
    tmdbHelperMock = new TMBDHelperMock();
    moviesBusinessLogic = new MoviesBusinessLogic(tmdbHelperMock, loggerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch popular movies as PDF", async () => {
    const pdfBuffer = await moviesBusinessLogic.fetchPopularMoviesPDF();
    expect(pdfBuffer instanceof Buffer).toBe(true);
  });

  it("should fetch movie details as PDF", async () => {
    const pdfBuffer = await moviesBusinessLogic.getMovieDetailsPDF("123");
    expect(pdfBuffer instanceof Buffer).toBe(true);
  });
});
