import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Service, LocationType } from '../../types';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Store, 
  Home, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Phone, 
  User, 
  Mail, 
  MessageSquare, 
  CheckCircle2 
} from 'lucide-react';
import { formatFrenchDate, buildWhatsAppLink } from '../../lib/whatsapp';

export const BookingWizard: React.FC<{ onBookingComplete?: () => void }> = ({ onBookingComplete }) => {
  const { 
    services, 
    selectedStylist, 
    addAppointment, 
    setClientBookingPhone 
  } = useSalon();

  // Wizard step
  const [step, setStep] = useState<number>(1);

  // Available services for the chosen stylist
  const stylistServices = services.filter(s => !s.stylistId || s.stylistId === selectedStylist.id);

  // Form selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(stylistServices[0]?.id || services[0]?.id || '');
  const [locationType, setLocationType] = useState<LocationType>('salon');
  const [address, setAddress] = useState<string>('');
  const [addressDetails, setAddressDetails] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-30');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  
  // Client contact info
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('+212 6 ');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Completed booking state
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [confirmedAptId, setConfirmedAptId] = useState<string>('');

  const selectedService = stylistServices.find(s => s.id === selectedServiceId) || stylistServices[0] || services[0];

  // Price computation in MAD
  const basePrice = selectedService?.price || 0;
  const displacementFee = locationType === 'home' ? selectedStylist.homeExtraFee : 0;
  const totalPrice = basePrice + displacementFee;

  // Available time slots
  const availableSlots = [
    '09:30', '11:00', '12:30', '14:30', '16:00', '17:30', '19:00'
  ];

  const handleNextStep = () => {
    if (step === 2 && locationType === 'home' && !address.trim()) {
      alert("Veuillez renseigner votre adresse à " + selectedStylist.city + " pour la prestation à domicile.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalizeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || clientPhone.trim().length < 8) {
      alert("Veuillez renseigner votre nom et votre numéro de téléphone WhatsApp pour la confirmation.");
      return;
    }

    const newApt = addAppointment({
      stylistId: selectedStylist.id,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || `${clientName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: totalPrice, // in MAD
      durationMinutes: selectedService.durationMinutes,
      date: selectedDate,
      time: selectedTime,
      locationType,
      address: locationType === 'home' ? address : undefined,
      addressDetails: locationType === 'home' ? addressDetails : undefined,
      notes: clientNotes.trim() || undefined,
      status: 'confirmed',
    });

    setClientBookingPhone(clientPhone.trim());
    setConfirmedAptId(newApt.id);
    setIsConfirmed(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    if (onBookingComplete) {
      onBookingComplete();
    }
  };

  // Direct WhatsApp contact link
  const whatsappBookingMsg = selectedService
    ? `Bonjour ${selectedStylist.stylistName} ! Je viens de réserver en ligne pour le ${formatFrenchDate(selectedDate)} à ${selectedTime} (${selectedService.name} - ${totalPrice} MAD). Mon nom est ${clientName}.`
    : `Bonjour ${selectedStylist.stylistName} ! J'aimerais des informations sur vos disponibilités à ${selectedStylist.city}.`;

  const waLink = buildWhatsAppLink(selectedStylist.whatsappNumber, whatsappBookingMsg);

  if (isConfirmed) {
    return (
      <div className="bg-stone-900/90 border border-amber-500/40 rounded-3xl p-8 max-w-2xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-300 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mono">
            Réservation Confirmée • {selectedStylist.city}
          </span>
          <h2 className="text-2xl font-semibold text-stone-100 font-editorial">
            Chokran {clientName}, votre rendez-vous est enregistré !
          </h2>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Vous recevrez un rappel automatique sur WhatsApp au numéro <strong className="text-stone-200 font-mono">{clientPhone}</strong> la veille de la prestation.
          </p>
        </div>

        {/* Recap card */}
        <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-stone-800">
            <span className="text-stone-400">Coiffeur & Salon :</span>
            <span className="font-semibold text-amber-300">{selectedStylist.stylistName} ({selectedStylist.salonName})</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-stone-800">
            <span className="text-stone-400">Prestation :</span>
            <span className="font-semibold text-stone-100">{selectedService.name}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-stone-800">
            <span className="text-stone-400">Date & Heure :</span>
            <span className="font-semibold text-amber-400 font-mono">
              {formatFrenchDate(selectedDate)} à {selectedTime}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-stone-800">
            <span className="text-stone-400">Lieu :</span>
            <span className="text-stone-200">
              {locationType === 'salon'
                ? `Au Salon (${selectedStylist.address}, ${selectedStylist.city})`
                : `À Domicile (${address})`}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold pt-1">
            <span className="text-stone-200">Total à régler sur place :</span>
            <span className="text-amber-400 font-mono text-base">{totalPrice} MAD</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold shadow-lg transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Échanger sur WhatsApp avec {selectedStylist.stylistName.split(' ')[0]}</span>
          </a>

          <button
            onClick={() => {
              setIsConfirmed(false);
              setStep(1);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition"
          >
            Faire une autre réservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6 shadow-2xl">
      
      {/* Step Indicator Header */}
      <div className="border-b border-stone-800 pb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mono">
              Réservation avec {selectedStylist.stylistName} ({selectedStylist.city})
            </span>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Étape {step} sur 4
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Select Service / Hairstyle */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-semibold text-stone-100 font-editorial">
              1. Choisissez votre prestation & coiffure
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Soins haute couture et rituels personnalisés chez {selectedStylist.salonName}.
            </p>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {stylistServices.map((srv) => {
              const isSelected = srv.id === selectedServiceId;

              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-stone-950 border-amber-500 ring-1 ring-amber-500/30 shadow-md'
                      : 'bg-stone-950/40 border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-stone-100 text-sm">
                        {srv.name}
                      </span>
                      {srv.popular && (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase font-semibold">
                          Populaire
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-2">
                      {srv.description}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-stone-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{srv.durationMinutes} min</span>
                      </span>
                      <span>•</span>
                      <span>
                        {srv.salonAvailable && srv.homeAvailable
                          ? 'Au Salon & Domicile'
                          : srv.salonAvailable ? 'Au Salon uniquement' : 'À Domicile uniquement'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {srv.price} MAD
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-800">
            <button
              onClick={handleNextStep}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-xs shadow-md transition"
            >
              <span>Continuer vers le lieu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location (Salon vs Domicile with address input) */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-semibold text-stone-100 font-editorial">
              2. Où souhaitez-vous réaliser votre coiffure ?
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Profitez du cocon du salon à {selectedStylist.city} ou de l'exclusivité du service à domicile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Salon Option */}
            <div
              onClick={() => setLocationType('salon')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 space-y-3 ${
                locationType === 'salon'
                  ? 'bg-stone-950 border-amber-500 ring-1 ring-amber-500/30'
                  : 'bg-stone-950/40 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-amber-400 font-mono">
                  Inclus (0 MAD)
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-stone-100 text-sm">
                  Au Salon Privé
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  {selectedStylist.address}, {selectedStylist.city}
                </p>
                <p className="text-[11px] text-stone-500 mt-2">
                  Thé marocain offert, bacs massants et cadre intimiste haut de gamme.
                </p>
              </div>
            </div>

            {/* Domicile Option */}
            {selectedStylist.acceptsHomeBooking ? (
              <div
                onClick={() => setLocationType('home')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 space-y-3 ${
                  locationType === 'home'
                    ? 'bg-stone-950 border-emerald-500 ring-1 ring-emerald-500/30'
                    : 'bg-stone-950/40 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Home className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">
                    +{selectedStylist.homeExtraFee} MAD déplacement
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-100 text-sm">
                    À votre Domicile
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Déplacement dans tout {selectedStylist.city} et périphérie ({selectedStylist.homeRadiusKm} km)
                  </p>
                  <p className="text-[11px] text-stone-500 mt-2">
                    Le coiffeur apporte tout le matériel professionnel sans que vous n'ayez rien à préparer.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl border border-stone-800/50 bg-stone-950/20 opacity-60 space-y-2">
                <span className="text-xs text-stone-500">Service à domicile non disponible pour ce coiffeur.</span>
                <p className="text-xs text-stone-400">Ce coiffeur vous reçoit exclusivement dans son salon privé.</p>
              </div>
            )}

          </div>

          {/* Domicile address inputs if home selected */}
          {locationType === 'home' && (
            <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-500/30 space-y-3 text-xs animate-in fade-in duration-200">
              <span className="font-semibold text-emerald-300 block">
                Précisez votre adresse à {selectedStylist.city} :
              </span>

              <div className="space-y-1">
                <label className="text-stone-300">Quartier, Résidence, Villa ou Rue : *</label>
                <input
                  type="text"
                  required
                  placeholder={`Ex: Villa 12, Quartier Racine, ${selectedStylist.city}`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400">Précisions d'accès (Étage, numéro d'appartement, digicode) :</label>
                <input
                  type="text"
                  placeholder="Ex: Immeuble B, 2e étage, sonnette au nom de..."
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              onClick={handlePrevStep}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs hover:bg-stone-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <button
              onClick={handleNextStep}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-xs shadow-md transition"
            >
              <span>Choisir la date & l'heure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Date & Time slot */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-semibold text-stone-100 font-editorial">
              3. Choisissez le jour et l'heure
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Disponibilités en direct dans l'agenda de {selectedStylist.stylistName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-2">
              <label className="text-stone-300 font-medium block">Date du rendez-vous :</label>
              <input
                type="date"
                min="2026-09-28"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-3 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-amber-400 font-medium">
                📅 {formatFrenchDate(selectedDate)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-stone-300 font-medium block">Créneaux horaires disponibles :</label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-xl border text-center font-mono font-medium transition ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-md'
                          : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              onClick={handlePrevStep}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs hover:bg-stone-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <button
              onClick={handleNextStep}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-xs shadow-md transition"
            >
              <span>Vos coordonnées</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Client contact details & Final Confirmation */}
      {step === 4 && (
        <form onSubmit={handleFinalizeBooking} className="space-y-5 animate-in fade-in duration-200 text-xs">
          <div>
            <h3 className="text-xl font-semibold text-stone-100 font-editorial">
              4. Vos coordonnées & récapitulatif
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Renseignez votre numéro WhatsApp pour recevoir le rappel automatique avant le rendez-vous.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Nom & Prénom : *</label>
              <input
                type="text"
                required
                placeholder="Ex: Kenza Bennani"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Téléphone WhatsApp (Maroc) : *</label>
              <input
                type="tel"
                required
                placeholder="+212 6 12 34 56 78"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Adresse Email (confirmation) :</label>
              <input
                type="email"
                placeholder="kenza@gmail.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Notes & souhaits pour le coiffeur :</label>
              <input
                type="text"
                placeholder="Ex: Envie d'un blond beige froid, cheveux épais..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Price Breakdown in MAD */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
            <span className="text-xs font-semibold text-stone-200 block uppercase tracking-wider">
              Récapitulatif de la commande :
            </span>
            <div className="flex justify-between text-stone-400">
              <span>{selectedService.name} :</span>
              <span className="text-stone-200 font-mono">{basePrice} MAD</span>
            </div>
            {locationType === 'home' && (
              <div className="flex justify-between text-emerald-400">
                <span>Déplacement domicile ({selectedStylist.city}) :</span>
                <span className="font-mono">+{displacementFee} MAD</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm font-bold text-amber-400 pt-2 border-t border-stone-800">
              <span>Total à régler :</span>
              <span className="font-mono text-base">{totalPrice} MAD</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs hover:bg-stone-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>Confirmer mon Rendez-vous ({totalPrice} MAD)</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
