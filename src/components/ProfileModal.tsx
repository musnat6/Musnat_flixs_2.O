import React from 'react';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import WatchHistoryRow from './WatchHistoryRow';
import { TMDBMovie } from '../tmdb';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlay: (movie: TMDBMovie, type: 'movie' | 'tv') => void;
}

export default function ProfileModal({ isOpen, onClose, onPlay }: ProfileModalProps) {
  const { user, signOut } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-start justify-center p-4 pt-10 sm:pt-20 overflow-y-auto">
      <div className="bg-[#141414] border border-white/10 w-full max-w-5xl rounded-xl p-6 relative shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition bg-white/5 p-2 rounded-full border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-white/10 pb-8 mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 flex-shrink-0">
            <img 
              src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Munsat"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{user.displayName || 'Munsatflixs User'}</h1>
            <p className="text-gray-400 mb-4">{user.email}</p>
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-[#E50914] text-white px-4 py-2 rounded-lg font-bold transition border border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="w-full">
          <WatchHistoryRow onPlay={(movie, type) => {
            onClose();
            onPlay(movie, type);
          }} />
        </div>
      </div>
    </div>
  );
}
