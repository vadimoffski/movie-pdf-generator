import TMBDHelper from "./tmbd.helper";
import MoviesBusinessLogic from "../api/movies/movies.business-logic";

import { createLogger } from "./logger";

const API_KEY = process.env.TMDB_API_TOKEN;
const logger = createLogger(module);

class DIContainer {
  private factories = new Map<string, (container: DIContainer) => any>();

  factory<T>(name: string, factory: (container: DIContainer) => T): void {
    this.factories.set(name, factory);
  }

  get<T>(name: string): T {
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Factory not found for: ${name}`);
    }
    return factory(this) as T;
  }

  createProxy(): any {
    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === "string" && target.factories.has(prop)) {
          return target.get(prop);
        }
        return (target as any)[prop];
      },
    });
  }
}

const di = new DIContainer();

const init = () => {
  di.factory("TMDBHelper", () => new TMBDHelper(API_KEY, logger));

  di.factory("MoviesBusinessLogic", (container) => {
    const tmdbHelper = container.get<TMBDHelper>("TMDBHelper");
    return new MoviesBusinessLogic(tmdbHelper, logger);
  });
};

export default { init, container: di };
