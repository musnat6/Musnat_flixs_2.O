import { Play, Star, Film, Tv, Sparkles, X, Loader2 } from 'lucide-react';
import { TMDBMovie, POSTER_BASE_URL } from '../tmdb';

interface SearchResultsProps {
  query: string;
  results: TMDBMovie[];
  isLoading: boolean;
  onPlay: (movie: TMDBMovie, type: 'movie' | 'tv') => void;
  onClear: () => void;
}

export default function SearchResults({ query, results, isLoading, onPlay, onClear }: SearchResultsProps) {
  return (
    <div className="px-4 md:px-12 pt-28 pb-12 min-h-screen bg-[#050505]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <span>Search Results for</span>
            <span className="text-[#E50914] underline decoration-red-600/50">"{query}"</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Found {results.length} titles (movies, TV series, anime)
          </p>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition border border-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Clear Search</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-[#E50914] animate-spin" />
          <span className="text-sm text-gray-400 font-semibold tracking-wider uppercase">Searching titles...</span>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#0a0a0a] rounded-2xl border border-white/5 p-8">
          <Film className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No results found for "{query}"</h3>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            Try checking for typos or searching with different keywords, movie titles, or Japanese anime titles.
          </p>
          <button
            onClick={onClear}
            className="bg-[#E50914] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition"
          >
            Explore Popular Content
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {results.map((item) => {
            const isTv = item.media_type === 'tv' || !item.title;
            const title = item.title || item.name || item.original_name || 'Untitled';
            const releaseDate = item.release_date || item.first_air_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
            const posterUrl = item.poster_path 
              ? `${POSTER_BASE_URL}${item.poster_path}`
              : item.backdrop_path 
                ? `${POSTER_BASE_URL}${item.backdrop_path}` 
                : 'https://via.placeholder.com/500x750?text=No+Poster';

            const isAnime = item.genre_ids?.includes(16) || item.original_name?.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf]/);

            return (
              <div
                key={item.id}
                onClick={() => onPlay(item, isTv ? 'tv' : 'movie')}
                className="group relative bg-[#121212] rounded-xl overflow-hidden border border-white/5 hover:border-[#E50914]/50 transition duration-300 cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:shadow-red-950/20"
              >
                <div className="relative aspect-[2/3] w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={posterUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    {isAnime ? (
                      <span className="bg-purple-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        ANIME
                      </span>
                    ) : isTv ? (
                      <span className="bg-blue-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1">
                        <Tv className="w-2.5 h-2.5" />
                        TV SERIES
                      </span>
                    ) : (
                      <span className="bg-red-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1">
                        <Film className="w-2.5 h-2.5" />
                        MOVIE
                      </span>
                    )}
                  </div>

                  {item.vote_average ? (
                    <div className="absolute top-2 right-2 bg-black/80 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md flex items-center gap-1 border border-amber-500/20">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  ) : null}

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-red-400 transition">
                    {title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 font-medium">
                    <span>{year || 'N/A'}</span>
                    <span className="text-red-500 font-bold group-hover:underline">Watch Now →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
