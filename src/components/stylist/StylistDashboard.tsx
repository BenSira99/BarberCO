import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { PlanningTab } from './PlanningTab';
import { WhatsAppTab } from './WhatsAppTab';
import { ClientsTab } from './ClientsTab';
import { RevenueTab } from './RevenueTab';
import { ServicesCatalogTab } from './ServicesCatalogTab';
import { ReviewsManagementTab } from './ReviewsManagementTab';
import { ChatHubTab } from './ChatHubTab';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import { 
  Calendar, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Scissors, 
  Star, 
  MessageCircle, 
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export type StylistSubTab = 
  | 'planning' 
  | 'whatsapp' 
  | 'clients' 
  | 'revenue' 
  | 'services' 
  | 'reviews' 
  | 'chat' 
  | 'settings';

export const StylistDashboard: React.FC = () => {
  const { appointments, chatMessages, switchMode } = useSalon();
  const [activeTab, setActiveTab] = useState<StylistSubTab>('planning');

  const pendingAptsCount = appointments.filter(a => a.status === 'pending').length;
  const pendingRemindersCount = appointments.filter(a => !a.reminderSent && (a.status === 'confirmed' || a.status === 'pending')).length;
  const unreadChatCount = chatMessages.filter(m => !m.read && m.sender === 'client').length;

  const navItems: { id: StylistSubTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'planning', label: 'Planning & RDV', icon: <Calendar className="w-4 h-4" />, badge: pendingAptsCount || undefined },
    { id: 'whatsapp', label: 'Rappels WhatsApp', icon: <MessageSquare className="w-4 h-4" />, badge: pendingRemindersCount || undefined },
    { id: 'clients', label: 'Fichier Clients', icon: <Users className="w-4 h-4" /> },
    { id: 'revenue', label: 'Revenus & Stats', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'services', label: 'Prestations & Tarifs', icon: <Scissors className="w-4 h-4" /> },
    { id: 'reviews', label: 'Avis Clients', icon: <Star className="w-4 h-4" /> },
    { id: 'chat', label: 'Messagerie Directe', icon: <MessageCircle className="w-4 h-4" />, badge: unreadChatCount || undefined },
    { id: 'settings', label: 'Salon & Domicile', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      
      {/* Sub Navigation Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-2 overflow-x-auto shadow-sm">
        <div className="flex items-center space-x-1 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div className="transition-all duration-200">
        {activeTab === 'planning' && <PlanningTab />}
        {activeTab === 'whatsapp' && <WhatsAppTab />}
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'revenue' && <RevenueTab />}
        {activeTab === 'services' && <ServicesCatalogTab />}
        {activeTab === 'reviews' && <ReviewsManagementTab />}
        {activeTab === 'chat' && <ChatHubTab />}
        {activeTab === 'settings' && <ProfileSettingsTab />}
      </div>

    </div>
  );
};
