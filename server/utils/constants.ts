const TMBD = {
  API_URL: "https://api.themoviedb.org/3",
  IMG_URL: "https://image.tmdb.org/t/p/w500",
};

const PDF = {
  MAIN_TITLE_FS: 20,
  TEXT_FS: 12,
  POPULAR_MOVIES_TITLE: "Popular Movies",
  TITLE_DEFAULT: (movie: string) => `Title: ${movie}`,
  RELEASE_DATE: (date: string) => `Release Date: ${date}`,
  VOTE_AVERAGE: (vote: string) => `Vote Average: ${vote}`,
};

export { TMBD, PDF };
