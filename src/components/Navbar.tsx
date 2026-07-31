import { Search, Menu, X, LogIn, LogOut, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';

interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onClearSearch?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onOpenInfo?: () => void;
}

export default function Navbar({ 
  activeTab = 'home', 
  onSelectTab,
  searchQuery = '',
  onSearchChange,
  onClearSearch,
  onOpenAuth,
  onOpenProfile,
  onOpenInfo
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { user, signInWithGoogle, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setIsSearchOpen(true);
    }
  }, [searchQuery]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'popular', label: 'New & Popular' },
  ];

  const handleTabClick = (id: string) => {
    if (onClearSearch) onClearSearch();
    if (onSelectTab) onSelectTab(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSearch = () => {
    if (isSearchOpen && !searchQuery) {
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen || searchQuery ? 'bg-[#050505] shadow-md border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-3.5 md:py-5">
        <div className="flex items-center gap-4 md:gap-10">
          <Menu 
            className="w-6 h-6 text-white md:hidden cursor-pointer" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          {/* Custom Logo Layer - "Munsatflixs" */}
          <h1 
            onClick={() => handleTabClick('home')}
            className="text-[#E50914] text-2xl md:text-3xl font-black tracking-tighter uppercase italic cursor-pointer select-none"
          >
            Munsatflixs
          </h1>
          <ul className="hidden lg:flex gap-6 text-sm font-medium tracking-wide text-gray-300">
            {navItems.map((item) => (
              <li 
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`cursor-pointer transition ${
                  activeTab === item.id && !searchQuery
                    ? 'hover:text-white font-bold text-white underline underline-offset-8 decoration-[#E50914]' 
                    : 'hover:text-white'
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5 text-white">
          {/* Search Input Box */}
          <div className="relative flex items-center">
            <div className={`flex items-center bg-black/70 border ${isSearchOpen ? 'w-48 sm:w-64 border-white/30 px-3' : 'w-9 border-transparent justify-center'} py-1.5 rounded-full transition-all duration-300 backdrop-blur-md`}>
              <Search 
                onClick={toggleSearch} 
                className="w-4 h-4 text-gray-300 hover:text-white cursor-pointer flex-shrink-0" 
              />
              {isSearchOpen && (
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Movies, TV, Anime..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-400 ml-2 w-full"
                />
              )}
              {searchQuery && (
                <X
                  onClick={() => {
                    if (onClearSearch) onClearSearch();
                    setIsSearchOpen(false);
                  }}
                  className="w-3.5 h-3.5 text-gray-400 hover:text-white cursor-pointer flex-shrink-0 ml-1"
                />
              )}
            </div>
          </div>

          <Info 
            onClick={() => {
              if (onOpenInfo) onOpenInfo();
            }}
            className="w-4 h-4 md:w-5 md:h-5 cursor-pointer text-white/70 hover:text-white transition" 
          />
          
          {user ? (
            <div className="relative">
              <div 
                className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-md shadow-lg shadow-white/5 overflow-hidden border border-white/10 cursor-pointer"
                onClick={() => {
                  if (onOpenProfile) onOpenProfile();
                  setShowProfileMenu(false);
                }}
              >
                <img src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Munsat"} alt="User Avatar" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition" />
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
              }}
              className="flex items-center gap-1.5 bg-[#E50914] hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-bold transition shadow-lg whitespace-nowrap cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Up / Sign In</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#050505] px-4 py-4 border-t border-white/10 absolute w-full left-0 top-full shadow-xl">
          <ul className="flex flex-col gap-4 text-sm font-medium tracking-wide text-gray-300">
            {navItems.map((item) => (
              <li 
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`cursor-pointer transition ${
                  activeTab === item.id && !searchQuery ? 'font-bold text-[#E50914]' : 'hover:text-white'
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

