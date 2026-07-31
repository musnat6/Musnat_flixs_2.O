import { ArrowLeft, Monitor, Loader2, AlertCircle, ExternalLink, ChevronDown, Play, Film, Layers, List, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TMDBMovie, fetchTvDetails, fetchSeasonDetails, TMDBEpisode, POSTER_BASE_URL, IMAGE_BASE_URL } from '../tmdb';
import { useAuth } from '../lib/AuthContext';
import { db, doc, setDoc, serverTimestamp } from '../lib/firebase';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: TMDBMovie | null;
  type: 'movie' | 'tv';
}

export default function VideoModal({ isOpen, onClose, movie, type }: VideoModalProps) {
  const [server, setServer] = useState<string>('videasy');
  const [isLoading, setIsLoading] = useState(true);
  const [isInIframe, setIsInIframe] = useState(false);
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const [tvDetails, setTvDetails] = useState<any>(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState<TMDBEpisode[]>([]);
  const [isSeasonLoading, setIsSeasonLoading] = useState(false);
  const [showSeasonSelector, setShowSeasonSelector] = useState(false);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [showEpisodeList, setShowEpisodeList] = useState(true);
  
  const { user } = useAuth();

  const isAnime = movie?.genre_ids?.includes(16) || movie?.original_name?.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf]/);

  // Save progress to Firestore whenever movie, season, or episode changes and user is logged in
  useEffect(() => {
    if (isOpen && movie && user) {
      const saveProgress = async () => {
        try {
          const docId = `${user.uid}_${movie.id}`;
          const title = movie.title || movie.name || movie.original_name || 'Unknown';
          const posterPath = movie.poster_path || movie.backdrop_path || '';
          
          const progressData = {
            userId: user.uid,
            tmdbId: movie.id,
            type: type,
            title: title,
            posterPath: posterPath,
            lastWatchedSeason: type === 'tv' ? season : null,
            lastWatchedEpisode: type === 'tv' ? episode : null,
            timestamp: serverTimestamp(),
          };

          await setDoc(doc(db, 'watch_history', docId), progressData, { merge: true });
        } catch (error) {
          console.error("Error saving watch progress:", error);
        }
      };

      saveProgress();
    }
  }, [isOpen, movie, type, season, episode, user]);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setServer('videasy'); // Default server
      setIsLoading(true);
      if (type === 'tv' && movie) {
        fetchTvDetails(movie.id).then(data => {
          setTvDetails(data);
          const validSeason = data.seasons?.find((s: any) => s.season_number > 0) || data.seasons?.[0];
          const initialSeasonNum = validSeason ? validSeason.season_number : 1;
          setSeason(initialSeasonNum);
          setEpisode(1);
        }).catch(console.error);
      }
    } else {
      document.body.style.overflow = 'unset';
      setTvDetails(null);
      setSeasonEpisodes([]);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, movie, type]);

  // Fetch exact episodes array whenever season changes
  useEffect(() => {
    if (isOpen && type === 'tv' && movie && season > 0) {
      setIsSeasonLoading(true);
      fetchSeasonDetails(movie.id, season)
        .then(data => {
          if (data && data.episodes) {
            setSeasonEpisodes(data.episodes);
          } else {
            setSeasonEpisodes([]);
          }
        })
        .catch(err => {
          console.error('Failed to fetch season episodes:', err);
          setSeasonEpisodes([]);
        })
        .finally(() => setIsSeasonLoading(false));
    }
  }, [isOpen, movie, type, season]);

  if (!isOpen || !movie) return null;

  const SERVERS = [
    { id: 'videasy', name: 'Videasy (Recommended)' },
    { id: 'vidapi', name: 'VidApi' },
    { id: 'vidcore', name: 'Vidcore' },
    { id: 'peachify', name: 'Peachify' },
    { id: 'vidgod', name: 'VidGod' }
  ];

  const tmdbId = movie.id;
  const title = movie.title || movie.name || movie.original_name;
  const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);

  const getEmbedUrl = () => {
    const tvPath = type === 'tv' ? `/${season}/${episode}` : '';
    switch (server) {
      case 'vidapi':
        const vidapiParams = "?primaryColor=E50914&secondaryColor=170000&iconColor=E50914&icons=vid&player=nf&title=false&poster=true&autoplay=true&nextbutton=false";
        return type === 'tv' 
          ? `https://vidapi.qzz.io/tv/${tmdbId}/${season}/${episode}${vidapiParams}`
          : `https://vidapi.qzz.io/movie/${tmdbId}${vidapiParams}`;
      case 'vidcore':
        const vidcoreParams = "?autoPlay=true&theme=E50914&title=false";
        return type === 'tv' 
          ? `https://www.vidcore.org/embed/tv/${tmdbId}/${season}/${episode}${vidcoreParams}`
          : `https://www.vidcore.org/embed/movie/${tmdbId}${vidcoreParams}`;
      case 'videasy':
        const videasyParams = "?color=E50914&nextEpisode=true&episodeSelector=true&autoplayNextEpisode=true&overlay=true";
        return type === 'tv'
          ? `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}${videasyParams}`
          : `https://player.videasy.net/movie/${tmdbId}${videasyParams}`;
      case 'peachify':
        return `https://peachify.pro/embed/${type}/${tmdbId}${tvPath}`;
      case 'vidgod':
        return `https://vidgod.com/embed/${type}/${tmdbId}${tvPath}`;
      default:
        const defaultVidapiParams = "?primaryColor=E50914&secondaryColor=170000&iconColor=E50914&icons=vid&player=nf&title=false&poster=true&autoplay=true&nextbutton=false";
        return type === 'tv' 
          ? `https://vidapi.qzz.io/tv/${tmdbId}/${season}/${episode}${defaultVidapiParams}`
          : `https://vidapi.qzz.io/movie/${tmdbId}${defaultVidapiParams}`;
    }
  };

  const handleSelectEpisode = (epNum: number) => {
    setEpisode(epNum);
    setIsLoading(true);
    // Scroll player into view
    const playerEl = document.getElementById('main-video-player');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-40 flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 gap-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">Back</span>
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-base sm:text-lg leading-tight line-clamp-1">{title}</h2>
              {isAnime && (
                <span className="bg-purple-600/30 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  ANIME
                </span>
              )}
            </div>
            {year && <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{year} • {type === 'tv' ? `Season ${season} Episode ${episode}` : 'Movie'}</span>}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {isInIframe && (
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20"
              title="Open in new tab if video fails to load"
            >
              <AlertCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Open externally if blocked</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {type === 'tv' && (
            <button
              onClick={() => setShowEpisodeList(!showEpisodeList)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                showEpisodeList 
                  ? 'bg-[#E50914]/20 border-[#E50914]/40 text-white' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <List className="w-4 h-4 text-[#E50914]" />
              <span>{showEpisodeList ? 'Hide Episodes' : 'Browse Episodes'}</span>
            </button>
          )}

          {type === 'tv' && tvDetails && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowSeasonSelector(!showSeasonSelector);
                    setShowEpisodeSelector(false);
                  }}
                  className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded text-xs text-white border border-white/10 cursor-pointer hover:bg-white/20 transition font-medium"
                >
                  <Monitor className="w-3.5 h-3.5 text-gray-400" />
                  <span className="whitespace-nowrap">Season {season}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showSeasonSelector && (
                  <div className="absolute top-full right-0 mt-2 bg-[#141414] border border-white/10 rounded-md shadow-2xl py-1 z-[110] min-w-[130px] max-h-[280px] overflow-y-auto">
                    {tvDetails.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSeason(s.season_number);
                          setEpisode(1);
                          setShowSeasonSelector(false);
                          setIsLoading(true);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition flex items-center justify-between ${season === s.season_number ? 'text-[#E50914] font-bold bg-white/5' : 'text-gray-300'}`}
                      >
                        <span>Season {s.season_number}</span>
                        <span className="text-[10px] text-gray-500 font-normal">({s.episode_count} ep)</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => {
                    setShowEpisodeSelector(!showEpisodeSelector);
                    setShowSeasonSelector(false);
                  }}
                  className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded text-xs text-white border border-white/10 cursor-pointer hover:bg-white/20 transition font-medium"
                >
                  <span className="whitespace-nowrap">Ep {episode}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showEpisodeSelector && (
                  <div className="absolute top-full right-0 mt-2 bg-[#141414] border border-white/10 rounded-md shadow-2xl py-1 z-[110] min-w-[120px] max-h-[280px] overflow-y-auto grid grid-cols-2 gap-1 p-2">
                    {Array.from({ length: tvDetails.seasons?.find((s: any) => s.season_number === season)?.episode_count || seasonEpisodes.length || 1 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleSelectEpisode(i + 1);
                          setShowEpisodeSelector(false);
                        }}
                        className={`text-center px-2 py-1.5 text-xs hover:bg-white/10 rounded transition ${episode === i + 1 ? 'bg-[#E50914]/20 text-[#E50914] font-bold border border-[#E50914]/30' : 'text-gray-300'}`}
                      >
                        Ep {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Server Selection Bar */}
      <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-[#080808] overflow-x-auto [&::-webkit-scrollbar]:hidden border-b border-white/5 shadow-md flex-shrink-0">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mr-2 hidden sm:inline">Server:</span>
        {SERVERS.map((srv) => (
          <button 
            key={srv.id}
            onClick={() => {
              if (server !== srv.id) {
                setServer(srv.id);
                setIsLoading(true);
              }
            }}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition whitespace-nowrap cursor-pointer uppercase tracking-wider border ${
              server === srv.id 
                ? 'bg-[#E50914] text-white border-[#E50914] shadow-lg shadow-red-500/20' 
                : 'text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
            }`}
          >
            {srv.name}
          </button>
        ))}
      </div>

      {/* Main Player Container */}
      <div id="main-video-player" className="relative w-full aspect-video md:h-[65vh] bg-black flex-shrink-0">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10">
            <Loader2 className="w-8 h-8 text-[#E50914] animate-spin mb-4" />
            <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Connecting to {server.toUpperCase()} stream...</span>
          </div>
        )}
        
        {isInIframe && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/85 text-white px-4 py-2.5 rounded-lg text-xs flex items-center gap-3 backdrop-blur-md border border-red-500/30 shadow-2xl max-w-[90%] text-center pointer-events-auto">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 hidden sm:block" />
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-gray-200 font-medium">Fullscreen disabled or "Sandbox" error?</span>
              <a 
                href={window.location.href} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-[#E50914] text-white px-3 py-1 rounded text-xs font-bold whitespace-nowrap hover:bg-red-700 transition shadow-lg flex items-center gap-1.5"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        <iframe 
          key={`${server}-${season}-${episode}`}
          src={getEmbedUrl()}
          className={`w-full h-full absolute inset-0 border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          allowFullScreen
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Structured Episodes & Seasons Section */}
      {type === 'tv' && showEpisodeList && (
        <div className="bg-[#0a0a0a] border-t border-white/10 p-4 sm:p-6 md:p-8 flex-1">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            {/* Season Tabs Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-[#E50914]" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  Seasons & Episodes
                </h3>
                {tvDetails && (
                  <span className="bg-white/10 text-gray-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {tvDetails.number_of_seasons || tvDetails.seasons?.length || 1} Seasons
                  </span>
                )}
              </div>

              {/* Seasons Pill Navigation */}
              {tvDetails?.seasons && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden">
                  {tvDetails.seasons
                    .filter((s: any) => s.season_number > 0)
                    .map((s: any) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSeason(s.season_number);
                          setEpisode(1);
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                          season === s.season_number
                            ? 'bg-[#E50914] text-white border-[#E50914] shadow-lg shadow-red-500/20'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Season {s.season_number} ({s.episode_count} Ep)
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Episodes Grid / List */}
            {isSeasonLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#E50914] animate-spin mb-2" />
                <span className="text-xs text-gray-400 font-medium ml-3">Loading exact episode list...</span>
              </div>
            ) : seasonEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {seasonEpisodes.map((ep) => {
                  const isCurrent = ep.episode_number === episode;
                  const epStill = ep.still_path ? `${POSTER_BASE_URL}${ep.still_path}` : movie.backdrop_path ? `${POSTER_BASE_URL}${movie.backdrop_path}` : `${POSTER_BASE_URL}${movie.poster_path}`;

                  return (
                    <div
                      key={ep.id}
                      onClick={() => handleSelectEpisode(ep.episode_number)}
                      className={`group relative bg-[#121212] rounded-xl overflow-hidden border transition cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[#E50914] shadow-xl shadow-red-500/10 ring-2 ring-[#E50914]/50'
                          : 'border-white/5 hover:border-white/20 hover:bg-[#181818]'
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                        <img
                          src={epStill}
                          alt={ep.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Current Episode Badge */}
                        {isCurrent ? (
                          <div className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-current animate-pulse" />
                            NOW PLAYING
                          </div>
                        ) : (
                          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                            EPISODE {ep.episode_number}
                          </div>
                        )}

                        {ep.runtime && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-gray-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            {ep.runtime}m
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-bold line-clamp-1 ${isCurrent ? 'text-[#E50914]' : 'text-white group-hover:text-red-400'} transition`}>
                              {ep.episode_number}. {ep.name || `Episode ${ep.episode_number}`}
                            </h4>
                          </div>
                          {ep.overview && (
                            <p className="text-gray-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                              {ep.overview}
                            </p>
                          )}
                        </div>

                        {ep.air_date && (
                          <div className="text-[10px] text-gray-500 font-medium pt-2 border-t border-white/5 flex items-center justify-between">
                            <span>Aired: {ep.air_date}</span>
                            {ep.vote_average && ep.vote_average > 0 && (
                              <span className="text-green-400 font-semibold">★ {ep.vote_average.toFixed(1)}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Fallback if TMDB episodes list is empty
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-10 gap-2">
                {Array.from({ length: tvDetails?.seasons?.find((s: any) => s.season_number === season)?.episode_count || 12 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectEpisode(i + 1)}
                    className={`py-3 px-2 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                      episode === i + 1
                        ? 'bg-[#E50914] text-white border-[#E50914] shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Episode {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

