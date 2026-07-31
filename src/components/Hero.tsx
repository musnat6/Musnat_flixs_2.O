import { Play, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BASE_URL, TMDBMovie, IMAGE_BASE_URL, requests } from '../tmdb';

interface HeroProps {
  onPlay: (movie: TMDBMovie, type: 'movie' | 'tv') => void;
}

export default function Hero({ onPlay }: HeroProps) {
  const [movie, setMovie] = useState<TMDBMovie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}${requests.fetchNetflixOriginals}`);
        const data = await response.json();
        // Randomly pick one of the trending originals to showcase
        setMovie(data.results[Math.floor(Math.random() * data.results.length - 1)]);
      } catch (error) {
        console.error("Failed to fetch hero movie", error);
      }
    };
    fetchData();
  }, []);

  if (!movie) {
    return <div className="relative h-[75vh] md:h-[90vh] w-full flex-shrink-0 bg-[#1a1a1a] animate-pulse"></div>;
  }

  const title = movie.title || movie.name || movie.original_name;

  return (
    <div className="relative h-[75vh] md:h-[90vh] w-full flex-shrink-0">
      <div className="absolute inset-0 bg-[#1a1a1a]">
        <img 
          src={`${IMAGE_BASE_URL}${movie.backdrop_path}`} 
          alt={title} 
          className="w-full h-full object-cover opacity-60 md:opacity-70 object-top md:object-center"
        />
        {/* Gradients for text readability and seamless transition to rows */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/70 md:from-[#050505] md:via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-end px-4 md:px-12 pb-20 md:pb-32 max-w-3xl">
        <div className="mb-2 md:mb-4 flex items-center space-x-2 md:space-x-3">
          <span className="px-1.5 md:px-2 py-0.5 border border-white/40 text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-white">N-Original</span>
          <span className="text-[10px] md:text-xs text-gray-400 font-semibold tracking-widest">SERIES</span>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-3 md:mb-4 italic text-white drop-shadow-2xl">
          {title}
        </h1>
        <p className="max-w-md text-gray-300 text-sm md:text-base leading-relaxed mb-6 md:mb-8 drop-shadow-md line-clamp-3 md:line-clamp-none">
          {movie.overview}
        </p>
        <div className="flex gap-3 md:gap-4">
          <button 
            onClick={() => onPlay(movie, 'tv')}
            className="flex-1 md:flex-none justify-center bg-white text-black px-4 md:px-8 py-2 md:py-3 rounded-md font-bold flex items-center space-x-2 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            <span className="text-sm md:text-lg">Play Now</span>
          </button>
          <button className="flex-1 md:flex-none justify-center bg-white/20 backdrop-blur-md text-white px-4 md:px-8 py-2 md:py-3 rounded-md font-bold flex items-center space-x-2 hover:bg-white/30 transition-colors cursor-pointer">
            <Info className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-lg">More Info</span>
          </button>
        </div>
      </div>
      
      <div className="absolute right-0 bottom-24 md:bottom-32 px-4 md:px-12 border-l border-white/20 hidden md:block z-20">
        <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Rating</span>
        <span className="block text-sm font-light italic tracking-tight text-white">{Math.round(movie.vote_average * 10) / 10} / 10</span>
      </div>
    </div>
  );
}
