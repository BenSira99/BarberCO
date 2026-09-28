import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { ChatMessage } from '../../types';
import { 
  MessageSquare, 
  Send, 
  User, 
  Sparkles, 
  Clock, 
  Phone, 
  CheckCheck,
  Store,
  ExternalLink
} from 'lucide-react';
import { buildWhatsAppLink } from '../../lib/whatsapp';

export const ClientChatSection: React.FC = () => {
  const { 
    chatMessages, 
    sendChatMessage, 
    selectedStylist 
  } = useSalon();

  const [clientName, setClientName] = useState<string>('Kenza Bennani');
  const [inputText, setInputText] = useState<string>('');

  const targetChatId = `chat-${selectedStylist.id}`;
  const currentMessages = chatMessages.filter(
    m => m.chatId === targetChatId || (!m.chatId.startsWith('chat-') && m.stylistId === selectedStylist.id) || (m.stylistId === selectedStylist.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(targetChatId, inputText.trim(), 'client', clientName);
    setInputText('');
  };

  const handleSendPrompt = (promptText: string) => {
    sendChatMessage(targetChatId, promptText, 'client', clientName);
  };

  // WhatsApp fallback
  const waLink = buildWhatsAppLink(
    selectedStylist.whatsappNumber,
    `Bonjour ${selectedStylist.stylistName} ! J'ai une question sur une coiffure.`
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] shadow-lg">
            <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center font-editorial font-bold text-amber-400 text-xl">
              {selectedStylist.stylistName.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-stone-100 font-editorial">
                {selectedStylist.stylistName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                ● En ligne à {selectedStylist.city}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {selectedStylist.title} • {selectedStylist.salonName}
            </p>
          </div>
        </div>

        {/* WhatsApp Fast Link */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold shadow-md transition"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Passer sur WhatsApp</span>
        </a>
      </div>

      {/* Main Chat Box */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3.5 bg-stone-950/40">
          <div className="text-center py-2">
            <span className="px-3 py-1 rounded-full text-[10px] bg-stone-900 border border-stone-800 text-stone-400 font-medium">
              Début de la conversation sécurisée
            </span>
          </div>

          {currentMessages.map((msg) => {
            const isClient = msg.sender === 'client';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] text-stone-500 mb-1 px-1">
                  <span>{msg.senderName}</span>
                </div>

                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm space-y-1 ${
                    isClient
                      ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                      : 'bg-stone-800 text-stone-100 rounded-tl-none border border-stone-700/80'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`flex items-center justify-end space-x-1 text-[10px] pt-0.5 ${
                      isClient ? 'text-stone-900/80 font-mono' : 'text-stone-400 font-mono'
                    }`}
                  >
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isClient && <CheckCheck className="w-3 h-3 text-stone-950" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggestion Chips & Composer */}
        <div className="p-4 bg-stone-950/90 border-t border-stone-800 space-y-3">
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-[11px]">
            <span className="text-stone-500 shrink-0">Idées de questions :</span>
            {[
              "Combien de temps dure un balayage sur cheveux longs ?",
              "Est-ce possible de réaliser cette prestation à domicile ?",
              "Quel soin me conseillez-vous pour cheveux décolorés ?"
            ].map((text, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendPrompt(text)}
                className="px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 shrink-0 transition"
              >
                {text}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Écrire à ${selectedStylist.stylistName}...`}
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
  );
};
