import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Review } from '../../types';
import { 
  Star, 
  MessageSquare, 
  Sparkles, 
  CheckCircle, 
  Store, 
  Home, 
  CornerDownRight, 
  Send,
  ThumbsUp
} from 'lucide-react';
import { formatFrenchDate } from '../../lib/whatsapp';

export const ReviewsManagementTab: React.FC = () => {
  const { reviews, replyToReview, currentStylist } = useSalon();
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const stylistReviews = reviews.filter(
    r => !r.stylistId || r.stylistId === currentStylist.id
  );

  const filteredReviews = stylistReviews.filter((r) => {
    if (filterRating !== 'all' && r.rating !== filterRating) return false;
    return true;
  });

  const handlePostReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());
    setSelectedReviewId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-100 font-editorial tracking-wide">
              Gestion Intuitive des Avis Clients
            </h2>
            <p className="text-xs text-stone-400">
              Consultez les retours d'expérience, répondez publiquement et renforcez votre e-réputation
            </p>
          </div>
        </div>

        {/* Global Rating Score Pill */}
        <div className="flex items-center space-x-3 bg-stone-950 p-2.5 px-4 rounded-2xl border border-amber-500/30">
          <div className="text-right">
            <span className="text-xl font-bold text-amber-400 font-mono">
              {currentStylist.rating}
            </span>
            <span className="text-stone-400 text-xs">/5</span>
          </div>
          <div className="border-l border-stone-800 pl-3">
            <div className="flex text-amber-400 text-xs">
              {'★'.repeat(5)}
            </div>
            <span className="text-[10px] text-stone-400 block">
              {currentStylist.reviewCount} avis vérifiés
            </span>
          </div>
        </div>
      </div>

      {/* Ratings distribution & Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Filter on left */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-stone-900/70 p-5 rounded-2xl border border-stone-800 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
              Filtrer par note
            </span>

            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setFilterRating('all')}
                className={`w-full py-2 px-3 rounded-xl border text-left flex justify-between items-center transition ${
                  filterRating === 'all'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>Tous les avis</span>
                <span className="font-mono">{reviews.length}</span>
              </button>

              <button
                onClick={() => setFilterRating(5)}
                className={`w-full py-2 px-3 rounded-xl border text-left flex justify-between items-center transition ${
                  filterRating === 5
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>5 étoiles ★★★★★</span>
                <span className="font-mono">{reviews.filter(r => r.rating === 5).length}</span>
              </button>

              <button
                onClick={() => setFilterRating(4)}
                className={`w-full py-2 px-3 rounded-xl border text-left flex justify-between items-center transition ${
                  filterRating === 4
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>4 étoiles ★★★★☆</span>
                <span className="font-mono">{reviews.filter(r => r.rating === 4).length}</span>
              </button>
            </div>
          </div>

          {/* Social Proof Tip Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-950 to-stone-900 border border-stone-800 text-xs space-y-2 text-stone-300">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Conseil e-réputation</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-400">
              Répondre avec bienveillance à chaque avis même par un simple mot renforce la fidélisation de vos clientes de 35% et incite les nouveaux visiteurs à réserver.
            </p>
          </div>
        </div>

        {/* Reviews List on right */}
        <div className="lg:col-span-8 space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center text-stone-500 bg-stone-900/40 rounded-2xl border border-stone-800">
              Aucun avis correspondant aux critères.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-stone-100 text-sm">
                        {rev.clientName}
                      </h4>
                      {rev.verified && (
                        <span className="flex items-center space-x-0.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>Client vérifié</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {rev.serviceName} • {formatFrenchDate(rev.date)}
                    </p>
                  </div>

                  {/* Stars & Location */}
                  <div className="text-right space-y-1">
                    <div className="text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                    {rev.locationType === 'home' ? (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <Home className="w-2.5 h-2.5" />
                        <span>Domicile</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <Store className="w-2.5 h-2.5" />
                        <span>Salon</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-xs text-stone-200 leading-relaxed italic bg-stone-950/40 p-3 rounded-xl border border-stone-800/50">
                  "{rev.comment}"
                </p>

                {/* Existing Stylist Reply */}
                {rev.stylistReply ? (
                  <div className="ml-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300">
                      <CornerDownRight className="w-3.5 h-3.5 text-amber-400" />
                      <span>Réponse de {currentStylist.stylistName} :</span>
                    </div>
                    <p className="text-xs text-stone-300 pl-5">
                      {rev.stylistReply}
                    </p>
                    {rev.stylistReplyDate && (
                      <span className="block text-[10px] text-stone-500 pl-5 pt-0.5">
                        Postée le {formatFrenchDate(rev.stylistReplyDate)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    {selectedReviewId === rev.id ? (
                      <div className="pt-2 space-y-2 animate-in fade-in duration-200">
                        <textarea
                          rows={2}
                          placeholder={`Votre réponse publique à ${rev.clientName}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedReviewId(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handlePostReply(rev.id)}
                            className="px-3 py-1 rounded-lg bg-amber-500 text-stone-950 font-semibold text-xs flex items-center space-x-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Publier la réponse</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedReviewId(rev.id);
                          setReplyText(`Merci beaucoup ${rev.clientName} pour ce superbe retour ! Au plaisir de vous revoir très bientôt.`);
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 transition pt-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Répondre à cet avis</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
