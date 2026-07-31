import { X, Play } from 'lucide-react';
import { useEffect } from 'react';
import { TMDBMovie, IMAGE_BASE_URL } from '../tmdb';

interface MovieDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: TMDBMovie | null;
  onPlay: () => void;
}

export default function MovieDetailsModal({ isOpen, onClose, movie, onPlay }: MovieDetailsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const title = movie.title || movie.name || movie.original_name;
  const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose}
      />
      
      <div className="w-full max-w-4xl bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl border border-white/10 relative z-10 flex flex-col my-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition z-20 cursor-pointer backdrop-blur-md border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="w-full aspect-video md:aspect-[21/9] relative bg-zinc-900 flex-shrink-0">
          <img 
            src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
              {title}
            </h1>
            <button 
              onClick={onPlay}
              className="bg-[#E50914] text-white px-6 md:px-8 py-2 md:py-3 rounded-md font-bold flex items-center space-x-2 hover:bg-[#b80710] transition-colors cursor-pointer shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              <span className="text-base md:text-lg tracking-wide">Play</span>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto">
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="text-green-500">{Math.round((movie.vote_average || 8) * 10)}% Match</span>
              <span className="text-gray-300">{year}</span>
              <span className="border border-white/30 px-1.5 rounded-sm text-gray-300">HD</span>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {movie.overview || "No overview available for this title."}
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <span className="text-gray-500">Cast: </span>
              <span className="text-gray-300">Data unavailable</span>
            </div>
            <div>
              <span className="text-gray-500">Genres: </span>
              <span className="text-gray-300">Action, Thriller, Drama</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
