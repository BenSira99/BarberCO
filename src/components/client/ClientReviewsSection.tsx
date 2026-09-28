import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Review, LocationType } from '../../types';
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Store, 
  Home, 
  Send, 
  CornerDownRight, 
  ThumbsUp, 
  Plus 
} from 'lucide-react';
import { formatFrenchDate } from '../../lib/whatsapp';

export const ClientReviewsSection: React.FC = () => {
  const { reviews, addReview, services, selectedStylist, stylists } = useSalon();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState<'selected' | 'all'>('selected');

  const stylistServices = services.filter(s => !s.stylistId || s.stylistId === selectedStylist.id);

  // Form states
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [serviceName, setServiceName] = useState(stylistServices[0]?.name || services[0]?.name || 'Balayage Signature & Gloss Couture');
  const [locationType, setLocationType] = useState<LocationType>('salon');
  const [comment, setComment] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    addReview({
      stylistId: selectedStylist.id,
      clientName: clientName.trim(),
      rating,
      comment: comment.trim(),
      serviceName,
      locationType,
    });

    setIsFormOpen(false);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 4000);

    // Reset
    setClientName('');
    setRating(5);
    setComment('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner with overall rating score */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mono">
              Avis & Témoignages Clients
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-100 font-editorial">
            L'Excellence vécue par nos clientes
          </h2>
          <p className="text-xs text-stone-400 max-w-md">
            Découvrez les retours authentiques de nos clientes au salon et à domicile.
          </p>
        </div>

        {/* Global Rating Box */}
        <div className="flex flex-col sm:items-end justify-center shrink-0 space-y-2">
          <div className="flex items-center space-x-3 bg-stone-950 p-4 rounded-2xl border border-amber-500/30">
            <div className="text-center sm:text-right">
              <span className="text-3xl font-bold text-amber-400 font-mono">
                {selectedStylist.rating}
              </span>
              <span className="text-stone-400 text-xs"> / 5</span>
            </div>
            <div className="border-l border-stone-800 pl-3 space-y-1">
              <div className="flex text-amber-400 text-sm">
                {'★'.repeat(5)}
              </div>
              <span className="text-[10px] text-stone-400 block font-medium">
                {selectedStylist.reviewCount} clientes satisfaites
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Donner mon avis</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Merci infiniment pour votre avis ! Il a été publié avec succès.</span>
        </div>
      )}

      {/* New Review Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-semibold text-stone-100 font-editorial">
                Partagez votre expérience
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Votre nom et prénom :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sophie Laurent"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Star Rating Interactive Selector */}
              <div className="space-y-1">
                <label className="text-stone-300 font-medium block">Votre note :</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="text-2xl transition transform hover:scale-110"
                    >
                      <span className={star <= (hoverRating || rating) ? 'text-amber-400' : 'text-stone-700'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-stone-400 font-mono text-xs pl-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Prestation réalisée :</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium block">Lieu de la prestation :</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocationType('salon')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      locationType === 'salon'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    Au Salon
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationType('home')}
                    className={`py-2 px-3 rounded-xl border text-center transition ${
                      locationType === 'home'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    À Domicile
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Votre commentaire :</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Partagez vos impressions sur la coiffure, l'accueil ou le déroulement..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold rounded-xl shadow-md"
                >
                  Publier mon avis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/20 transition-all space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center font-bold text-amber-400 font-editorial border border-stone-700">
                  {rev.clientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-stone-100 text-sm">
                      {rev.clientName}
                    </h4>
                    {rev.verified && (
                      <span className="flex items-center space-x-0.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Prestation vérifiée</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {rev.serviceName} • {formatFrenchDate(rev.date)}
                  </p>
                </div>
              </div>

              {/* Stars & Location */}
              <div className="text-right space-y-1">
                <div className="text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </div>
                {rev.locationType === 'home' ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <Home className="w-2.5 h-2.5" />
                    <span>À domicile</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <Store className="w-2.5 h-2.5" />
                    <span>Au salon</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-200 leading-relaxed italic bg-stone-950/40 p-3.5 rounded-2xl border border-stone-800/60">
              "{rev.comment}"
            </p>

            {/* Stylist reply if any */}
            {rev.stylistReply && (
              <div className="ml-4 sm:ml-6 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300">
                  <CornerDownRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Réponse de {stylists.find(s => s.id === rev.stylistId)?.stylistName || selectedStylist.stylistName} :</span>
                </div>
                <p className="text-xs text-stone-300 pl-5">
                  {rev.stylistReply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
