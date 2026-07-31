import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db, collection, query, where, orderBy, getDocs } from '../lib/firebase';
import { Play, Tv, Film } from 'lucide-react';
import { TMDBMovie, POSTER_BASE_URL } from '../tmdb';

interface WatchHistoryItem {
  userId: string;
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string;
  lastWatchedSeason: number | null;
  lastWatchedEpisode: number | null;
  timestamp: any;
}

interface WatchHistoryRowProps {
  onPlay: (movie: TMDBMovie, type: 'movie' | 'tv') => void;
}

export default function WatchHistoryRow({ onPlay }: WatchHistoryRowProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const historyRef = collection(db, 'watch_history');
        const q = query(
          historyRef,
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const historyData: WatchHistoryItem[] = [];
        querySnapshot.forEach((doc) => {
          historyData.push(doc.data() as WatchHistoryItem);
        });
        
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (!user || history.length === 0) return null;

  return (
    <div className="px-4 md:px-12 py-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Continue Watching</h2>
      
      <div className="flex space-x-4 overflow-y-hidden overflow-x-auto scrollbar-hide py-4 -my-4 [&::-webkit-scrollbar]:hidden snap-x">
        {history.map((item) => {
          const posterUrl = item.posterPath 
            ? `${POSTER_BASE_URL}${item.posterPath}` 
            : 'https://via.placeholder.com/500x750?text=No+Poster';

          const mockTMDBMovie = {
            id: item.tmdbId,
            title: item.title,
            poster_path: item.posterPath,
            media_type: item.type,
          } as TMDBMovie;

          return (
            <div 
              key={`${item.tmdbId}-${item.type}`}
              className="flex-none w-[160px] sm:w-[200px] md:w-[240px] relative group cursor-pointer snap-start rounded-md overflow-hidden bg-[#181818]"
              onClick={() => onPlay(mockTMDBMovie, item.type)}
            >
              <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                <img
                  src={posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="bg-red-600/90 text-white text-[10px] font-black px-1.5 py-0.5 rounded backdrop-blur-md flex items-center gap-1 shadow-sm uppercase">
                    {item.type === 'tv' ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                    {item.type === 'tv' ? 'Series' : 'Movie'}
                  </span>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-red-400 transition">{item.title}</h3>
                {item.type === 'tv' && item.lastWatchedSeason && item.lastWatchedEpisode && (
                  <p className="text-gray-400 text-xs mt-1">S{item.lastWatchedSeason} E{item.lastWatchedEpisode}</p>
                )}
              </div>
              
              {/* Progress Bar (Mocked to 50% for visual effect) */}
              <div className="absolute bottom-0 left-0 h-1 bg-gray-700 w-full">
                <div className="h-full bg-[#E50914] w-1/2"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
