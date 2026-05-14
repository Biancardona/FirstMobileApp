// TMDB filtra películas del MCU por el ID de colección/compañía de Marvel Studios
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "c3db8231904bc02b7a4a9ddf61876f38"; // <-- pega tu key aquí
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export interface MCUMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  cover_url: string; // campo unificado para la UI
  backdrop_url: string;
}

// Convierte la respuesta de TMDB al formato que usa la app
const mapMovie = (item: any): MCUMovie => ({
  id: item.id,
  title: item.title,
  overview: item.overview,
  release_date: item.release_date,
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,
  vote_average: item.vote_average,
  vote_count: item.vote_count,
  cover_url: item.poster_path ? `${IMG_URL}${item.poster_path}` : "",
  backdrop_url: item.backdrop_path ? `${IMG_URL}${item.backdrop_path}` : "",
});

// Películas de Marvel Studios (company_id = 420)
export const getMovies = async (): Promise<MCUMovie[]> => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=420&sort_by=release_date.asc&language=es-MX`,
  );
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  return data.results.map(mapMovie);
};

// Detalle de una película
export const getMovieById = async (id: number): Promise<MCUMovie> => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-MX`,
  );
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  return mapMovie(data);
};
