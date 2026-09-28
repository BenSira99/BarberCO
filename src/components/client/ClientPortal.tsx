import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { BookingWizard } from './BookingWizard';
import { ClientMyAppointments } from './ClientMyAppointments';
import { ClientReviewsSection } from './ClientReviewsSection';
import { ClientChatSection } from './ClientChatSection';
import { 
  Calendar, 
  Star, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Sparkles, 
  Store, 
  Home, 
  Clock, 
  Scissors, 
  Check, 
  ArrowRight,
  Filter,
  Users
} from 'lucide-react';
import { buildWhatsAppLink } from '../../lib/whatsapp';

export type ClientTab = 'marketplace' | 'booking' | 'appointments' | 'reviews' | 'chat' | 'services';

export const ClientPortal: React.FC = () => {
  const { 
    stylists, 
    selectedStylistId, 
    setSelectedStylistId, 
    selectedStylist, 
    services, 
    reviews 
  } = useSalon();

  const [activeTab, setActiveTab] = useState<ClientTab>('marketplace');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'salon' | 'home'>('all');

  const filteredStylists = stylists.filter((s) => {
    if (selectedCityFilter !== 'all' && s.city.toLowerCase() !== selectedCityFilter.toLowerCase()) {
      return false;
    }
    if (selectedTypeFilter === 'home' && !s.acceptsHomeBooking) return false;
    return true;
  });

  const stylistServices = services.filter(s => !s.stylistId || s.stylistId === selectedStylist.id);
  const stylistReviews = reviews.filter(r => r.stylistId === selectedStylist.id);

  const handleSelectStylistToBook = (stylistId: string) => {
    setSelectedStylistId(stylistId);
    setActiveTab('booking');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const waDirectLink = buildWhatsAppLink(
    selectedStylist.whatsappNumber,
    `Bonjour ${selectedStylist.stylistName} ! J'ai vu votre profil sur L'Atelier Privé et j'aimerais réserver.`
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner: Marketplace of Moroccan Stylists */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900/60 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plateforme Nationale • Réservation en MAD</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100 font-editorial leading-tight">
                Choisissez votre Coiffeur d'Exception au Maroc
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Réservez les maîtres artisans coiffeurs, barbiers et coloristes les plus renommés à Casablanca, Marrakech, Rabat et Tanger. Prestation en salon privé ou directement à votre domicile en dirhams (MAD).
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="flex items-center space-x-3 bg-stone-950 p-4 rounded-2xl border border-stone-800 shrink-0 text-xs">
              <div className="text-center px-2">
                <span className="text-xl font-bold text-amber-400 font-mono block">
                  {stylists.length}
                </span>
                <span className="text-[10px] text-stone-400">Coiffeurs</span>
              </div>
              <div className="w-[1px] h-8 bg-stone-800" />
              <div className="text-center px-2">
                <span className="text-xl font-bold text-stone-200 font-mono block">
                  4.95
                </span>
                <span className="text-[10px] text-stone-400">Note moyenne</span>
              </div>
              <div className="w-[1px] h-8 bg-stone-800" />
              <div className="text-center px-2">
                <span className="text-xl font-bold text-emerald-400 font-mono block">
                  MAD
                </span>
                <span className="text-[10px] text-stone-400">Tarifs clairs</span>
              </div>
            </div>
          </div>

          {/* City & Mode Filter Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800/80">
            {/* City filter tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-400 font-medium mr-1 text-[11px] flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Ville :</span>
              </span>
              {[
                { id: 'all', label: 'Toutes les villes' },
                { id: 'casablanca', label: 'Casablanca' },
                { id: 'marrakech', label: 'Marrakech' },
                { id: 'rabat', label: 'Rabat' },
                { id: 'tanger', label: 'Tanger' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCityFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl transition font-medium ${
                    selectedCityFilter === c.id
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'bg-stone-950/80 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Salon / Domicile filter */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setSelectedTypeFilter('all')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  selectedTypeFilter === 'all'
                    ? 'bg-stone-800 border-amber-500/40 text-amber-300 font-medium'
                    : 'bg-stone-950/80 border-stone-800 text-stone-400'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setSelectedTypeFilter('home')}
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1 transition ${
                  selectedTypeFilter === 'home'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-medium'
                    : 'bg-stone-950/80 border-stone-800 text-stone-400'
                }`}
              >
                <Home className="w-3 h-3" />
                <span>Prestation à Domicile</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Selected Stylist Active Banner */}
      <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center font-bold text-stone-950 text-sm">
            {selectedStylist.stylistName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Coiffeur sélectionné :
              </span>
              <h3 className="font-semibold text-stone-100 text-sm">
                {selectedStylist.stylistName} ({selectedStylist.salonName})
              </h3>
            </div>
            <p className="text-xs text-stone-400">
              📍 {selectedStylist.address}, {selectedStylist.city} • ★ {selectedStylist.rating}/5
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('marketplace')}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition"
          >
            Changer de coiffeur ↺
          </button>
          <a
            href={waDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-medium flex items-center space-x-1 transition shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-start gap-2 border-b border-stone-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'marketplace'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Annuaire des Coiffeurs ({filteredStylists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'booking'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Réserver avec {selectedStylist.stylistName.split(' ')[0]}</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'appointments'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Mes Rendez-vous</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'reviews'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Avis & Témoignages</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'chat'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat en Direct</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'services'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Tarifs en MAD</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="transition-all duration-200">
        
        {/* MARKETPLACE: Choose hairdresser */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-stone-100 font-editorial">
                {filteredStylists.length} coiffeurs disponibles au Maroc
              </h2>
              <span className="text-xs text-stone-400">
                Paiement direct sur place ou à domicile en Dirhams (MAD)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStylists.map((st) => {
                const isSelected = st.id === selectedStylistId;
                const startingPrice = services
                  .filter(s => !s.stylistId || s.stylistId === st.id)
                  .reduce((min, s) => s.price < min ? s.price : min, 350);

                return (
                  <div
                    key={st.id}
                    className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-5 ${
                      isSelected
                        ? 'bg-stone-900 border-amber-500/60 shadow-xl ring-1 ring-amber-500/30'
                        : 'bg-stone-900/60 border-stone-800 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1px]">
                            <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center font-bold text-amber-400 text-lg font-editorial">
                              {st.stylistName.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-stone-100 text-base font-editorial">
                                {st.stylistName}
                              </h3>
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                {st.city}
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 font-medium">
                              {st.salonName}
                            </p>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{st.rating}</span>
                          </div>
                          <span className="text-[10px] text-stone-500 block">
                            {st.reviewCount} avis
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                        {st.bio}
                      </p>

                      {/* Badges: Specialties & Locations */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          {st.specialties?.map((spec, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-stone-950 text-stone-300 border border-stone-800">
                              ✨ {spec}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-stone-400 pt-1">
                          <span className="flex items-center space-x-1">
                            <Store className="w-3.5 h-3.5 text-amber-400" />
                            <span>Salon à {st.city}</span>
                          </span>
                          {st.acceptsHomeBooking && (
                            <span className="flex items-center space-x-1 text-emerald-400">
                              <Home className="w-3.5 h-3.5" />
                              <span>Domicile (+{st.homeExtraFee} MAD)</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                          Tarifs dès
                        </span>
                        <span className="text-base font-bold text-amber-400 font-mono">
                          {startingPrice} MAD
                        </span>
                      </div>

                      <button
                        onClick={() => handleSelectStylistToBook(st.id)}
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                          isSelected
                            ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                            : 'bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200'
                        }`}
                      >
                        <span>{isSelected ? 'Prendre Rendez-vous' : 'Choisir ce coiffeur'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOOKING WIZARD */}
        {activeTab === 'booking' && (
          <BookingWizard onBookingComplete={() => setActiveTab('appointments')} />
        )}

        {/* MY APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <ClientMyAppointments onOpenBooking={() => setActiveTab('booking')} />
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <ClientReviewsSection />
        )}

        {/* CHAT */}
        {activeTab === 'chat' && (
          <ClientChatSection />
        )}

        {/* SERVICES IN MAD */}
        {activeTab === 'services' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h2 className="text-2xl font-semibold text-stone-100 font-editorial">
                Prestations & Tarifs de {selectedStylist.stylistName} ({selectedStylist.city})
              </h2>
              <p className="text-xs text-stone-400">
                Tous les tarifs sont indiqués en Dirhams Marocains (MAD), produits de soin haut de gamme inclus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stylistServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-3xl bg-stone-900/70 border border-stone-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {srv.category}
                      </span>
                      <span className="font-mono font-bold text-amber-400 text-lg">
                        {srv.price} MAD
                      </span>
                    </div>

                    <h3 className="font-semibold text-stone-100 text-base font-editorial">
                      {srv.name}
                    </h3>

                    <p className="text-xs text-stone-400 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-500">{srv.durationMinutes} minutes</span>
                    <button
                      onClick={() => setActiveTab('booking')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition shadow-sm"
                    >
                      Réserver ({srv.price} MAD)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
