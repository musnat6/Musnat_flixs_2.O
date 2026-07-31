export const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "1c73cebe38f966d0f344788d21dc95b4";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
export const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchTrendingMovies: `/trending/movie/week?api_key=${API_KEY}&language=en-US`,
  fetchTrendingTv: `/trending/tv/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchAmazonPrime: `/discover/tv?api_key=${API_KEY}&with_networks=1024`,
  fetchDisneyPlus: `/discover/tv?api_key=${API_KEY}&with_networks=2739`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchAnimeSeries: `/discover/tv?api_key=${API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
  fetchAnimeMovies: `/discover/movie?api_key=${API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
};

export const searchMulti = async (query: string) => {
  if (!query.trim()) return [];
  const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
  if (!response.ok) throw new Error('Search failed');
  const data = await response.json();
  return (data.results || []).filter((item: any) => item.poster_path || item.backdrop_path);
};

export const fetchTvDetails = async (id: number) => {
  const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
  if (!response.ok) throw new Error('Failed to fetch tv details');
  return response.json();
};

export const fetchSeasonDetails = async (tvId: number, seasonNumber: number) => {
  const response = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`);
  if (!response.ok) throw new Error('Failed to fetch season details');
  return response.json();
};

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
  genre_ids?: number[];
}

export interface TMDBEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date?: string;
  runtime?: number | null;
  vote_average?: number;
}

export interface TMDBSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
  air_date?: string;
  episodes?: TMDBEpisode[];
}

