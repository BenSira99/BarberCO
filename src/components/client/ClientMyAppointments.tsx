import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Appointment } from '../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Store, 
  Home, 
  Phone, 
  MessageCircle, 
  XCircle, 
  CheckCircle2, 
  Search,
  Sparkles
} from 'lucide-react';
import { formatFrenchDate, buildWhatsAppLink } from '../../lib/whatsapp';

export const ClientMyAppointments: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { 
    appointments, 
    updateAppointmentStatus, 
    stylists, 
    clientBookingPhone, 
    setClientBookingPhone 
  } = useSalon();
  
  const [phoneQuery, setPhoneQuery] = useState<string>(clientBookingPhone || '+212 6 12 34 56 78');

  // Filter appointments for this client's phone
  const clientAppointments = appointments.filter(a => {
    const cleanQ = phoneQuery.replace(/[^0-9]/g, '');
    const cleanP = a.clientPhone.replace(/[^0-9]/g, '');
    return cleanQ.length >= 6 && cleanP.includes(cleanQ);
  }).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const handleCancelAppointment = (id: string) => {
    if (confirm("Êtes-vous sûr(e) de vouloir annuler ce rendez-vous ?")) {
      updateAppointmentStatus(id, 'cancelled');
    }
  };

  const handleContactStylist = (apt: Appointment) => {
    const stylist = stylists.find(s => s.id === apt.stylistId) || stylists[0];
    const text = `Bonjour ${stylist.stylistName} ! J'ai une question concernant mon rendez-vous du ${formatFrenchDate(apt.date)} à ${apt.time} (${apt.serviceName}).`;
    const link = buildWhatsAppLink(stylist.whatsappNumber, text);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner & Phone lookup */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-100 font-editorial">
              Mes Rendez-vous & Suivi
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Retrouvez toutes vos réservations passées et à venir auprès de nos salons au Maroc
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition shadow-md self-start sm:self-auto"
          >
            + Prendre un nouveau RDV
          </button>
        </div>

        {/* Phone Filter */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-stone-300">
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Votre numéro de téléphone utilisé lors de la réservation :</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={phoneQuery}
              onChange={(e) => {
                setPhoneQuery(e.target.value);
                setClientBookingPhone(e.target.value);
              }}
              placeholder="+212 6 12 34 56 78"
              className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5 text-stone-100 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* List of Appointments */}
      <div className="space-y-4">
        {clientAppointments.length === 0 ? (
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-stone-600 mx-auto" />
            <p className="text-stone-300 font-medium text-sm">
              Aucun rendez-vous trouvé pour ce numéro
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Vérifiez le numéro saisi ci-dessus ou réservez un créneau dès aujourd'hui auprès de nos coiffeurs partenaires.
            </p>
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md"
            >
              <span>Réserver maintenant</span>
            </button>
          </div>
        ) : (
          clientAppointments.map((apt) => {
            const isHome = apt.locationType === 'home';
            const stylist = stylists.find(s => s.id === apt.stylistId) || stylists[0];

            return (
              <div
                key={apt.id}
                className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/30 rounded-3xl p-6 space-y-4 transition shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-center min-w-[75px]">
                      <span className="text-base font-bold text-amber-400 font-mono block">
                        {apt.time}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        {apt.durationMinutes} min
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-stone-100 text-base font-editorial">
                          {apt.serviceName}
                        </h3>
                        {isHome ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                            <Home className="w-2.5 h-2.5" />
                            <span>À Domicile</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center space-x-1">
                            <Store className="w-2.5 h-2.5" />
                            <span>Au Salon</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-amber-400 font-medium mt-1">
                        📅 {formatFrenchDate(apt.date)} • Coiffeur : <strong className="text-stone-200">{stylist.stylistName} ({stylist.city})</strong>
                      </p>

                      <p className="text-xs text-stone-400 mt-0.5">
                        {isHome ? `Lieu : ${apt.address || 'Votre domicile'}` : `Lieu : ${stylist.address}, ${stylist.city}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {apt.price} MAD
                    </span>

                    <div>
                      {apt.status === 'confirmed' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                          ✓ Rendez-vous Confirmé
                        </span>
                      )}
                      {apt.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                          ⏳ En cours de validation
                        </span>
                      )}
                      {apt.status === 'completed' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-stone-800 text-stone-400 border border-stone-700 font-medium">
                          Réalisé
                        </span>
                      )}
                      {apt.status === 'cancelled' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                          Annulé
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reminder note */}
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-stone-400 flex items-center space-x-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {apt.reminderSent
                        ? 'Rappel WhatsApp reçu sur votre mobile.'
                        : 'Un rappel automatique WhatsApp vous sera envoyé la veille.'}
                    </span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleContactStylist(apt)}
                      className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium transition"
                    >
                      Écrire sur WhatsApp
                    </button>

                    {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-rose-900/40 text-stone-400 hover:text-rose-300 transition"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
