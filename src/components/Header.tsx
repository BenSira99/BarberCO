import React from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  Scissors, 
  UserCheck, 
  LogOut, 
  Lock,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeMode, 
    switchMode, 
    isStylistAuthenticated,
    openAuthModal, 
    currentStylist, 
    logout 
  } = useSalon();

  return (
    <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Monogram */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => switchMode('client')}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center">
                <Scissors className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-2xl font-semibold tracking-wider text-stone-100 uppercase">
                  L'Atelier Privé
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
                  Maroc • MAD
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block tracking-wide">
                Haute Coiffure, Salons d'Exception & Domicile
              </p>
            </div>
          </div>

          {/* Right Actions: Accès Coiffeur button or Logged-in profile */}
          <div className="flex items-center space-x-3">
            {isStylistAuthenticated ? (
              <div className="flex items-center space-x-3">
                {activeMode === 'client' ? (
                  <button
                    onClick={() => switchMode('stylist')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition shadow-md"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Mon Dashboard Pro</span>
                  </button>
                ) : (
                  <button
                    onClick={() => switchMode('client')}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs transition"
                  >
                    <span>← Espace Client</span>
                  </button>
                )}

                <div className="flex items-center space-x-2 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-stone-800">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    {currentStylist.stylistName.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left text-xs">
                    <p className="font-semibold text-stone-200 truncate max-w-[120px]">
                      {currentStylist.stylistName}
                    </p>
                    <p className="text-[10px] text-amber-400 font-mono">
                      📍 {currentStylist.city}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    title="Déconnexion de l'espace coiffeur"
                    className="p-1.5 text-stone-400 hover:text-rose-300 hover:bg-stone-800 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Accès Coiffeur</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
