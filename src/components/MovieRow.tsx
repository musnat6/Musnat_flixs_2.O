import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { BASE_URL, TMDBMovie, IMAGE_BASE_URL, POSTER_BASE_URL } from '../tmdb';

interface MovieRowProps {
  title: string;
  fetchUrl: string;
  numbered?: boolean;
  isLargeRow?: boolean;
  onPlay: (movie: TMDBMovie, type: 'movie' | 'tv') => void;
}

export default function MovieRow({ title, fetchUrl, numbered = false, isLargeRow = false, onPlay }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<TMDBMovie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}${fetchUrl}`);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      }
    };
    fetchData();
  }, [fetchUrl]);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 md:px-12 py-4 relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-white/90 uppercase transition hover:text-white cursor-pointer inline-block drop-shadow-md">
          {title}
        </h2>
        <div className="hidden md:flex space-x-2">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition items-center justify-center hover:bg-black/80 cursor-pointer text-white backdrop-blur-sm rounded-r-md"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div 
          ref={rowRef}
          className="flex gap-3 md:gap-4 overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory scroll-smooth py-4 -my-4 px-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            ((isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)) && (
            <div 
              key={movie.id} 
              onClick={() => onPlay(movie, movie.media_type === 'tv' || movie.first_air_date ? 'tv' : 'movie')}
              className={`flex-none snap-center md:snap-align-none ${isLargeRow ? 'w-[140px] sm:w-[180px] md:w-[220px] aspect-[2/3]' : 'w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] aspect-video'} bg-[#1a1a1a] relative rounded-lg overflow-hidden border border-white/5 cursor-pointer transition-transform duration-300 md:hover:scale-110 md:hover:z-50 origin-center shadow-lg group/card`}
            >
              <img 
                src={`${isLargeRow ? POSTER_BASE_URL : IMAGE_BASE_URL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                alt={movie.title || movie.name}
                className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 md:via-black/20 to-transparent md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity scale-50 group-hover/card:scale-100 duration-300">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>

                <h3 className="text-white font-bold text-sm md:text-base mb-1 italic tracking-tight uppercase line-clamp-1 relative z-10">{movie.title || movie.name}</h3>
                <div className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest font-semibold flex-wrap relative z-10">
                  <span className="text-green-500">{Math.round(movie.vote_average * 10)}% Match</span>
                  <span className="border border-white/30 px-1 text-gray-300 rounded-sm">16+</span>
                  <span className="text-gray-400">{(movie.release_date || movie.first_air_date || '').substring(0, 4)}</span>
                </div>
              </div>
              {numbered && (
                <div className="absolute bottom-1 md:bottom-2 left-2 md:left-3 font-black text-5xl md:text-7xl italic text-white/40 tracking-tighter pointer-events-none mix-blend-overlay z-20">
                  {index + 1}
                </div>
              )}
            </div>
            )
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition items-center justify-center hover:bg-black/80 cursor-pointer text-white backdrop-blur-sm rounded-l-md"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
