import { Service, Appointment, Client, Review, StylistProfile, WhatsAppReminderTemplate, ChatMessage } from '../types';

export const INITIAL_STYLISTS: StylistProfile[] = [
  {
    id: 'stylist-yasmine',
    salonName: "L'Atelier Privé Casablanca",
    stylistName: "Yasmine Alami",
    title: "Artiste Coiffeuse & Coloriste Experte",
    bio: "Spécialiste reconnue des blonds sur-mesure, des balayages fondu naturel et des soins réparateurs intenses. Je vous accueille dans mon salon confidentiel à Gauthier ou me déplace à votre domicile pour une expérience exclusive.",
    phone: "+212 6 42 19 88 05",
    whatsappNumber: "212642198805",
    email: "yasmine.alami@latelierprive.ma",
    address: "24 Rue Jean Jaurès, Quartier Gauthier",
    city: "Casablanca",
    postalCode: "20000",
    acceptsHomeBooking: true,
    homeRadiusKm: 25,
    homeExtraFee: 120, // 120 MAD
    rating: 4.96,
    reviewCount: 156,
    instagramHandle: "@latelierprive.casa",
    specialties: ["Balayage Signature", "Soin Botox Capillaire", "Brushing Glamour", "Coloration Reflets"],
    openingHours: {
      lundi: { open: '09:30', close: '19:30', closed: false },
      mardi: { open: '09:30', close: '19:30', closed: false },
      mercredi: { open: '09:30', close: '19:30', closed: false },
      jeudi: { open: '09:30', close: '20:00', closed: false },
      vendredi: { open: '09:30', close: '20:30', closed: false },
      samedi: { open: '09:00', close: '19:30', closed: false },
      dimanche: { open: '10:00', close: '16:00', closed: true }
    }
  },
  {
    id: 'stylist-mehdi',
    salonName: "Barber & Lounge Guéliz",
    stylistName: "Mehdi Berrada",
    title: "Maître Barbier & Styliste Masculin",
    bio: "Une approche moderne du grooming masculin au cœur de Guéliz. Dégradés chirurgicaux, rituels barbe à la serviette chaude aux huiles orientales, service en salon ou à votre villa/riad.",
    phone: "+212 6 61 23 45 67",
    whatsappNumber: "212661234567",
    email: "mehdi.berrada@barberlounge.ma",
    address: "15 Avenue Mohammed V, Guéliz",
    city: "Marrakech",
    postalCode: "40000",
    acceptsHomeBooking: true,
    homeRadiusKm: 30,
    homeExtraFee: 150, // 150 MAD
    rating: 4.94,
    reviewCount: 98,
    instagramHandle: "@mehdi.barber.marrakech",
    specialties: ["Coupe Dégradé Américain", "Rituel Barbe Traditionnelle", "Soin Visage Purifiant"],
    openingHours: {
      lundi: { open: '10:00', close: '20:00', closed: false },
      mardi: { open: '10:00', close: '20:00', closed: false },
      mercredi: { open: '10:00', close: '20:00', closed: false },
      jeudi: { open: '10:00', close: '21:00', closed: false },
      vendredi: { open: '10:00', close: '21:30', closed: false },
      samedi: { open: '10:00', close: '20:30', closed: false },
      dimanche: { open: '11:00', close: '18:00', closed: false }
    }
  },
  {
    id: 'stylist-salma',
    salonName: "Maison Tazi Haute Coiffure",
    stylistName: "Salma Tazi",
    title: "Créatrice Coiffure Mariée & Soins d'Exception",
    bio: "Diplômée des plus prestigieuses académies, spécialisée dans les chignons haute couture, les tresses graphiques et les mises en beauté pour mariages et cérémonies à Rabat.",
    phone: "+212 6 70 88 99 00",
    whatsappNumber: "212670889900",
    email: "salma@maisontazi.ma",
    address: "42 Avenue de France, Haut Agdal",
    city: "Rabat",
    postalCode: "10000",
    acceptsHomeBooking: true,
    homeRadiusKm: 35,
    homeExtraFee: 180, // 180 MAD
    rating: 4.98,
    reviewCount: 210,
    instagramHandle: "@salmatazi.coiffure",
    specialties: ["Chignon Mariée & Événement", "Nattes & Tresses Couture", "Lissage Kératine"],
    openingHours: {
      lundi: { open: '09:00', close: '19:00', closed: false },
      mardi: { open: '09:00', close: '19:00', closed: false },
      mercredi: { open: '09:00', close: '19:00', closed: false },
      jeudi: { open: '09:00', close: '20:00', closed: false },
      vendredi: { open: '09:00', close: '20:00', closed: false },
      samedi: { open: '08:30', close: '19:30', closed: false },
      dimanche: { open: '10:00', close: '16:00', closed: true }
    }
  },
  {
    id: 'stylist-karim',
    salonName: "Atelier Karim Malabata",
    stylistName: "Karim El Fassi",
    title: "Coloriste & Styliste Urbain",
    bio: "Créateur de tendances face à la baie de Tanger. Expert des reflets solaires, des coupes modernes texturées et des traitements lissants sans formol.",
    phone: "+212 6 52 33 44 55",
    whatsappNumber: "212652334455",
    email: "karim@atelierelfassi.ma",
    address: "Boulevard Mohamed VI, Marina Bay",
    city: "Tanger",
    postalCode: "90000",
    acceptsHomeBooking: false,
    homeRadiusKm: 0,
    homeExtraFee: 0,
    rating: 4.91,
    reviewCount: 74,
    instagramHandle: "@karim.tangerhair",
    specialties: ["Coloration Miroir", "Coupe Déstructurée", "Lissage Brésilien"],
    openingHours: {
      lundi: { open: '10:00', close: '20:00', closed: false },
      mardi: { open: '10:00', close: '20:00', closed: false },
      mercredi: { open: '10:00', close: '20:00', closed: false },
      jeudi: { open: '10:00', close: '20:00', closed: false },
      vendredi: { open: '10:00', close: '21:00', closed: false },
      samedi: { open: '09:30', close: '20:00', closed: false },
      dimanche: { open: '10:00', close: '17:00', closed: true }
    }
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    stylistId: 'stylist-yasmine',
    name: 'Balayage Signature & Gloss Couture',
    category: 'coloration',
    durationMinutes: 150,
    price: 1100, // 1100 MAD
    description: 'Éclaircissement sur-mesure effet fondu naturel, patine ton sur ton brillante et soin scellant profond aux protéines de soie.',
    salonAvailable: true,
    homeAvailable: true,
    popular: true,
  },
  {
    id: 'srv-2',
    stylistId: 'stylist-yasmine',
    name: 'Coupe Haute Précision & Brushing Glamour',
    category: 'coupe',
    durationMinutes: 60,
    price: 450, // 450 MAD
    description: 'Diagnostic morphologique, shampoing massant relaxant, coupe sculptée selon la texture naturelle et brushing souple.',
    salonAvailable: true,
    homeAvailable: true,
    popular: true,
  },
  {
    id: 'srv-3',
    stylistId: 'stylist-yasmine',
    name: 'Soin Botox Capillaire Régénérant',
    category: 'soin',
    durationMinutes: 90,
    price: 850, // 850 MAD
    description: 'Cure thermo-active ultra-hydratante à l\'acide hyaluronique et kératine végétale. Répare la fibre et élimine les frisottis.',
    salonAvailable: true,
    homeAvailable: true,
    popular: true,
  },
  {
    id: 'srv-4',
    stylistId: 'stylist-yasmine',
    name: 'Tresses & Nattes Collées Artistiques',
    category: 'tresses',
    durationMinutes: 120,
    price: 600, // 600 MAD
    description: 'Nattes plaquées créatives avec ou sans mèches de rajout, finitions impeccables et huile d\'argan nourrissante.',
    salonAvailable: true,
    homeAvailable: true,
  },
  {
    id: 'srv-5',
    stylistId: 'stylist-mehdi',
    name: 'Coupe Homme Privilège & Rituel Barbe',
    category: 'coupe',
    durationMinutes: 45,
    price: 250, // 250 MAD
    description: 'Dégradé américain au millimètre, taille de barbe au rasoir traditionnel, serviette chaude et baume bio à l\'huile d\'argan.',
    salonAvailable: true,
    homeAvailable: true,
    popular: true,
  },
  {
    id: 'srv-6',
    stylistId: 'stylist-yasmine',
    name: 'Lissage Brésilien Kératine Pure',
    category: 'soin',
    durationMinutes: 180,
    price: 1500, // 1500 MAD
    description: 'Détente intense du cheveu, brillance miroir et tenue garantie 4 à 6 mois. Adapté aux cheveux indisciplinés.',
    salonAvailable: true,
    homeAvailable: false,
    popular: true,
  },
  {
    id: 'srv-7',
    stylistId: 'stylist-salma',
    name: 'Coiffure Événement & Chignon Mariée',
    category: 'evenement',
    durationMinutes: 90,
    price: 950, // 950 MAD
    description: 'Création couture pour mariages et cérémonies, attache structurée avec fixation longue durée et pose d\'accessoires.',
    salonAvailable: true,
    homeAvailable: true,
    popular: true,
  },
  {
    id: 'srv-8',
    stylistId: 'stylist-karim',
    name: 'Coloration Racines & Reflets Miroir',
    category: 'coloration',
    durationMinutes: 75,
    price: 550, // 550 MAD
    description: 'Couverture optimale des cheveux blancs avec pigments purs sans ammoniaque agressive. Brillance éclatante.',
    salonAvailable: true,
    homeAvailable: true,
  }
];

export const INITIAL_TEMPLATES: WhatsAppReminderTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Rappel 24h avant RDV (Standard)',
    content: "Bonjour {client_name} ! ✨ C'est {coiffeur} de {salon}. Petit rappel pour votre rendez-vous demain à {heure} pour votre {prestation} ({lieu}). Montant : {prix}. En cas d'imprévu, merci de me prévenir au plus vite. À demain avec plaisir !",
    triggerHoursBefore: 24,
    isDefault: true,
  },
  {
    id: 'tpl-2',
    title: 'Rappel Domicile 2h avant avec préparation',
    content: "Bonjour {client_name} ! 🚗 Je serai chez vous à {heure} pour votre rendez-vous {prestation} à l'adresse suivante : {adresse}. Total : {prix}. Pensez à prévoir une chaise confortable près d'une prise. À tout à l'heure !",
    triggerHoursBefore: 2,
    isDefault: false,
  },
  {
    id: 'tpl-3',
    title: 'Confirmation immédiate de réservation',
    content: "Bonjour {client_name} ! ✨ Votre réservation chez {salon} pour le {date} à {heure} ({prestation}) est bien enregistrée ! Mode : {lieu}. Tarif : {prix}. Hâte de vous accueillir !",
    triggerHoursBefore: 0,
    isDefault: false,
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cl-1',
    stylistId: 'stylist-yasmine',
    name: 'Kenza Bennani',
    phone: '+212 6 12 34 56 78',
    email: 'kenza.bennani@gmail.com',
    totalBookings: 6,
    totalSpent: 6600, // 6600 MAD
    lastVisit: '2026-09-18',
    preferredLocation: 'salon',
    hairType: 'Cheveux ondulés épais, balayage régulier',
    notes: 'Préfère le thé à la menthe peu sucré. Sensibilité légère au cuir chevelu lors des décolorations.',
    address: 'Résidence Les Palmiers, Boulevard d\'Anfa, Casablanca',
    createdAt: '2025-11-10'
  },
  {
    id: 'cl-2',
    stylistId: 'stylist-yasmine',
    name: 'Zineb El Amrani',
    phone: '+212 6 88 99 11 22',
    email: 'zineb.amrani@gmail.com',
    totalBookings: 4,
    totalSpent: 2280, // 2280 MAD
    lastVisit: '2026-09-24',
    preferredLocation: 'home',
    hairType: 'Cheveux fins méchés, longueur mi-dos',
    notes: 'Rendez-vous à domicile le vendredi matin. Chien très calme.',
    address: 'Villa 14, Rue Abou Inane, Californie, Casablanca',
    createdAt: '2026-01-15'
  },
  {
    id: 'cl-3',
    stylistId: 'stylist-mehdi',
    name: 'Amine Chraibi',
    phone: '+212 6 77 44 22 10',
    email: 'amine.chraibi@outlook.com',
    totalBookings: 8,
    totalSpent: 2000, // 2000 MAD
    lastVisit: '2026-09-26',
    preferredLocation: 'salon',
    hairType: 'Court classique dégradé à blanc',
    notes: 'Client très ponctuel. Rituel taille de barbe avec serviette chaude systématique.',
    address: 'Résidence Majorelle, Guéliz, Marrakech',
    createdAt: '2025-08-04'
  },
  {
    id: 'cl-4',
    stylistId: 'stylist-salma',
    name: 'Meryem Tazi',
    phone: '+212 6 55 43 21 00',
    email: 'meryem.tazi@menara.ma',
    totalBookings: 3,
    totalSpent: 2850, // 2850 MAD
    lastVisit: '2026-09-02',
    preferredLocation: 'home',
    hairType: 'Cheveux denses bouclés',
    notes: 'Aime les chignons structurés et les soins hydratants profonds.',
    address: 'Avenue des Nations Unies, Agdal, Rabat',
    createdAt: '2026-04-12'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    stylistId: 'stylist-yasmine',
    clientName: 'Kenza Bennani',
    clientPhone: '+212 6 12 34 56 78',
    clientEmail: 'kenza.bennani@gmail.com',
    serviceId: 'srv-1',
    serviceName: 'Balayage Signature & Gloss Couture',
    price: 1100, // 1100 MAD
    durationMinutes: 150,
    date: '2026-09-28',
    time: '14:00',
    locationType: 'salon',
    notes: 'Repousse racines 3 cm, reflets froids dorés.',
    status: 'confirmed',
    reminderSent: true,
    reminderSentAt: '2026-09-27T10:15:00Z',
    createdAt: '2026-09-21T09:00:00Z',
    stylistNotes: 'Formule patine 9.12 + 10.02 au révélateur doux.'
  },
  {
    id: 'apt-102',
    stylistId: 'stylist-yasmine',
    clientName: 'Zineb El Amrani',
    clientPhone: '+212 6 88 99 11 22',
    clientEmail: 'zineb.amrani@gmail.com',
    serviceId: 'srv-2',
    serviceName: 'Coupe Haute Précision & Brushing Glamour',
    price: 570, // 450 + 120 MAD déplacement
    durationMinutes: 60,
    date: '2026-09-28',
    time: '17:00',
    locationType: 'home',
    address: 'Villa 14, Rue Abou Inane, Californie, Casablanca',
    addressDetails: 'Portail noir, sonnette El Amrani',
    notes: 'À domicile. Bébé dort, merci de toquer doucement.',
    status: 'confirmed',
    reminderSent: true,
    reminderSentAt: '2026-09-27T14:30:00Z',
    createdAt: '2026-09-22T11:20:00Z'
  },
  {
    id: 'apt-103',
    stylistId: 'stylist-mehdi',
    clientName: 'Amine Chraibi',
    clientPhone: '+212 6 77 44 22 10',
    clientEmail: 'amine.chraibi@outlook.com',
    serviceId: 'srv-5',
    serviceName: 'Coupe Homme Privilège & Rituel Barbe',
    price: 250, // 250 MAD
    durationMinutes: 45,
    date: '2026-09-29',
    time: '10:30',
    locationType: 'salon',
    notes: 'Dégradé très court sur les côtés.',
    status: 'confirmed',
    reminderSent: false,
    createdAt: '2026-09-24T16:45:00Z'
  },
  {
    id: 'apt-104',
    stylistId: 'stylist-yasmine',
    clientName: 'Leila Mansouri',
    clientPhone: '+212 6 33 22 11 00',
    clientEmail: 'leila.mansouri@gmail.com',
    serviceId: 'srv-3',
    serviceName: 'Soin Botox Capillaire Régénérant',
    price: 850, // 850 MAD
    durationMinutes: 90,
    date: '2026-09-30',
    time: '11:00',
    locationType: 'salon',
    notes: 'Cheveux desséchés après l\'été.',
    status: 'confirmed',
    reminderSent: false,
    createdAt: '2026-09-26T14:00:00Z'
  },
  {
    id: 'apt-105',
    stylistId: 'stylist-salma',
    clientName: 'Meryem Tazi',
    clientPhone: '+212 6 55 43 21 00',
    clientEmail: 'meryem.tazi@menara.ma',
    serviceId: 'srv-7',
    serviceName: 'Coiffure Événement & Chignon Mariée',
    price: 1130, // 950 + 180 MAD déplacement
    durationMinutes: 90,
    date: '2026-10-03',
    time: '09:00',
    locationType: 'home',
    address: 'Avenue des Nations Unies, Agdal, Rabat',
    addressDetails: 'Immeuble C, 3e étage',
    notes: 'Essai pour fiançailles.',
    status: 'pending',
    reminderSent: false,
    createdAt: '2026-09-27T08:30:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    stylistId: 'stylist-yasmine',
    clientName: 'Kenza Bennani',
    rating: 5,
    comment: "Un balayage blond beige incroyable ! Yasmine est d'une écoute et d'une précision exceptionnelles. Le salon à Gauthier est un véritable cocon. Je recommande les yeux fermés !",
    date: '2026-09-20',
    serviceName: 'Balayage Signature & Gloss Couture',
    verified: true,
    locationType: 'salon',
    stylistReply: "Chokran bezzaf Kenza pour ta confiance et ce magnifique retour ! C'est toujours un bonheur de te sublimer.",
    stylistReplyDate: '2026-09-21'
  },
  {
    id: 'rev-2',
    stylistId: 'stylist-yasmine',
    clientName: 'Zineb El Amrani',
    rating: 5,
    comment: "La prestation à domicile à Californie est un vrai bonheur. Yasmine arrive ponctuelle avec son matériel professionnel et préserve une propreté impeccable. Brushing parfait !",
    date: '2026-09-25',
    serviceName: 'Coupe Haute Précision & Brushing Glamour',
    verified: true,
    locationType: 'home',
    stylistReply: "Merci beaucoup Zineb ! Prends bien soin de toi et à très bientôt.",
    stylistReplyDate: '2026-09-25'
  },
  {
    id: 'rev-3',
    stylistId: 'stylist-mehdi',
    clientName: 'Amine Chraibi',
    rating: 5,
    comment: "Meilleur barbier de Marrakech ! Le rituel serviette chaude avec les huiles est une pure détente. Le rappel automatique sur WhatsApp est top.",
    date: '2026-09-26',
    serviceName: 'Coupe Homme Privilège & Rituel Barbe',
    verified: true,
    locationType: 'salon',
  },
  {
    id: 'rev-4',
    stylistId: 'stylist-salma',
    clientName: 'Meryem Tazi',
    rating: 5,
    comment: "Salma a réalisé un chignon de mariée digne des plus grands défilés. Tenue impeccable du matin jusqu'au bout de la nuit !",
    date: '2026-09-03',
    serviceName: 'Coiffure Événement & Chignon Mariée',
    verified: true,
    locationType: 'home',
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    chatId: 'chat-kenza',
    stylistId: 'stylist-yasmine',
    sender: 'client',
    senderName: 'Kenza Bennani',
    text: "Bonjour Yasmine ! Est-ce que tu penses qu'on pourra faire une patine un peu plus perlée cette fois ?",
    timestamp: '2026-09-27T16:20:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    chatId: 'chat-kenza',
    stylistId: 'stylist-yasmine',
    sender: 'stylist',
    senderName: 'Yasmine Alami',
    text: "Bonjour Kenza ! Oui tout à fait, j'ai reçu une nouvelle nuance nacrée magnifique. On regarde ça ensemble dès ton arrivée au salon !",
    timestamp: '2026-09-27T16:35:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    chatId: 'chat-zineb',
    stylistId: 'stylist-yasmine',
    sender: 'client',
    senderName: 'Zineb El Amrani',
    text: "Coucou Yasmine, pour le domicile à Californie est-ce que tu as besoin que je lave mes cheveux avant ou tu fais le shampoing sur place ?",
    timestamp: '2026-09-28T09:15:00Z',
    read: true,
  },
  {
    id: 'msg-4',
    chatId: 'chat-zineb',
    stylistId: 'stylist-yasmine',
    sender: 'stylist',
    senderName: 'Yasmine Alami',
    text: "Coucou Zineb ! Tu peux faire ton shampoing juste avant mon arrivée si tu veux, sinon j'amène mon bac nomade sans aucun souci !",
    timestamp: '2026-09-28T09:30:00Z',
    read: false,
  }
];
