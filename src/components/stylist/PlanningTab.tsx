import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Appointment, LocationType, AppointmentStatus } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Home, 
  Store, 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  User, 
  Plus, 
  Filter, 
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { formatFrenchDate, buildWhatsAppLink, generateReminderMessage } from '../../lib/whatsapp';
import { InteractiveMonthCalendar } from './InteractiveMonthCalendar';

export const PlanningTab: React.FC = () => {
  const { 
    appointments, 
    updateAppointmentStatus, 
    markReminderSent, 
    currentStylist, 
    templates,
    services,
    addAppointment 
  } = useSalon();

  const [filterLocation, setFilterLocation] = useState<'all' | LocationType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | AppointmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-28');
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = (date?: string, time?: string) => {
    if (date) setNewDate(date);
    if (time) setNewTime(time);
    setIsAddModalOpen(true);
  };

  // Available services for this stylist
  const stylistServices = services.filter(s => !s.stylistId || s.stylistId === currentStylist.id);

  // New appointment manual modal state
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('+212 6 ');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newServiceId, setNewServiceId] = useState(stylistServices[0]?.id || services[0]?.id || '');
  const [newDate, setNewDate] = useState('2026-09-29');
  const [newTime, setNewTime] = useState('14:00');
  const [newLocationType, setNewLocationType] = useState<LocationType>('salon');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Filtered appointments for this specific stylist
  const filteredAppointments = appointments.filter((apt) => {
    if (apt.stylistId && apt.stylistId !== currentStylist.id) return false;
    if (filterLocation !== 'all' && apt.locationType !== filterLocation) return false;
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.clientName.toLowerCase().includes(q);
      const matchPhone = apt.clientPhone.includes(q);
      const matchService = apt.serviceName.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchService) return false;
    }
    return true;
  });

  // Appointments for currently selected date
  const appointmentsForDate = filteredAppointments
    .filter(a => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Quick stats for the day in MAD
  const dailyTotal = appointmentsForDate
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.price, 0);

  const handleSendWhatsApp = (apt: Appointment) => {
    const template = templates.find(t => t.isDefault) || templates[0];
    const message = generateReminderMessage(template.content, apt, currentStylist);
    const link = buildWhatsAppLink(apt.clientPhone, message);
    markReminderSent(apt.id);
    window.open(link, '_blank');
  };

  const handleCreateManualAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const service = stylistServices.find(s => s.id === newServiceId) || stylistServices[0] || services[0];
    const basePrice = service.price;
    const finalPrice = newLocationType === 'home' ? basePrice + currentStylist.homeExtraFee : basePrice;

    addAppointment({
      stylistId: currentStylist.id,
      clientName: newClientName || 'Client Manuel',
      clientPhone: newClientPhone || '+212 6 00 00 00 00',
      clientEmail: newClientEmail || 'client@email.ma',
      serviceId: service.id,
      serviceName: service.name,
      price: finalPrice, // MAD
      durationMinutes: service.durationMinutes,
      date: newDate,
      time: newTime,
      locationType: newLocationType,
      address: newLocationType === 'home' ? newAddress : undefined,
      notes: newNotes,
      status: 'confirmed',
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewClientName('');
    setNewClientPhone('+212 6 ');
    setNewClientEmail('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-100 font-editorial tracking-wide">
              Planning & Rendez-vous • {currentStylist.salonName} ({currentStylist.city})
            </h2>
            <p className="text-xs text-stone-400">
              Gérez vos créneaux au salon et à domicile avec rappels WhatsApp automatiques en MAD
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleOpenAddModal(selectedDate)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau RDV Manuel</span>
          </button>
        </div>
      </div>

      {/* Sub-view switcher: Calendrier Mensuel Interactif vs Agenda Quotidien */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/60 p-2 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setViewMode('month')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'month'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendrier Mensuel (Disponibilités des créneaux)</span>
          </button>
          
          <button
            onClick={() => setViewMode('day')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'day'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Agenda & Détail Jour ({appointmentsForDate.length} RDV)</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-400 px-3">
          <span>Date sélectionnée :</span>
          <span className="font-semibold text-amber-300 font-mono">
            {formatFrenchDate(selectedDate)}
          </span>
        </div>
      </div>

      {viewMode === 'month' ? (
        <InteractiveMonthCalendar
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
          onOpenNewAppointmentModal={(preDate, preTime) => handleOpenAddModal(preDate, preTime)}
        />
      ) : (
        /* Date Navigator & Filters */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Date Selector & Calendar Overview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-stone-900/70 p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-amber-400">
                Date sélectionnée
              </span>
              <div className="text-xs text-stone-400">
                {formatFrenchDate(selectedDate)}
              </div>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-200 text-sm focus:outline-none focus:border-amber-500/50"
            />

            {/* Quick date shortcuts */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setSelectedDate('2026-09-28')}
                className={`flex-1 py-1.5 px-2 text-xs rounded-lg border text-center transition ${
                  selectedDate === '2026-09-28'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setSelectedDate('2026-09-29')}
                className={`flex-1 py-1.5 px-2 text-xs rounded-lg border text-center transition ${
                  selectedDate === '2026-09-29'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                Demain
              </button>
              <button
                onClick={() => setSelectedDate('2026-09-30')}
                className={`flex-1 py-1.5 px-2 text-xs rounded-lg border text-center transition ${
                  selectedDate === '2026-09-30'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                Mercredi
              </button>
            </div>

            {/* Daily summary card */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-stone-950 to-stone-900 border border-amber-500/20 space-y-2">
              <div className="flex justify-between items-center text-xs text-stone-400">
                <span>Rendez-vous prévus :</span>
                <span className="font-semibold text-stone-200">{appointmentsForDate.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-400">
                <span>Recette estimée du jour :</span>
                <span className="font-semibold text-amber-400 text-sm font-mono">{dailyTotal} MAD</span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-400">
                <span>Salon vs Domicile :</span>
                <span className="text-stone-300">
                  {appointmentsForDate.filter(a => a.locationType === 'salon').length} salon / {appointmentsForDate.filter(a => a.locationType === 'home').length} dom.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="bg-stone-900/70 p-5 rounded-2xl border border-stone-800 space-y-3">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Filtres de consultation
            </span>
            
            <div className="space-y-2 text-xs">
              <label className="text-stone-400 block">Lieu de prestation :</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setFilterLocation('all')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition ${
                    filterLocation === 'all'
                      ? 'bg-stone-800 border-amber-500/40 text-amber-300 font-medium'
                      : 'bg-stone-950/50 border-stone-800/80 text-stone-400'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterLocation('salon')}
                  className={`py-1.5 px-2 rounded-lg border text-center flex items-center justify-center space-x-1 transition ${
                    filterLocation === 'salon'
                      ? 'bg-stone-800 border-amber-500/40 text-amber-300 font-medium'
                      : 'bg-stone-950/50 border-stone-800/80 text-stone-400'
                  }`}
                >
                  <Store className="w-3 h-3" />
                  <span>Salon</span>
                </button>
                <button
                  onClick={() => setFilterLocation('home')}
                  className={`py-1.5 px-2 rounded-lg border text-center flex items-center justify-center space-x-1 transition ${
                    filterLocation === 'home'
                      ? 'bg-stone-800 border-amber-500/40 text-amber-300 font-medium'
                      : 'bg-stone-950/50 border-stone-800/80 text-stone-400'
                  }`}
                >
                  <Home className="w-3 h-3" />
                  <span>Domicile</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <label className="text-stone-400 block">Statut :</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`py-1.5 px-2 rounded-lg border text-center ${
                    filterStatus === 'all'
                      ? 'bg-stone-800 border-amber-500/40 text-amber-300 font-medium'
                      : 'bg-stone-950/50 border-stone-800/80 text-stone-400'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterStatus('confirmed')}
                  className={`py-1.5 px-2 rounded-lg border text-center ${
                    filterStatus === 'confirmed'
                      ? 'bg-stone-800 border-amber-500/40 text-amber-300 font-medium'
                      : 'bg-stone-950/50 border-stone-800/80 text-stone-400'
                  }`}
                >
                  Confirmés
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`py-1.5 px-2 rounded-lg border text-center ${
                    filterStatus === 'pending'
                      ? 'bg-stone-800 border-amber-500/40 text-amber-300 font-medium'
                      : 'bg-stone-950/50 border-stone-800/80 text-stone-400'
                  }`}
                >
                  En attente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline / Appointment Cards */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher par cliente, téléphone ou coiffure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900/60 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/40"
            />
          </div>

          {/* List of appointments */}
          {appointmentsForDate.length === 0 ? (
            <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-12 text-center space-y-3">
              <CalendarIcon className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="text-stone-300 font-medium text-sm">
                Aucun rendez-vous pour le {formatFrenchDate(selectedDate)}
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Ce jour est libre dans votre agenda. Vous pouvez ajouter un rendez-vous manuel ou changer de date ci-contre.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl transition"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un créneau</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {appointmentsForDate.map((apt) => {
                const isHome = apt.locationType === 'home';

                return (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/30 transition-all duration-200 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Time & Client Name */}
                      <div className="flex items-start space-x-3">
                        <div className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-center min-w-[70px]">
                          <div className="text-sm font-semibold text-amber-400 font-mono">
                            {apt.time}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            {apt.durationMinutes} min
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-stone-100 text-base">
                              {apt.clientName}
                            </h3>
                            {isHome ? (
                              <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                <Home className="w-2.5 h-2.5" />
                                <span>Domicile</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                <Store className="w-2.5 h-2.5" />
                                <span>Salon</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-300 font-medium mt-0.5">
                            {apt.serviceName}
                          </p>
                          <p className="text-[11px] text-stone-400">
                            {apt.clientPhone} • {apt.clientEmail}
                          </p>
                        </div>
                      </div>

                      {/* Price & Status Badge */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                        <span className="text-base font-bold text-amber-400 font-mono">
                          {apt.price} MAD
                        </span>
                        
                        <div className="flex items-center space-x-1.5">
                          {apt.status === 'confirmed' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Confirmé
                            </span>
                          )}
                          {apt.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              En attente
                            </span>
                          )}
                          {apt.status === 'completed' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-400 border border-stone-700">
                              Terminé
                            </span>
                          )}
                          {apt.status === 'cancelled' && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30">
                              Annulé
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Domicile details if applicable */}
                    {isHome && apt.address && (
                      <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 text-xs flex items-start space-x-2 text-stone-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-emerald-300">Adresse d'intervention :</span>{' '}
                          <span>{apt.address}</span>
                          {apt.addressDetails && (
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              Précisions : {apt.addressDetails}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Client Notes if any */}
                    {apt.notes && (
                      <div className="text-xs text-stone-400 italic bg-stone-950/40 p-2 rounded-lg border border-stone-800/40">
                        "{apt.notes}"
                      </div>
                    )}

                    {/* Action Bar: WhatsApp reminder & Status toggles */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/80">
                      
                      {/* WhatsApp Reminder Button */}
                      <button
                        onClick={() => handleSendWhatsApp(apt)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          apt.reminderSent
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/40'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        }`}
                        title="Ouvrir WhatsApp avec message personnalisé"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>
                          {apt.reminderSent ? 'Rappel WhatsApp envoyé (Renvoyer)' : 'Envoyer Rappel WhatsApp'}
                        </span>
                      </button>

                      {/* Status Action Buttons */}
                      <div className="flex items-center space-x-1.5 text-xs">
                        {apt.status !== 'confirmed' && apt.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-emerald-900/40 hover:text-emerald-300 text-stone-300 transition"
                          >
                            Valider
                          </button>
                        )}
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                          >
                            Marquer Réalisé
                          </button>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-rose-900/40 hover:text-rose-300 text-stone-400 transition"
                          >
                            Annuler
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
      )}

      {/* Manual Appointment Creation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-stone-100 font-editorial">
                  Ajouter un rendez-vous manuel ({currentStylist.city})
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualAppointment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Nom complet de la cliente / client :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Imane Chaoui"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Téléphone WhatsApp :</label>
                  <input
                    type="tel"
                    required
                    placeholder="+212 6 12 34 56 78"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Email :</label>
                  <input
                    type="email"
                    placeholder="imane@email.ma"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Prestation / Coiffure :</label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {stylistServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.price} MAD - {s.durationMinutes} min)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Lieu de la prestation :</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLocationType('salon')}
                    className={`py-2 px-3 rounded-xl border text-center flex items-center justify-center space-x-2 transition ${
                      newLocationType === 'salon'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-medium'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Au Salon</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLocationType('home')}
                    className={`py-2 px-3 rounded-xl border text-center flex items-center justify-center space-x-2 transition ${
                      newLocationType === 'home'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-medium'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>À Domicile (+{currentStylist.homeExtraFee} MAD)</span>
                  </button>
                </div>
              </div>

              {newLocationType === 'home' && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <label className="text-emerald-300 font-medium">Adresse du domicile à {currentStylist.city} :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Résidence Al Andalous, Quartier Racine (Étage, digicode...)"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Date :</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Heure :</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Notes & souhaits :</label>
                <textarea
                  rows={2}
                  placeholder="Notes sur la texture, longueur ou désirs..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold rounded-xl shadow-md transition"
                >
                  Enregistrer le Rendez-vous
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
