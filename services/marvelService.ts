const MCU_BASE_URL = "https://mcuapi.herokuapp.com/api/v1";

export interface MCUMovie {
  id: number;
  title: string;
  release_date: string;
  box_office: string;
  duration: number;
  overview: string;
  cover_url: string;
  trailer_url: string;
  directed_by: string;
  phase: number;
  saga: string;
  chronology: number;
  post_credit_scenes: number;
}

export const getMovies = async (): Promise<MCUMovie[]> => {
  const response = await fetch(`${MCU_BASE_URL}/movies?limit=50`);
  const data = await response.json();
  return data.data;
};

export const getMovieById = async (id: number): Promise<MCUMovie> => {
  const response = await fetch(`${MCU_BASE_URL}/movies/${id}`);
  return response.json();
};
