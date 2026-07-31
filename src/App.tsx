import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import VideoModal from './components/VideoModal';
import MovieDetailsModal from './components/MovieDetailsModal';
import SearchResults from './components/SearchResults';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import InfoModal from './components/InfoModal';
import { requests, searchMulti, TMDBMovie } from './tmdb';
import { useState, useEffect } from 'react';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [playType, setPlayType] = useState<'movie' | 'tv'>('movie');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      searchMulti(searchQuery)
        .then((data) => {
          setSearchResults(data);
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectMovie = (movie: TMDBMovie, type: 'movie' | 'tv') => {
    setSelectedMovie(movie);
    setPlayType(type);
    setIsDetailsModalOpen(true);
  };

  const handlePlayFromDetails = () => {
    setIsVideoModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleCloseVideo = () => {
    setIsVideoModalOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden pb-12 font-sans selection:bg-[#E50914] selection:text-white relative">
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={(tab) => setActiveTab(tab)} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenInfo={() => setIsInfoModalOpen(true)}
      />
      
      {searchQuery ? (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          isLoading={isSearching}
          onPlay={handleSelectMovie}
          onClear={handleClearSearch}
        />
      ) : (
        <>
          <div id="section-home">
            <Hero onPlay={handleSelectMovie} />
          </div>

          <div className="-mt-16 md:-mt-32 relative z-20 flex flex-col gap-6 md:gap-10">
            {/* Netflix Originals */}
            <div id="section-popular">
              <MovieRow 
                title="Popular on Netflix" 
                fetchUrl={requests.fetchNetflixOriginals} 
                isLargeRow={true} 
                onPlay={handleSelectMovie} 
              />
            </div>

            {/* Amazon Prime Video */}
            <MovieRow 
              title="Popular on Amazon Prime" 
              fetchUrl={requests.fetchAmazonPrime} 
              onPlay={handleSelectMovie} 
            />

            {/* Disney+ */}
            <MovieRow 
              title="Popular on Disney+" 
              fetchUrl={requests.fetchDisneyPlus} 
              onPlay={handleSelectMovie} 
            />

            {/* Trending Movies */}
            <div id="section-movies">
              <MovieRow 
                title="Trending Movies" 
                fetchUrl={requests.fetchTrendingMovies} 
                numbered={true} 
                onPlay={handleSelectMovie} 
              />
            </div>

            {/* Trending TV Shows */}
            <div id="section-tv">
              <MovieRow 
                title="Trending TV Shows" 
                fetchUrl={requests.fetchTrendingTv} 
                onPlay={handleSelectMovie} 
              />
            </div>

            {/* Genre & Rating Lists */}
            <MovieRow title="Top Rated Movies" fetchUrl={requests.fetchTopRated} onPlay={handleSelectMovie} />
            <MovieRow title="Action & Adventure" fetchUrl={requests.fetchActionMovies} onPlay={handleSelectMovie} />
            <MovieRow title="Comedies" fetchUrl={requests.fetchComedyMovies} onPlay={handleSelectMovie} />
            <MovieRow title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} onPlay={handleSelectMovie} />
            <MovieRow title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} onPlay={handleSelectMovie} />
            <MovieRow title="Documentaries" fetchUrl={requests.fetchDocumentaries} onPlay={handleSelectMovie} />
          </div>
        </>
      )}

      <footer className="px-4 md:px-12 py-6 mt-12 flex flex-col md:flex-row justify-between items-center bg-[#0a0a0a] border-t border-white/5 relative z-20">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 opacity-50 text-[10px] uppercase tracking-[0.2em] font-medium mb-4 md:mb-0">
          <span>Audio: En/Bn/Ja</span>
          <span>Subtitles: On</span>
          <span>HD Quality</span>
          <span>Exact IMDB/TMDB Episode Data</span>
        </div>
        <div className="text-xs font-bold italic tracking-wider">
          <span className="text-gray-500">Custom Interface Layer: </span>
          <span className="text-[#E50914]">MUNSAT_ALPHA_V1</span>
        </div>
      </footer>

      <MovieDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        movie={selectedMovie}
        onPlay={handlePlayFromDetails}
      />

      <VideoModal 
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideo}
        movie={selectedMovie}
        type={playType}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        onPlay={handleSelectMovie}
      />

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}

