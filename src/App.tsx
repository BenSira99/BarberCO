/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Header } from './components/Header';
import { StylistDashboard } from './components/stylist/StylistDashboard';
import { ClientPortal } from './components/client/ClientPortal';
import { StylistAuthGate } from './components/auth/StylistAuthGate';
import { StylistAuthModal } from './components/auth/StylistAuthModal';
import { 
  Scissors, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Lock
} from 'lucide-react';
import { buildWhatsAppLink } from './lib/whatsapp';

const AppContent: React.FC = () => {
  const { 
    activeMode, 
    currentStylist, 
    selectedStylist, 
    switchMode, 
    isStylistAuthenticated, 
    isAuthModalOpen, 
    closeAuthModal,
    openAuthModal,
    logout 
  } = useSalon();

  const activeStylist = activeMode === 'stylist' ? currentStylist : selectedStylist;

  const waLink = buildWhatsAppLink(
    activeStylist.whatsappNumber,
    `Bonjour ${activeStylist.stylistName} ! J'aimerais en savoir plus sur vos créneaux.`
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeMode === 'stylist' ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {isStylistAuthenticated ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold font-mono">
                      Dashboard Unique : {currentStylist.salonName} ({currentStylist.city})
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold font-mono">
                      MAD
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => switchMode('client')}
                      className="text-xs text-stone-400 hover:text-amber-300 transition flex items-center space-x-1"
                    >
                      <span>Voir le portail comme une cliente</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
                <StylistDashboard />
              </>
            ) : (
              <StylistAuthGate />
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold font-mono">
                  Portail Client • Réservation Libre & Choix du Coiffeur
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                  Maroc • Tarifs en MAD
                </span>
              </div>
              <button
                onClick={() => {
                  if (!isStylistAuthenticated) {
                    openAuthModal();
                  } else {
                    switchMode('stylist');
                  }
                }}
                className="text-xs text-stone-400 hover:text-amber-300 transition flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Vous êtes coiffeur/se ? Accéder à votre espace</span>
                <span>→</span>
              </button>
            </div>
            <ClientPortal />
          </div>
        )}
      </main>

      {/* Auth Modal for Quick Login / Register Popup */}
      <StylistAuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      {/* Luxury Footer */}
      <footer className="bg-stone-950 border-t border-stone-900 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500">
          
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-stone-300 font-editorial text-sm">
                {activeStylist.salonName}
              </p>
              <p className="text-[11px] text-stone-500">
                {activeStylist.address}, {activeStylist.city} • Tarification exclusive en Dirhams (MAD)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-stone-400">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Pro</span>
            </a>
            <span className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeStylist.phone}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>{activeStylist.instagramHandle}</span>
            </span>
          </div>

          <div className="text-center md:text-right text-[11px]">
            <p className="text-stone-400">
              L'Atelier Privé • Salons & Coiffeurs d'Exception au Maroc
            </p>
            <p className="text-stone-600 mt-0.5">
              Casablanca • Marrakech • Rabat • Tanger • Tous tarifs en MAD
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <AppContent />
    </SalonProvider>
  );
}
