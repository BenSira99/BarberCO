import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Client } from '../../types';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  MessageCircle, 
  Sparkles, 
  Edit3, 
  Check, 
  UserPlus, 
  Clock,
  Heart
} from 'lucide-react';
import { formatFrenchDate, buildWhatsAppLink } from '../../lib/whatsapp';

export const ClientsTab: React.FC = () => {
  const { 
    clients, 
    appointments, 
    updateClientNotes, 
    currentStylist 
  } = useSalon();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter clients for current stylist
  const stylistClients = clients.filter(c => !c.stylistId || c.stylistId === currentStylist.id);

  const filteredClients = stylistClients.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.hairType && c.hairType.toLowerCase().includes(q))
    );
  });

  const [selectedClientId, setSelectedClientId] = useState<string>(stylistClients[0]?.id || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedHairType, setEditedHairType] = useState('');

  const selectedClient = stylistClients.find(c => c.id === selectedClientId) || stylistClients[0];

  // Appointment history for the selected client
  const clientAppointments = appointments.filter(
    a => a.clientPhone === selectedClient?.phone || a.clientEmail === selectedClient?.email
  ).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const handleStartEdit = () => {
    if (!selectedClient) return;
    setEditedNotes(selectedClient.notes || '');
    setEditedHairType(selectedClient.hairType || '');
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    if (!selectedClient) return;
    updateClientNotes(selectedClient.id, editedNotes, editedHairType);
    setIsEditingNotes(false);
  };

  const handleDirectWhatsApp = (client: Client) => {
    const text = `Bonjour ${client.name} ! C'est ${currentStylist.stylistName} de ${currentStylist.salonName}. J'espère que vous allez bien !`;
    const link = buildWhatsAppLink(client.phone, text);
    window.open(link, '_blank');
  };

  // KPIs in MAD
  const totalRevenueAllClients = stylistClients.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageSpentPerClient = stylistClients.length ? Math.round(totalRevenueAllClients / stylistClients.length) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-100 font-editorial tracking-wide">
              Fichier Client & Diagnostics Capillaires • {currentStylist.city}
            </h2>
            <p className="text-xs text-stone-400">
              Historique complet des visites, diagnostics du cheveu et dépenses cumulées en Dirhams (MAD)
            </p>
          </div>
        </div>

        {/* Global Stats Badges in MAD */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-stone-400 block text-[10px]">Total Clients :</span>
            <span className="font-semibold text-stone-200">{stylistClients.length} fiches</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-stone-950 border border-amber-500/30">
            <span className="text-amber-400/80 block text-[10px]">Panier moyen client :</span>
            <span className="font-semibold text-amber-300 font-mono">{averageSpentPerClient} MAD</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Client List on left, Full Dossier on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Client Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher nom, téléphone marocain, cheveu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900/70 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/40"
            />
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredClients.map((client) => {
              const isSelected = client.id === selectedClientId;

              return (
                <div
                  key={client.id}
                  onClick={() => {
                    setSelectedClientId(client.id);
                    setIsEditingNotes(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-stone-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-stone-900/40 border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center font-editorial font-bold text-amber-400 text-sm border border-stone-700">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-100 text-xs">
                          {client.name}
                        </h4>
                        <p className="text-[11px] text-stone-400 font-mono">
                          {client.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-amber-400 font-mono">
                        {client.totalSpent} MAD
                      </span>
                      <span className="block text-[10px] text-stone-500">
                        {client.totalBookings} RDV
                      </span>
                    </div>
                  </div>

                  {client.hairType && (
                    <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300 truncate">
                      ✨ {client.hairType}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Client Dossier */}
        <div className="lg:col-span-7 space-y-4">
          {selectedClient ? (
            <div className="bg-stone-900/70 p-6 rounded-2xl border border-stone-800 space-y-6">
              
              {/* Client Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1px]">
                    <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center text-xl font-bold font-editorial text-amber-400">
                      {selectedClient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-100 font-editorial">
                      {selectedClient.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span className="font-mono">{selectedClient.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-amber-400" />
                        <span>{selectedClient.email}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDirectWhatsApp(selectedClient)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Stats overview boxes in MAD */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Total réservations
                  </span>
                  <span className="text-base font-bold text-stone-100">
                    {selectedClient.totalBookings}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Dépense cumulée
                  </span>
                  <span className="text-base font-bold text-amber-400 font-mono">
                    {selectedClient.totalSpent} MAD
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Dernière visite
                  </span>
                  <span className="text-xs font-semibold text-stone-200 mt-1 block">
                    {formatFrenchDate(selectedClient.lastVisit)}
                  </span>
                </div>
              </div>

              {/* Domicile address if present */}
              {selectedClient.address && (
                <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-xs flex items-start space-x-2 text-stone-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-200">Adresse habituelle domicile :</span>{' '}
                    <span>{selectedClient.address}</span>
                  </div>
                </div>
              )}

              {/* Hair Diagnostic & Stylist Notes */}
              <div className="space-y-3 p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Diagnostic & Notes Coiffeur</span>
                  </span>

                  {!isEditingNotes ? (
                    <button
                      onClick={handleStartEdit}
                      className="text-xs text-stone-400 hover:text-amber-300 flex items-center space-x-1 transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Modifier la fiche</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveNotes}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition font-medium"
                    >
                      <Check className="w-3 h-3" />
                      <span>Enregistrer</span>
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="space-y-1">
                      <label className="text-stone-400">Nature & texture des cheveux :</label>
                      <input
                        type="text"
                        value={editedHairType}
                        onChange={(e) => setEditedHairType(e.target.value)}
                        placeholder="Ex: Cheveux frisés, sensibles à la décoloration..."
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-400">Notes privées (formules, préférences, boissons...) :</label>
                      <textarea
                        rows={3}
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        placeholder="Ex: Formule patine blond beige, thé à la menthe..."
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Type de cheveux :</span>
                      <p className="text-stone-200 font-medium">
                        {selectedClient.hairType || 'Non renseigné'}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Notes stylistiques :</span>
                      <p className="text-stone-300 italic bg-stone-900/50 p-2.5 rounded-lg border border-stone-800/60">
                        {selectedClient.notes || 'Aucune note particulière pour le moment.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Appointment History for this client */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
                  Historique des rendez-vous ({clientAppointments.length})
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {clientAppointments.length === 0 ? (
                    <p className="text-xs text-stone-500 italic">Aucun rendez-vous passé.</p>
                  ) : (
                    clientAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-stone-200">{apt.serviceName}</p>
                          <p className="text-[11px] text-stone-400">
                            {formatFrenchDate(apt.date)} à {apt.time} ({apt.locationType === 'salon' ? 'Salon' : 'Domicile'})
                          </p>
                        </div>
                        <span className="font-semibold text-amber-400 font-mono">{apt.price} MAD</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-stone-500">
              Sélectionnez une fiche client à gauche
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
