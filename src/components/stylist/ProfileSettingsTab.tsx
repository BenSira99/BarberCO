import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { StylistProfile } from '../../types';
import { 
  Settings, 
  Store, 
  Home, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  Check, 
  Instagram,
  Save
} from 'lucide-react';

export const ProfileSettingsTab: React.FC = () => {
  const { currentStylist, updateStylistProfile } = useSalon();

  const [formData, setFormData] = useState<StylistProfile>(currentStylist);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setFormData(currentStylist);
  }, [currentStylist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStylistProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleHourChange = (day: string, field: 'open' | 'close' | 'closed', value: any) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-100 font-editorial tracking-wide">
              Configuration du Salon & Déplacements Domicile
            </h2>
            <p className="text-xs text-stone-400">
              Coordonnées, numéro WhatsApp officiel, rayon de déplacement et horaires
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Modifications enregistrées avec succès !</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Salon Identity & Contact */}
        <div className="bg-stone-900/70 p-6 rounded-2xl border border-stone-800 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
            Identité du Salon & Coiffeur
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Nom de l'établissement :</label>
              <input
                type="text"
                required
                value={formData.salonName}
                onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Nom du / de la coiffeuse :</label>
              <input
                type="text"
                required
                value={formData.stylistName}
                onChange={(e) => setFormData({ ...formData, stylistName: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Titre professionnel :</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Compte Instagram :</label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-stone-300 font-medium">Présentation & Bio (affichée aux clients) :</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Coordonnées & WhatsApp */}
        <div className="bg-stone-900/70 p-6 rounded-2xl border border-stone-800 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
            Coordonnées & Intégration WhatsApp
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Numéro WhatsApp (Format international) :</label>
              <input
                type="text"
                required
                placeholder="Ex: 212642198805 (sans +)"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-stone-500 block">
                Ce numéro reçoit les messages des clients et envoie les rappels.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Téléphone d'appel :</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Email professionnel :</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Localisation Salon & Domicile parameters */}
        <div className="bg-stone-900/70 p-6 rounded-2xl border border-stone-800 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
            Paramètres Salon & Domicile
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-stone-300 font-medium">Adresse du Salon Privé :</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Ville & Code postal :</label>
              <input
                type="text"
                required
                value={`${formData.postalCode} ${formData.city}`}
                onChange={(e) => {
                  const parts = e.target.value.split(' ');
                  setFormData({
                    ...formData,
                    postalCode: parts[0] || '20000',
                    city: parts.slice(1).join(' ') || 'Casablanca'
                  });
                }}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptsHomeBooking}
                  onChange={(e) => setFormData({ ...formData, acceptsHomeBooking: e.target.checked })}
                  className="rounded border-stone-800 text-emerald-500 focus:ring-0"
                />
                <span className="font-semibold text-emerald-300">Activer les réservations à Domicile</span>
              </label>
            </div>

            {formData.acceptsHomeBooking && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-stone-300">Rayon d'intervention maximal :</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={5}
                      max={150}
                      value={formData.homeRadiusKm}
                      onChange={(e) => setFormData({ ...formData, homeRadiusKm: Number(e.target.value) })}
                      className="w-24 bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5 text-stone-100 font-mono"
                    />
                    <span className="text-stone-400">kilomètres</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300">Supplément déplacement domicile :</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={formData.homeExtraFee}
                      onChange={(e) => setFormData({ ...formData, homeExtraFee: Number(e.target.value) })}
                      className="w-24 bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5 text-stone-100 font-mono"
                    />
                    <span className="text-stone-400">MAD par réservation</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-stone-900/70 p-6 rounded-2xl border border-stone-800 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
            Horaires d'Ouverture
          </span>

          <div className="space-y-2">
            {Object.entries(formData.openingHours).map(([day, val]) => (
              <div
                key={day}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 text-xs"
              >
                <span className="capitalize font-medium text-stone-200 w-28">
                  {day}
                </span>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-1.5 text-stone-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={val.closed}
                      onChange={(e) => handleHourChange(day, 'closed', e.target.checked)}
                      className="rounded border-stone-800 text-amber-500"
                    />
                    <span>Fermé</span>
                  </label>

                  {!val.closed && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={val.open}
                        onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                        className="bg-stone-900 border border-stone-800 rounded px-2 py-1 text-stone-200 font-mono"
                      />
                      <span className="text-stone-500">à</span>
                      <input
                        type="time"
                        value={val.close}
                        onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                        className="bg-stone-900 border border-stone-800 rounded px-2 py-1 text-stone-200 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold rounded-2xl shadow-xl transition"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer la configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
