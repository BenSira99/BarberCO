import React, { useState, useMemo } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Appointment, LocationType, AppointmentStatus } from '../../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Home, 
  Store, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  User, 
  Sparkles,
  TrendingUp,
  Check,
  Ban,
  Filter
} from 'lucide-react';
import { formatFrenchDate, buildWhatsAppLink, generateReminderMessage } from '../../lib/whatsapp';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const FRENCH_MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const STANDARD_TIME_SLOTS = [
  '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'
];

interface InteractiveMonthCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenNewAppointmentModal: (prefillDate?: string, prefillTime?: string) => void;
}

export const InteractiveMonthCalendar: React.FC<InteractiveMonthCalendarProps> = ({
  selectedDate,
  onSelectDate,
  onOpenNewAppointmentModal
}) => {
  const { 
    appointments, 
    currentStylist, 
    updateAppointmentStatus, 
    markReminderSent,
    templates 
  } = useSalon();

  // Selected view month & year (Default: Sept 2026 based on initial mock data)
  const initialDateObj = useMemo(() => {
    const [y, m] = selectedDate.split('-').map(Number);
    return { year: y || 2026, month: (m ? m - 1 : 8) };
  }, [selectedDate]);

  const [viewYear, setViewYear] = useState<number>(initialDateObj.year);
  const [viewMonth, setViewMonth] = useState<number>(initialDateObj.month);
  const [filterType, setFilterType] = useState<'all' | 'salon' | 'home'>('all');
  const [blockedSlots, setBlockedSlots] = useState<{ [dateSlotKey: string]: boolean }>({});

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    setViewYear(2026);
    setViewMonth(8); // Septembre 2026
    onSelectDate('2026-09-28');
  };

  // Filter appointments for current stylist
  const stylistAppointments = useMemo(() => {
    return appointments.filter(
      a => (!a.stylistId || a.stylistId === currentStylist.id) && a.status !== 'cancelled'
    );
  }, [appointments, currentStylist.id]);

  // Compute month calendar cells
  const calendarCells = useMemo(() => {
    // Days in current view month
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    
    // First day index (Monday=0 ... Sunday=6)
    const firstDayWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

    // Days in previous month for trailing cells
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      weekdayName: string;
      isClosed: boolean;
      dayAppointments: Appointment[];
      bookedSlotsCount: number;
      availableSlotsCount: number;
      revenue: number;
      availabilityLevel: 'high' | 'medium' | 'low' | 'full' | 'closed';
    }[] = [];

    // Prepend previous month days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      
      cells.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        weekdayName: '',
        isClosed: true,
        dayAppointments: [],
        bookedSlotsCount: 0,
        availableSlotsCount: 0,
        revenue: 0,
        availabilityLevel: 'closed'
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayDate = new Date(viewYear, viewMonth, d);
      const dayIndex = (dayDate.getDay() + 6) % 7;
      const dayNamesFr = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
      const dayKey = dayNamesFr[dayIndex];

      const openingRule = currentStylist.openingHours?.[dayKey];
      const isClosed = openingRule ? openingRule.closed : (dayIndex === 6); // Dimanche fermé par défaut

      const dayApts = stylistAppointments.filter(a => {
        if (a.date !== dateStr) return false;
        if (filterType !== 'all' && a.locationType !== filterType) return false;
        return true;
      });

      const bookedCount = dayApts.length;
      const totalSlots = isClosed ? 0 : STANDARD_TIME_SLOTS.length;
      const availableCount = Math.max(0, totalSlots - bookedCount);

      let level: 'high' | 'medium' | 'low' | 'full' | 'closed' = 'high';
      if (isClosed) {
        level = 'closed';
      } else if (availableCount === 0) {
        level = 'full';
      } else if (availableCount <= 2) {
        level = 'low';
      } else if (availableCount <= 4) {
        level = 'medium';
      } else {
        level = 'high';
      }

      const rev = dayApts.reduce((sum, a) => sum + a.price, 0);

      cells.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        weekdayName: dayNamesFr[dayIndex],
        isClosed,
        dayAppointments: dayApts,
        bookedSlotsCount: bookedCount,
        availableSlotsCount: availableCount,
        revenue: rev,
        availabilityLevel: level
      });
    }

    // Append next month padding to complete grid (multiples of 7)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
      
      cells.push({
        dateStr,
        dayNumber: j,
        isCurrentMonth: false,
        weekdayName: '',
        isClosed: true,
        dayAppointments: [],
        bookedSlotsCount: 0,
        availableSlotsCount: 0,
        revenue: 0,
        availabilityLevel: 'closed'
      });
    }

    return cells;
  }, [viewYear, viewMonth, stylistAppointments, filterType, currentStylist.openingHours]);

  // Month Statistics
  const monthAppointments = useMemo(() => {
    return stylistAppointments.filter(a => {
      const [y, m] = a.date.split('-').map(Number);
      return y === viewYear && m === viewMonth + 1;
    });
  }, [stylistAppointments, viewYear, viewMonth]);

  const monthRevenue = monthAppointments.reduce((sum, a) => sum + a.price, 0);
  const monthSalonCount = monthAppointments.filter(a => a.locationType === 'salon').length;
  const monthHomeCount = monthAppointments.filter(a => a.locationType === 'home').length;
  const totalSlotsInMonth = calendarCells.filter(c => c.isCurrentMonth && !c.isClosed).length * STANDARD_TIME_SLOTS.length;
  const occupancyRate = totalSlotsInMonth > 0 ? Math.min(100, Math.round((monthAppointments.length / totalSlotsInMonth) * 100)) : 0;

  // Selected Day Details & Slots
  const selectedDayCell = calendarCells.find(c => c.dateStr === selectedDate);
  const selectedDayAppointments = stylistAppointments
    .filter(a => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Toggle blocked slot
  const handleToggleBlockSlot = (timeSlot: string) => {
    const key = `${selectedDate}_${timeSlot}`;
    setBlockedSlots(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSendWhatsApp = (apt: Appointment) => {
    const template = templates.find(t => t.isDefault) || templates[0];
    const message = generateReminderMessage(template.content, apt, currentStylist);
    const link = buildWhatsAppLink(apt.clientPhone, message);
    markReminderSent(apt.id);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Monthly KPIs & Controls Bar */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Month Navigation */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-stone-950 p-1 rounded-2xl border border-stone-800">
              <button
                onClick={handlePrevMonth}
                title="Mois précédent"
                className="p-2 text-stone-400 hover:text-amber-300 hover:bg-stone-900 rounded-xl transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="px-4 py-1 text-center min-w-[170px]">
                <h3 className="text-base font-bold text-stone-100 font-editorial tracking-wider">
                  {FRENCH_MONTHS[viewMonth]} {viewYear}
                </h3>
                <span className="text-[10px] text-amber-400 font-mono">
                  {monthAppointments.length} rendez-vous
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                title="Mois suivant"
                className="p-2 text-stone-400 hover:text-amber-300 hover:bg-stone-900 rounded-xl transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleGoToToday}
              className="px-3.5 py-2 text-xs rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 transition font-medium"
            >
              Aujourd'hui
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400 font-medium text-[11px] flex items-center space-x-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Filtrer :</span>
            </span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl border transition ${
                filterType === 'all'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Tous ({monthAppointments.length})
            </button>
            <button
              onClick={() => setFilterType('salon')}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition ${
                filterType === 'salon'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Salon ({monthSalonCount})</span>
            </button>
            <button
              onClick={() => setFilterType('home')}
              className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition ${
                filterType === 'home'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Domicile ({monthHomeCount})</span>
            </button>
          </div>

          {/* New Appointment Fast Action */}
          <button
            onClick={() => onOpenNewAppointmentModal(selectedDate)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/15 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouveau RDV</span>
          </button>
        </div>

        {/* Month Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-800/80 text-xs">
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
              Recettes du mois
            </span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {monthRevenue} MAD
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
              Rendez-vous programmés
            </span>
            <span className="text-lg font-bold text-stone-100 font-mono">
              {monthAppointments.length} RDV
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
              Taux d'occupation
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {occupancyRate}%
              </span>
              <div className="flex-1 bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${occupancyRate}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                Lieu
              </span>
              <span className="text-xs text-stone-300 font-medium">
                {monthSalonCount} salon • {monthHomeCount} dom.
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Maroc</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Interactive Grid & Day Breakdown Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left / Center: Interactive Monthly Calendar Grid (7 columns) */}
        <div className="xl:col-span-8 bg-stone-900/80 border border-stone-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
          
          {/* Header weekdays */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center pb-2 border-b border-stone-800 text-xs font-semibold text-stone-400">
            {WEEKDAYS.map((day, idx) => (
              <div key={idx} className={idx >= 5 ? 'text-amber-400/80' : ''}>
                {day}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, index) => {
              const isSelected = cell.dateStr === selectedDate;
              const isToday = cell.dateStr === '2026-09-28';

              if (!cell.isCurrentMonth) {
                return (
                  <div
                    key={index}
                    className="min-h-[85px] sm:min-h-[105px] p-2 rounded-2xl bg-stone-950/20 border border-stone-900 opacity-25 flex flex-col justify-between"
                  >
                    <span className="text-xs text-stone-600 font-mono">
                      {cell.dayNumber}
                    </span>
                  </div>
                );
              }

              // Availability badge styling
              let availabilityBadge = null;
              if (cell.isClosed) {
                availabilityBadge = (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800/80 text-stone-500 font-mono">
                    Repos
                  </span>
                );
              } else if (cell.bookedSlotsCount >= STANDARD_TIME_SLOTS.length) {
                availabilityBadge = (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold font-mono">
                    Complet
                  </span>
                );
              } else if (cell.availableSlotsCount <= 2) {
                availabilityBadge = (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                    {cell.availableSlotsCount} dispo{cell.availableSlotsCount > 1 ? 's' : ''}
                  </span>
                );
              } else {
                availabilityBadge = (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
                    {cell.availableSlotsCount} dispos
                  </span>
                );
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectDate(cell.dateStr)}
                  className={`min-h-[90px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-stone-900 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/40'
                      : 'bg-stone-950/70 border-stone-800/90 hover:border-amber-500/40 hover:bg-stone-900/60'
                  }`}
                >
                  {/* Top Day row */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs sm:text-sm font-bold font-mono ${
                        isSelected ? 'text-amber-300' : isToday ? 'text-amber-400 underline underline-offset-2' : 'text-stone-200'
                      }`}>
                        {cell.dayNumber}
                      </span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Aujourd'hui" />
                      )}
                    </div>
                    {availabilityBadge}
                  </div>

                  {/* Middle: Appointments preview chips */}
                  <div className="space-y-1 my-1 w-full overflow-hidden">
                    {cell.dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium flex items-center justify-between ${
                          apt.locationType === 'home'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-stone-800/90 text-stone-200 border border-stone-700/60'
                        }`}
                      >
                        <span className="truncate">{apt.time} {apt.clientName.split(' ')[0]}</span>
                        <span className="text-[9px] opacity-75 font-mono ml-0.5">{apt.price}M</span>
                      </div>
                    ))}
                    {cell.dayAppointments.length > 2 && (
                      <span className="text-[9px] text-amber-400 font-semibold block text-right">
                        +{cell.dayAppointments.length - 2} autre{cell.dayAppointments.length - 2 > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Bottom: Revenue for the day */}
                  <div className="pt-1 border-t border-stone-800/60 flex items-center justify-between text-[10px] w-full text-stone-500">
                    <span className="font-mono">
                      {cell.revenue > 0 ? (
                        <strong className="text-amber-400">{cell.revenue} MAD</strong>
                      ) : cell.isClosed ? (
                        <span className="text-stone-600">Fermé</span>
                      ) : (
                        <span className="text-emerald-500/80">Créneaux libres</span>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800/80 text-[11px] text-stone-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Créneaux disponibles (3+)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Peu de places (1-2)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>Complet</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-600" />
                <span>Fermé / Repos</span>
              </span>
            </div>

            <span className="text-stone-500 italic">
              Cliquez sur un jour pour inspecter et gérer ses créneaux
            </span>
          </div>

        </div>

        {/* Right: Detailed Slots & Appointments Inspector for the selected day */}
        <div className="xl:col-span-4 bg-stone-900/80 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Inspector Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold font-mono">
                  Détail du Jour Sélectionné
                </span>
                <h4 className="text-base font-semibold text-stone-100 font-editorial">
                  {formatFrenchDate(selectedDate)}
                </h4>
                <p className="text-xs text-stone-400">
                  {selectedDayAppointments.length} rendez-vous programmés • Recette : <strong className="text-amber-400 font-mono">{selectedDayCell?.revenue || 0} MAD</strong>
                </p>
              </div>

              <button
                onClick={() => onOpenNewAppointmentModal(selectedDate)}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition"
                title="Ajouter un RDV sur cette date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Slots Timeline list */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {STANDARD_TIME_SLOTS.map((timeSlot) => {
                const bookedApt = selectedDayAppointments.find(a => a.time === timeSlot);
                const blockKey = `${selectedDate}_${timeSlot}`;
                const isBlocked = blockedSlots[blockKey];

                if (bookedApt) {
                  const isHome = bookedApt.locationType === 'home';

                  return (
                    <div
                      key={timeSlot}
                      className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5 transition hover:border-amber-500/30"
                    >
                      {/* Slot header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                            {timeSlot}
                          </span>
                          <span className="text-xs font-semibold text-stone-200">
                            {bookedApt.clientName}
                          </span>
                        </div>

                        <span className="font-mono text-xs font-bold text-amber-400">
                          {bookedApt.price} MAD
                        </span>
                      </div>

                      {/* Service & location */}
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span className="truncate pr-2">{bookedApt.serviceName}</span>
                        {isHome ? (
                          <span className="flex items-center space-x-1 text-emerald-400 text-[10px] shrink-0">
                            <Home className="w-3 h-3" />
                            <span>Domicile</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-amber-300 text-[10px] shrink-0">
                            <Store className="w-3 h-3" />
                            <span>Salon</span>
                          </span>
                        )}
                      </div>

                      {/* Client phone & actions */}
                      <div className="pt-2 border-t border-stone-900 flex items-center justify-between text-[11px]">
                        <span className="text-stone-400 font-mono">
                          {bookedApt.clientPhone}
                        </span>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleSendWhatsApp(bookedApt)}
                            className="px-2.5 py-1 rounded-lg bg-[#00a884]/20 hover:bg-[#00a884]/30 text-emerald-300 border border-[#00a884]/40 flex items-center space-x-1 transition"
                            title="Envoyer un rappel WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Rappel WA</span>
                          </button>

                          {bookedApt.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(bookedApt.id, 'confirmed')}
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                              title="Confirmer"
                            >
                              Confirmer
                            </button>
                          )}

                          <button
                            onClick={() => updateAppointmentStatus(bookedApt.id, 'cancelled')}
                            className="p-1 rounded-lg hover:bg-rose-500/20 text-stone-500 hover:text-rose-400 transition"
                            title="Annuler ce rendez-vous"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (isBlocked) {
                  return (
                    <div
                      key={timeSlot}
                      className="p-3 rounded-2xl bg-stone-950/40 border border-dashed border-stone-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 text-stone-500">
                        <span className="font-mono">{timeSlot}</span>
                        <span>Créneau bloqué (Indisponible)</span>
                      </div>
                      <button
                        onClick={() => handleToggleBlockSlot(timeSlot)}
                        className="text-[11px] text-amber-400 hover:underline"
                      >
                        Débloquer
                      </button>
                    </div>
                  );
                }

                // Available slot
                return (
                  <div
                    key={timeSlot}
                    className="p-3 rounded-2xl bg-stone-950/60 border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-between text-xs transition group"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-emerald-400 font-bold">
                        {timeSlot}
                      </span>
                      <span className="text-emerald-300 font-medium text-[11px]">
                        ● Créneau Disponible
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onOpenNewAppointmentModal(selectedDate, timeSlot)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[11px] transition flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Réserver</span>
                      </button>
                      <button
                        onClick={() => handleToggleBlockSlot(timeSlot)}
                        className="p-1 text-stone-500 hover:text-stone-300 transition"
                        title="Bloquer ce créneau"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Footer helper */}
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 text-center">
            Horaires d'ouverture : <strong className="text-stone-200">09:30 - 19:30</strong> (Lun - Sam)
          </div>

        </div>

      </div>

    </div>
  );
};
