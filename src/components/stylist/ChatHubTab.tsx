import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { ChatMessage } from '../../types';
import { 
  MessageSquare, 
  Send, 
  User, 
  Calendar, 
  Clock, 
  Store, 
  Home, 
  Sparkles,
  Phone,
  CheckCheck
} from 'lucide-react';
import { formatFrenchDate } from '../../lib/whatsapp';

export const ChatHubTab: React.FC = () => {
  const { 
    chatMessages, 
    sendChatMessage, 
    currentStylist, 
    clients, 
    appointments 
  } = useSalon();

  // Dynamic threads for this stylist or defaults
  const stylistAppointments = appointments.filter(a => !a.stylistId || a.stylistId === currentStylist.id);
  const stylistClients = clients.filter(c => !c.stylistId || c.stylistId === currentStylist.id);

  const defaultThreads = [
    {
      id: 'chat-kenza',
      clientName: 'Kenza Bennani',
      phone: '+212 6 12 34 56 78',
      lastMessage: chatMessages.filter(m => m.chatId === 'chat-kenza').slice(-1)[0]?.text || "J'ai hâte de venir pour mon balayage !",
      lastTime: '16:35',
      unread: false,
    },
    {
      id: 'chat-zineb',
      clientName: 'Zineb El Amrani',
      phone: '+212 6 88 99 11 22',
      lastMessage: chatMessages.filter(m => m.chatId === 'chat-zineb').slice(-1)[0]?.text || "Parfait pour la prestation à domicile.",
      lastTime: '09:30',
      unread: true,
    }
  ];

  // If there are other unique clients who booked, add threads
  const additionalThreads = stylistClients
    .filter(c => !['chat-kenza', 'chat-zineb'].some(id => c.name.toLowerCase().includes(id.replace('chat-', ''))))
    .slice(0, 3)
    .map(c => ({
      id: `chat-${c.id}`,
      clientName: c.name,
      phone: c.phone,
      lastMessage: `Bonjour ${currentStylist.stylistName}, j'aimerais prendre rendez-vous.`,
      lastTime: 'Hier',
      unread: false,
    }));

  const chatThreads = [...defaultThreads, ...additionalThreads];

  const [activeChatId, setActiveChatId] = useState<string>(chatThreads[0].id);
  const [inputText, setInputText] = useState<string>('');

  const currentThread = chatThreads.find(t => t.id === activeChatId) || chatThreads[0];
  const currentMessages = chatMessages.filter(m => m.chatId === activeChatId);

  // Associated client and appointment if any
  const matchedClient = clients.find(c => c.name === currentThread.clientName);
  const nextAppointment = stylistAppointments.find(
    a => a.clientPhone === currentThread.phone && (a.status === 'confirmed' || a.status === 'pending')
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(activeChatId, inputText.trim(), 'stylist', currentStylist.stylistName);
    setInputText('');
  };

  const handleSendQuickReply = (text: string) => {
    sendChatMessage(activeChatId, text, 'stylist', currentStylist.stylistName);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-100 font-editorial tracking-wide">
              Messagerie & Chat Direct avec vos Clientes
            </h2>
            <p className="text-xs text-stone-400">
              Répondez aux questions sur les diagnostics capillaires, photos d'inspiration et réservations
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
          ● Messagerie instantanée active
        </span>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">

        {/* Thread list on left */}
        <div className="lg:col-span-4 bg-stone-900/70 rounded-2xl border border-stone-800 p-4 flex flex-col space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block px-2">
            Discussions en cours ({chatThreads.length})
          </span>

          <div className="space-y-2 overflow-y-auto flex-1">
            {chatThreads.map((thread) => {
              const isSelected = thread.id === activeChatId;

              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveChatId(thread.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-stone-950 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-stone-950/40 border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-stone-800 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-xs">
                        {thread.clientName.charAt(0)}
                      </div>
                      <span className="font-semibold text-stone-100 text-xs">
                        {thread.clientName}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500">{thread.lastTime}</span>
                  </div>

                  <p className="text-xs text-stone-400 truncate mt-1.5 pl-10">
                    {thread.lastMessage}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Connected Stylist Status */}
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-stone-300">
              Connectée en tant que : <strong className="text-amber-400">{currentStylist.stylistName}</strong>
            </span>
          </div>
        </div>

        {/* Active Conversation on right */}
        <div className="lg:col-span-8 bg-stone-900/70 rounded-2xl border border-stone-800 flex flex-col justify-between overflow-hidden">
          
          {/* Conversation Header */}
          <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center font-bold text-stone-950 text-sm">
                {currentThread.clientName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-stone-100 text-sm">
                  {currentThread.clientName}
                </h3>
                <p className="text-[11px] text-stone-400 font-mono">
                  {currentThread.phone}
                </p>
              </div>
            </div>

            {nextAppointment && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-stone-300">
                  RDV : {formatFrenchDate(nextAppointment.date)} à {nextAppointment.time}
                </span>
              </div>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="p-5 flex-1 overflow-y-auto space-y-3.5 bg-stone-950/30">
            {currentMessages.map((msg) => {
              const isStylist = msg.sender === 'stylist';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isStylist ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm space-y-1 ${
                      isStylist
                        ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                        : 'bg-stone-800 text-stone-100 rounded-tl-none border border-stone-700/80'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end space-x-1 text-[10px] pt-0.5 ${
                        isStylist ? 'text-stone-900/80 font-mono' : 'text-stone-400 font-mono'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isStylist && <CheckCheck className="w-3 h-3 text-stone-950" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick reply presets & Composer */}
          <div className="p-4 bg-stone-950/90 border-t border-stone-800 space-y-3">
            
            {/* Quick response chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-[11px]">
              <span className="text-stone-500 shrink-0">Réponses rapides :</span>
              {[
                "Oui avec grand plaisir !",
                "Pouvez-vous m'envoyer une photo d'inspiration ?",
                "C'est bien noté pour votre rendez-vous !",
                "Prévoyez d'arriver 5 minutes en avance."
              ].map((text, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendQuickReply(text)}
                  className="px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 shrink-0 transition"
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Écrire à ${currentThread.clientName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-stone-950 transition font-semibold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
