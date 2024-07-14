import axios, { AxiosInstance, AxiosResponse } from "axios";
import { TMBD } from "./constants";
import { Logger } from "./logger";

class TMBDHelper {
  private apiKey: string;
  private axiosInstance: AxiosInstance;
  private logger: Logger;

  constructor(apiKey: string | undefined, logger: Logger) {
    if (!apiKey) {
      throw new Error(
        "TMDB API key is not defined in the environment variables."
      );
    }

    this.apiKey = apiKey;
    this.axiosInstance = axios.create({
      baseURL: TMBD.API_URL,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    this.logger = logger;
  }

  async getPopularMovies() {
    this.logger.info("Fetching popular movies PDF");
    const response = await this.axiosInstance.get("/movie/popular");
    return response.data.results;
  }

  async getMovieDetails(id: string) {
    this.logger.info(`Fetching movie details PDF for movie ID: ${id}`);

    const response = await this.axiosInstance.get(`/movie/${id}`);

    return response.data;
  }

  async getMovieImage(imagePath: string): Promise<Buffer> {
    this.logger.info(`Fetching movie image for path: ${imagePath}`);

    const imageUrl = `${TMBD.IMG_URL}${imagePath}`;
    const response: AxiosResponse<ArrayBuffer> = await this.axiosInstance.get(
      imageUrl,
      {
        responseType: "arraybuffer",
      }
    );
    const imageBuffer = Buffer.from(response.data);

    return imageBuffer;
  }
}

export default TMBDHelper;
