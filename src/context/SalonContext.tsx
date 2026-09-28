import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Service, 
  Appointment, 
  Client, 
  Review, 
  StylistProfile, 
  WhatsAppReminderTemplate, 
  ChatMessage, 
  AppointmentStatus 
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_STYLISTS, 
  INITIAL_TEMPLATES, 
  INITIAL_CLIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_REVIEWS, 
  INITIAL_MESSAGES 
} from '../lib/initialData';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut, 
  onAuthStateChanged, 
  User,
  doc,
  setDoc,
  collection,
  onSnapshot
} from '../lib/firebase';

interface RegisterStylistParams {
  stylistName: string;
  salonName: string;
  city: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  password: string;
  acceptsHomeBooking: boolean;
}

interface SalonContextType {
  user: User | null;
  activeMode: 'stylist' | 'client';
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isStylistAuthenticated: boolean;
  
  // Stylists directory & selection
  stylists: StylistProfile[];
  currentStylistId: string;
  currentStylist: StylistProfile;
  stylistProfile: StylistProfile;
  selectedStylistId: string;
  selectedStylist: StylistProfile;
  setCurrentStylistId: (id: string) => void;
  setSelectedStylistId: (id: string) => void;

  // Data collections
  services: Service[];
  appointments: Appointment[];
  clients: Client[];
  reviews: Review[];
  templates: WhatsAppReminderTemplate[];
  chatMessages: ChatMessage[];
  selectedChatId: string;
  clientBookingPhone: string;
  isSyncing: boolean;

  // Actions
  switchMode: (mode: 'stylist' | 'client') => void;
  setSelectedChatId: (chatId: string) => void;
  setClientBookingPhone: (phone: string) => void;
  addAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'reminderSent'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  markReminderSent: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  sendChatMessage: (chatId: string, text: string, sender: 'stylist' | 'client', senderName: string) => void;
  updateStylistProfile: (updated: Partial<StylistProfile>) => void;
  addService: (srv: Omit<Service, 'id'>) => void;
  updateService: (id: string, srv: Partial<Service>) => void;
  deleteService: (id: string) => void;
  saveTemplate: (template: WhatsAppReminderTemplate) => void;
  updateClientNotes: (clientId: string, notes: string, hairType?: string) => void;
  
  // Auth
  loginStylist: (email: string, pass: string) => Promise<void>;
  registerStylist: (params: RegisterStylistParams) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'latelier_prive_mad_v2';

export const SalonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeMode, setActiveMode] = useState<'stylist' | 'client'>('client');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isStylistAuthenticated, setIsStylistAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_is_stylist_auth`) === 'true';
  });

  // Stylists list
  const [stylists, setStylists] = useState<StylistProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_stylists`);
    return saved ? JSON.parse(saved) : INITIAL_STYLISTS;
  });

  // Current logged in stylist for dashboard
  const [currentStylistId, setCurrentStylistId] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_stylist_id`);
    return saved || 'stylist-yasmine';
  });

  // Stylist chosen by client for booking flow
  const [selectedStylistId, setSelectedStylistId] = useState<string>(() => {
    return 'stylist-yasmine';
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_services`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_clients`);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });
  const [templates, setTemplates] = useState<WhatsAppReminderTemplate[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_templates`);
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_chats`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [selectedChatId, setSelectedChatId] = useState<string>('chat-kenza');
  const [clientBookingPhone, setClientBookingPhone] = useState<string>('+212 6 12 34 56 78');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_stylists`, JSON.stringify(stylists));
  }, [stylists]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_stylist_id`, currentStylistId);
  }, [currentStylistId]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_stylist_auth`, isStylistAuthenticated ? 'true' : 'false');
  }, [isStylistAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_templates`, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_chats`, JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsStylistAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Compute active objects
  const currentStylist = stylists.find(s => s.id === currentStylistId) || stylists[0];
  const selectedStylist = stylists.find(s => s.id === selectedStylistId) || stylists[0];

  const switchMode = (mode: 'stylist' | 'client') => {
    if (mode === 'stylist' && !isStylistAuthenticated) {
      // Must log in or register before entering stylist dashboard!
      setIsAuthModalOpen(true);
      return;
    }
    setActiveMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginStylist = async (email: string, pass: string) => {
    setIsSyncing(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setIsStylistAuthenticated(true);
    } catch (err) {
      // Local fallback for demo credentials matching existing stylists
      const matched = stylists.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setCurrentStylistId(matched.id);
        setIsStylistAuthenticated(true);
      } else {
        throw new Error("Adresse email ou mot de passe non reconnu. Vous pouvez créer un compte ou utiliser les comptes démo ci-dessous.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const registerStylist = async (params: RegisterStylistParams) => {
    setIsSyncing(true);
    const newStylistId = `stylist-${Date.now().toString(36)}`;
    let uid = newStylistId;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, params.email, params.password);
      uid = userCredential.user.uid;
      await updateProfile(userCredential.user, {
        displayName: params.stylistName,
      });
    } catch (err: any) {
      console.warn("Firebase email signup error, continuing with local registration:", err.message);
    }

    const newProfile: StylistProfile = {
      id: newStylistId,
      userId: uid,
      salonName: params.salonName,
      stylistName: params.stylistName,
      title: "Artiste Coiffeur / Coloriste",
      bio: `Bienvenue à ${params.salonName}. Prestations d'exception au salon ou à domicile à ${params.city}.`,
      phone: params.phone,
      whatsappNumber: params.whatsappNumber,
      email: params.email,
      address: params.address,
      city: params.city,
      postalCode: "20000",
      acceptsHomeBooking: params.acceptsHomeBooking,
      homeRadiusKm: 25,
      homeExtraFee: 120, // 120 MAD
      rating: 5.0,
      reviewCount: 1,
      instagramHandle: `@${params.salonName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      specialties: ["Coupe Créateur", "Brushing Glamour", "Soins Régénérants"],
      openingHours: {
        lundi: { open: '09:00', close: '19:30', closed: false },
        mardi: { open: '09:00', close: '19:30', closed: false },
        mercredi: { open: '09:00', close: '19:30', closed: false },
        jeudi: { open: '09:00', close: '20:00', closed: false },
        vendredi: { open: '09:00', close: '20:30', closed: false },
        samedi: { open: '09:00', close: '19:30', closed: false },
        dimanche: { open: '10:00', close: '16:00', closed: true }
      }
    };

    // Add default services for new stylist in MAD
    const defaultServices: Service[] = [
      {
        id: `srv-${Date.now().toString(36)}-1`,
        stylistId: newStylistId,
        name: 'Coupe Haute Précision & Brushing',
        category: 'coupe',
        durationMinutes: 60,
        price: 350,
        description: 'Shampoing massant, coupe sculptée selon la texture et brushing soigné.',
        salonAvailable: true,
        homeAvailable: params.acceptsHomeBooking,
        popular: true,
      },
      {
        id: `srv-${Date.now().toString(36)}-2`,
        stylistId: newStylistId,
        name: 'Balayage Signature & Gloss',
        category: 'coloration',
        durationMinutes: 150,
        price: 1100,
        description: 'Éclaircissement fondu naturel, patine brillante et soin scellant.',
        salonAvailable: true,
        homeAvailable: params.acceptsHomeBooking,
        popular: true,
      },
      {
        id: `srv-${Date.now().toString(36)}-3`,
        stylistId: newStylistId,
        name: 'Soin Botox Capillaire Régénérant',
        category: 'soin',
        durationMinutes: 90,
        price: 800,
        description: 'Cure thermo-active ultra-hydratante à l\'acide hyaluronique.',
        salonAvailable: true,
        homeAvailable: params.acceptsHomeBooking,
      }
    ];

    setStylists(prev => [newProfile, ...prev]);
    setServices(prev => [...defaultServices, ...prev]);
    setCurrentStylistId(newStylistId);
    setSelectedStylistId(newStylistId);
    setIsStylistAuthenticated(true);
    setIsSyncing(false);
  };

  const loginWithGoogle = async () => {
    try {
      setIsSyncing(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setIsStylistAuthenticated(true);
        // Check if stylist exists or create
        const existing = stylists.find(s => s.email === res.user.email);
        if (existing) {
          setCurrentStylistId(existing.id);
        } else {
          const newId = `stylist-${Date.now().toString(36)}`;
          const newProfile: StylistProfile = {
            id: newId,
            userId: res.user.uid,
            salonName: `Atelier ${res.user.displayName || 'Haute Coiffure'}`,
            stylistName: res.user.displayName || 'Coiffeur Partenaire',
            title: "Artiste Coiffeur Professionnel",
            bio: "Bienvenue sur mon espace de réservation et diagnostic capillaire.",
            phone: "+212 6 00 00 00 00",
            whatsappNumber: "212600000000",
            email: res.user.email || '',
            address: "Boulevard d'Anfa, Gauthier",
            city: "Casablanca",
            postalCode: "20000",
            acceptsHomeBooking: true,
            homeRadiusKm: 25,
            homeExtraFee: 120, // 120 MAD
            rating: 5.0,
            reviewCount: 0,
            instagramHandle: "@monatelier.ma",
            openingHours: INITIAL_STYLISTS[0].openingHours
          };
          setStylists(prev => [newProfile, ...prev]);
          setCurrentStylistId(newId);
        }
      }
      setIsAuthModalOpen(false);
      setActiveMode('stylist');
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {}
    setIsStylistAuthenticated(false);
    setActiveMode('client');
  };

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'reminderSent'>): Appointment => {
    const newId = `apt-${Date.now().toString(36)}`;
    const newAppointment: Appointment = {
      ...data,
      id: newId,
      stylistId: data.stylistId || selectedStylistId,
      createdAt: new Date().toISOString(),
      reminderSent: false,
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    setClients((prevClients) => {
      const existing = prevClients.find(c => c.phone === data.clientPhone || c.email === data.clientEmail);
      if (existing) {
        return prevClients.map(c => c.id === existing.id ? {
          ...c,
          totalBookings: c.totalBookings + 1,
          totalSpent: c.totalSpent + data.price,
          lastVisit: data.date,
          address: data.address || c.address
        } : c);
      } else {
        const newClient: Client = {
          id: `cl-${Date.now().toString(36)}`,
          stylistId: data.stylistId || selectedStylistId,
          name: data.clientName,
          phone: data.clientPhone,
          email: data.clientEmail,
          totalBookings: 1,
          totalSpent: data.price,
          lastVisit: data.date,
          preferredLocation: data.locationType,
          address: data.address,
          notes: data.notes ? `Note réservation: ${data.notes}` : 'Nouveau client web',
          createdAt: new Date().toISOString().split('T')[0]
        };
        return [newClient, ...prevClients];
      }
    });

    try {
      const aptDocRef = doc(db, 'appointments', newId);
      setDoc(aptDocRef, newAppointment, { merge: true }).catch(() => {});
    } catch {}

    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    try {
      const docRef = doc(db, 'appointments', id);
      setDoc(docRef, { status }, { merge: true }).catch(() => {});
    } catch {}
  };

  const markReminderSent = (id: string) => {
    const timestamp = new Date().toISOString();
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, reminderSent: true, reminderSentAt: timestamp } : apt))
    );
    try {
      const docRef = doc(db, 'appointments', id);
      setDoc(docRef, { reminderSent: true, reminderSentAt: timestamp }, { merge: true }).catch(() => {});
    } catch {}
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'verified'>) => {
    const targetStylistId = reviewData.stylistId || selectedStylistId;
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now().toString(36)}`,
      stylistId: targetStylistId,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };
    setReviews((prev) => [newReview, ...prev]);

    setStylists((prev) =>
      prev.map((s) => {
        if (s.id === targetStylistId) {
          const stylistReviews = [newReview.rating, ...reviews.filter(r => r.stylistId === targetStylistId).map(r => r.rating)];
          const avg = stylistReviews.reduce((a, b) => a + b, 0) / stylistReviews.length;
          return {
            ...s,
            rating: Number(avg.toFixed(2)),
            reviewCount: s.reviewCount + 1,
          };
        }
        return s;
      })
    );

    try {
      const reviewDoc = doc(db, 'reviews', newReview.id);
      setDoc(reviewDoc, newReview, { merge: true }).catch(() => {});
    } catch {}
  };

  const replyToReview = (reviewId: string, reply: string) => {
    const date = new Date().toISOString().split('T')[0];
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, stylistReply: reply, stylistReplyDate: date } : r))
    );
    try {
      const docRef = doc(db, 'reviews', reviewId);
      setDoc(docRef, { stylistReply: reply, stylistReplyDate: date }, { merge: true }).catch(() => {});
    } catch {}
  };

  const sendChatMessage = (chatId: string, text: string, sender: 'stylist' | 'client', senderName: string) => {
    const activeStylist = sender === 'stylist' ? currentStylist : selectedStylist;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now().toString(36)}`,
      chatId,
      stylistId: activeStylist.id,
      sender,
      senderName,
      text,
      timestamp: new Date().toISOString(),
      read: sender === 'stylist',
    };
    setChatMessages((prev) => [...prev, newMsg]);

    if (sender === 'client') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg-${Date.now().toString(36) + 1}`,
          chatId,
          stylistId: activeStylist.id,
          sender: 'stylist',
          senderName: activeStylist.stylistName,
          text: `Bonjour ${senderName} ! Merci pour votre message. Je suis actuellement en prestation avec un client à ${activeStylist.city}. Je prends note de votre demande et je vous réponds précisément dans quelques instants ! ✨`,
          timestamp: new Date().toISOString(),
          read: true,
        };
        setChatMessages((prev) => [...prev, autoReply]);
      }, 1500);
    }

    try {
      const msgDoc = doc(db, 'chats', chatId, 'messages', newMsg.id);
      setDoc(msgDoc, newMsg, { merge: true }).catch(() => {});
    } catch {}
  };

  const updateStylistProfile = (updated: Partial<StylistProfile>) => {
    setStylists((prev) =>
      prev.map((s) => (s.id === currentStylistId ? { ...s, ...updated } : s))
    );
  };

  const addService = (srv: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...srv,
      id: `srv-${Date.now().toString(36)}`,
      stylistId: currentStylistId,
    };
    setServices((prev) => [...prev, newService]);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const saveTemplate = (template: WhatsAppReminderTemplate) => {
    setTemplates((prev) => {
      const exists = prev.some(t => t.id === template.id);
      if (exists) {
        return prev.map(t => t.id === template.id ? template : t);
      }
      return [...prev, template];
    });
  };

  const updateClientNotes = (clientId: string, notes: string, hairType?: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, notes, ...(hairType ? { hairType } : {}) } : c))
    );
  };

  return (
    <SalonContext.Provider
      value={{
        user,
        activeMode,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isStylistAuthenticated,
        stylists,
        currentStylistId,
        currentStylist,
        stylistProfile: currentStylist,
        selectedStylistId,
        selectedStylist,
        setCurrentStylistId,
        setSelectedStylistId,
        services,
        appointments,
        clients,
        reviews,
        templates,
        chatMessages,
        selectedChatId,
        clientBookingPhone,
        isSyncing,
        switchMode,
        setSelectedChatId,
        setClientBookingPhone,
        addAppointment,
        updateAppointmentStatus,
        markReminderSent,
        addReview,
        replyToReview,
        sendChatMessage,
        updateStylistProfile,
        addService,
        updateService,
        deleteService,
        saveTemplate,
        updateClientNotes,
        loginStylist,
        registerStylist,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = (): SalonContextType => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
