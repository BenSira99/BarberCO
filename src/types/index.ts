export type ServiceCategory = 'coupe' | 'coloration' | 'soin' | 'coiffage' | 'tresses' | 'evenement' | 'barbe';

export interface Service {
  id: string;
  stylistId?: string;
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number; // in MAD
  description: string;
  salonAvailable: boolean;
  homeAvailable: boolean;
  popular?: boolean;
}

export type LocationType = 'salon' | 'home';

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  stylistId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  price: number; // in MAD
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  locationType: LocationType;
  address?: string; // If home
  addressDetails?: string; // Intercom, floor, etc.
  notes?: string;
  status: AppointmentStatus;
  reminderSent: boolean;
  reminderSentAt?: string;
  createdAt: string;
  stylistNotes?: string;
}

export interface Client {
  id: string;
  stylistId?: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  totalSpent: number; // in MAD
  lastVisit: string;
  preferredLocation: LocationType;
  hairType?: string; // e.g. "Bouclés fins", "Épais frisés", "Colorés méchés"
  notes?: string;
  address?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  stylistId: string;
  clientName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  serviceName: string;
  verified: boolean;
  locationType: LocationType;
  stylistReply?: string;
  stylistReplyDate?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  stylistId: string;
  sender: 'stylist' | 'client';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface OpeningHour {
  open: string;
  close: string;
  closed: boolean;
}

export interface StylistProfile {
  id: string;
  userId?: string;
  salonName: string;
  stylistName: string;
  title: string;
  bio: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string; // Casablanca, Marrakech, Rabat, Tanger, etc.
  postalCode: string;
  acceptsHomeBooking: boolean;
  homeRadiusKm: number;
  homeExtraFee: number; // in MAD
  rating: number;
  reviewCount: number;
  instagramHandle: string;
  avatarUrl?: string;
  specialties?: string[];
  openingHours: Record<string, OpeningHour>;
}

export interface WhatsAppReminderTemplate {
  id: string;
  stylistId?: string;
  title: string;
  content: string;
  triggerHoursBefore: number;
  isDefault: boolean;
}
