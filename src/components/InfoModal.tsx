import React from 'react';
import { X, ExternalLink, Code, Popcorn } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-white/10 w-full max-w-lg rounded-xl p-8 relative shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10 bg-black/50 p-1.5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#E50914]/20 to-black/0 -z-0"></div>

        <div className="flex flex-col items-center text-center relative z-10 pt-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-[#E50914] rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20 mb-6 rotate-3">
            <Popcorn className="w-10 h-10 text-white -rotate-3" />
          </div>

          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Welcome to <span className="text-[#E50914] italic pr-1">Munsatflixs</span>
          </h2>
          <p className="text-gray-400 font-medium mb-6">I am Musnat Bin Amin</p>

          <div className="bg-white/5 border border-white/10 rounded-lg p-5 mb-8">
            <p className="text-gray-300 text-sm leading-relaxed">
              Consider this your front-row seat to my latest projects, creations, and digital experiences. Grab some popcorn and explore!
            </p>
          </div>

          <a
            href="https://www.musnat.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-bold transition w-full justify-center"
          >
            <Code className="w-5 h-5" />
            <span>Visit My Portfolio</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition" />
          </a>
        </div>
      </div>
    </div>
  );
}
