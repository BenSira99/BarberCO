import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Appointment, WhatsAppReminderTemplate } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCheck, 
  Sparkles, 
  Copy, 
  Edit3, 
  Plus, 
  Check, 
  Smartphone, 
  AlertCircle,
  Play,
  RotateCcw,
  Store,
  Home
} from 'lucide-react';
import { 
  formatFrenchDate, 
  buildWhatsAppLink, 
  generateReminderMessage, 
  isReminderDue 
} from '../../lib/whatsapp';

export const WhatsAppTab: React.FC = () => {
  const { 
    appointments, 
    templates, 
    saveTemplate, 
    markReminderSent, 
    currentStylist 
  } = useSalon();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates.find(t => t.isDefault)?.id || templates[0]?.id || ''
  );

  // Appointments due or upcoming for this stylist
  const upcomingAppointments = appointments
    .filter(a => (!a.stylistId || a.stylistId === currentStylist.id) && (a.status === 'confirmed' || a.status === 'pending'))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(
    upcomingAppointments[0]?.id || appointments[0]?.id || ''
  );
  const [isEditingTemplate, setIsEditingTemplate] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<string>('');
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [isSimulatingBatch, setIsSimulatingBatch] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; sent: string[] }>({
    current: 0,
    total: 0,
    sent: []
  });

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const activeAppointment = appointments.find(a => a.id === selectedAppointmentId) || upcomingAppointments[0];

  // Current preview message
  const previewText = activeAppointment && activeTemplate
    ? generateReminderMessage(activeTemplate.content, activeAppointment, currentStylist)
    : 'Sélectionnez un rendez-vous et un modèle pour voir l’aperçu du rappel WhatsApp.';

  const handleStartEdit = (tpl: WhatsAppReminderTemplate) => {
    setSelectedTemplateId(tpl.id);
    setEditingTitle(tpl.title);
    setEditingContent(tpl.content);
    setIsEditingTemplate(true);
  };

  const handleSaveEdit = () => {
    if (!activeTemplate) return;
    saveTemplate({
      ...activeTemplate,
      title: editingTitle || activeTemplate.title,
      content: editingContent || activeTemplate.content,
    });
    setIsEditingTemplate(false);
  };

  const insertTag = (tag: string) => {
    setEditingContent(prev => prev + tag);
  };

  const handleSendSingleWhatsApp = (apt: Appointment) => {
    const msg = generateReminderMessage(activeTemplate.content, apt, currentStylist);
    const link = buildWhatsAppLink(apt.clientPhone, msg);
    markReminderSent(apt.id);
    window.open(link, '_blank');
  };

  const handleRunBatchSimulator = () => {
    const pendingList = upcomingAppointments.filter(a => !a.reminderSent);
    if (pendingList.length === 0) {
      alert("Tous les rendez-vous à venir ont déjà reçu leur rappel WhatsApp !");
      return;
    }

    setIsSimulatingBatch(true);
    setBatchProgress({ current: 0, total: pendingList.length, sent: [] });

    let index = 0;
    const interval = setInterval(() => {
      if (index < pendingList.length) {
        const apt = pendingList[index];
        markReminderSent(apt.id);
        setBatchProgress(prev => ({
          ...prev,
          current: index + 1,
          sent: [...prev.sent, apt.clientName]
        }));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulatingBatch(false);
        }, 1200);
      }
    }, 700);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-100 font-editorial tracking-wide">
              Système de Rappels WhatsApp Automatisé • {currentStylist.salonName}
            </h2>
            <p className="text-xs text-stone-400">
              Générez des messages personnalisés pour chaque cliente marocaine et réduisez les rendez-vous manqués à 0%
            </p>
          </div>
        </div>

        {/* Batch action */}
        <button
          disabled={isSimulatingBatch}
          onClick={handleRunBatchSimulator}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950 transition"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>
            {isSimulatingBatch
              ? `Envoi automatisé (${batchProgress.current}/${batchProgress.total})...`
              : 'Lancer l\'envoi groupé automatisé'}
          </span>
        </button>
      </div>

      {/* Main Grid: Queue on left, WhatsApp live preview & Template editor on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Appointments Queue for Reminders */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-stone-900/70 p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-stone-200">
                  File d'attente des rappels
                </h3>
                <p className="text-[11px] text-stone-400">
                  {upcomingAppointments.filter(a => !a.reminderSent).length} client(s) en attente de rappel
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-stone-950 text-amber-400 border border-stone-800">
                Numéro Pro: +{currentStylist.whatsappNumber}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {upcomingAppointments.map((apt) => {
                const isSelected = apt.id === selectedAppointmentId;
                const isHome = apt.locationType === 'home';

                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointmentId(apt.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-stone-950 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-stone-950/40 border-stone-800/80 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-stone-100 text-xs">
                          {apt.clientName}
                        </span>
                        {isHome ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            Domicile
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            Salon
                          </span>
                        )}
                      </div>

                      {/* Reminder Status Badge */}
                      {apt.reminderSent ? (
                        <span className="flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCheck className="w-3 h-3" />
                          <span>Envoyé</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          <span>À envoyer</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
                      <span>{apt.serviceName}</span>
                      <span className="font-mono text-stone-300">
                        {formatFrenchDate(apt.date)} à {apt.time}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs">
                      <span className="text-[11px] text-stone-500 font-mono">
                        {apt.clientPhone}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendSingleWhatsApp(apt);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition ${
                          apt.reminderSent
                            ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{apt.reminderSent ? 'Renvoyer' : 'Envoyer 1-clic'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive WhatsApp Phone Mockup & Template Picker */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Template Selector & Editor */}
          <div className="bg-stone-900/70 p-5 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Modèle de message actif
              </span>
              <button
                onClick={() => activeTemplate && handleStartEdit(activeTemplate)}
                className="flex items-center space-x-1 text-xs text-stone-400 hover:text-amber-300 transition"
              >
                <Edit3 className="w-3 h-3" />
                <span>Personnaliser ce modèle</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    tpl.id === selectedTemplateId
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>

            {/* Template edit modal / inline area */}
            {isEditingTemplate && (
              <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/30 space-y-3 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">Titre du modèle :</label>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">Contenu du message (MAD inclus) :</label>
                  <textarea
                    rows={4}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-stone-500 block">Insérer une balise dynamique :</span>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {['{client_name}', '{date}', '{heure}', '{prestation}', '{prix}', '{lieu}', '{adresse}', '{coiffeur}'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertTag(tag)}
                        className="px-2 py-0.5 rounded bg-stone-800 hover:bg-amber-500/20 hover:text-amber-300 text-stone-300 border border-stone-700"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-stone-800">
                  <button
                    onClick={() => setIsEditingTemplate(false)}
                    className="px-3 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 rounded-lg bg-amber-500 text-stone-950 font-semibold text-xs"
                  >
                    Sauvegarder le modèle
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Smartphone WhatsApp Simulator Preview */}
          <div className="bg-stone-900/70 p-5 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-stone-200">
                  Aperçu direct écran client (WhatsApp)
                </span>
              </div>
              <span className="text-[10px] text-stone-500">
                Destinataire : {activeAppointment?.clientName} ({activeAppointment?.clientPhone})
              </span>
            </div>

            {/* WhatsApp Chat Container */}
            <div className="rounded-2xl overflow-hidden border border-[#0d3323] bg-[#0c1317] shadow-xl">
              
              {/* WhatsApp App Top Bar */}
              <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center font-bold text-stone-950 text-xs">
                    {currentStylist.stylistName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#e9edef] leading-tight">
                      {currentStylist.salonName}
                    </h4>
                    <p className="text-[10px] text-emerald-400">En ligne • {currentStylist.city}</p>
                  </div>
                </div>
                <div className="text-[10px] text-[#8696a0]">
                  Compte Pro Officiel
                </div>
              </div>

              {/* Chat Message Bubble Canvas */}
              <div className="p-4 min-h-[220px] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] flex flex-col justify-end">
                <div className="max-w-[85%] ml-auto bg-[#005c4b] text-[#e9edef] p-3.5 rounded-2xl rounded-tr-none shadow-md space-y-2 text-xs leading-relaxed">
                  <p className="whitespace-pre-line font-sans">
                    {previewText}
                  </p>
                  <div className="flex items-center justify-end space-x-1 text-[10px] text-[#8696a0] pt-1">
                    <span>10:30</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  </div>
                </div>
              </div>

              {/* Chat Bottom Action Bar */}
              <div className="bg-[#1f2c34] p-3 flex items-center justify-between border-t border-[#2a3942]">
                <span className="text-[11px] text-[#8696a0]">
                  Message prêt pour {activeAppointment?.clientPhone}
                </span>

                {activeAppointment && (
                  <button
                    onClick={() => handleSendSingleWhatsApp(activeAppointment)}
                    className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-medium shadow transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer maintenant</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
