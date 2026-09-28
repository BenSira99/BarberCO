# L'Atelier Privé — Plateforme Salon de Coiffure & Réservations

Une solution web complète et élégante dédiée aux coiffeurs et coiffeuses indépendants ainsi qu'à leurs clients : gestion de planning en temps réel, fichier client avec fiches techniques, rappels de rendez-vous WhatsApp personnalisables, analyse de revenus mensuels, réservation autonome (en salon ou à domicile), gestion des avis et messagerie instantanée en direct.

## Décisions Clés & Retours Utilisateur

> [!IMPORTANT]
> Les trois choix d'orientation produit validés lors de la phase de cadrage :
> 1. **Navigation** : Double espace unifié et fluide avec bascule instantanée entre **Espace Pro** (agenda, clients, compta, chat pro) et **Espace Client** (réservation salon/domicile, mes rendez-vous, avis, chat).
> 2. **Identité Visuelle** : Esthétique haut de gamme sombre avec accents champagne et or brossé (`#0B0D11`, `#161B26`, touches dorées `#D4AF37` / `#E6CA65`), typographie de caractère d'inspiration éditoriale et chiffres tabulaires.
> 3. **Rappels WhatsApp** : Moteur de notifications et rappels pré-programmés avec modèles dynamiques personnalisables (tags `{nom}`, `{date}`, `{heure}`, `{service}`, `{lieu}`) et déclenchement direct via `https://wa.me/` pour un envoi instantané sans frais d'API tierce.

---

## 1. Vue d'Ensemble & Proposition de Valeur

### Rôle et Cible
- **Pour le Coiffeur / la Coiffeuse** : Un cockpit tout-en-un pour libérer du temps administratif, suivre son chiffre d'affaires en temps réel, gérer son catalogue de prestations (salon & domicile), organiser son planning, et fidéliser sa clientèle grâce à un carnet technique détaillé et des rappels WhatsApp fiables.
- **Pour la Clientèle** : Une expérience de réservation autonome sans friction, disponible 24/7 sur mobile et desktop, avec choix clair entre visite au salon ou prestation à domicile (avec adresse), consultation du portfolio & avis vérifiés, et chat direct avec le coiffeur.

### Valeur Clé
- **Zéro Rendez-vous Oublié** : Réduction drastique des no-shows grâce aux rappels programmés WhatsApp en un clic.
- **Transparence Financière** : Tableau de bord des revenus mensuels, panier moyen et ventilation salon vs domicile.
- **Personnalisation & Fidélisation** : Historique complet de chaque coupe/coloration avec notes techniques (patine, temps de pose, nuances).

---

## 2. Expérience Utilisateur & Design Visuel

### Parcours Utilisateur
1. **Bascule Pro / Client** : Un sélecteur d'espace ergonomique dans la barre supérieure permettant de tester immédiatement l'expérience des deux côtés, ou de se connecter via Firebase Google Sign-In.
2. **Espace Client — Réservation en 4 Étapes** :
   - Choix du type de prestation : **Au Salon** (adresse du salon fixe) ou **À Domicile** (champ de géolocalisation / saisie d'adresse).
   - Sélection du service dans le catalogue proposé par le coiffeur (avec durée, tarif et description).
   - Choix de la date et du créneau horaire dynamique (filtré selon les disponibilités réelles de l'agenda).
   - Coordonnées client, confirmation instantanée, ajout au calendrier et lien WhatsApp direct.
3. **Espace Pro — Pilotage du Quotidien** :
   - **Planning Interactif** : Vues Jour, Semaine et Mois, filtres par statut (Confirmé, En attente, Terminé, Annulé), drag-and-drop/déplacement de créneaux et création manuelle rapide.
   - **Fichier Clients (CRM Coiffure)** : Fiche contact, historique des passages, préférences, formule de couleur (ex. 6.13 + 20vol 35min), photos d'inspiration et statut de fidélité.
   - **Statistiques & Revenus** : Graphiques d'évolution du CA mensuel, panier moyen, répartition salon/domicile, taux d'occupation de l'agenda.
   - **Modèles de Rappels WhatsApp** : Éditeur de messages types pour la veille du RDV, confirmation immédiate ou message de remerciement post-prestation.
   - **Messagerie / Chat Intégré** : Fil de discussion en temps réel entre client et coiffeur avec statut de lecture et partage de photos.
   - **Avis & Profil Public** : Modération et réponse aux avis clients avec note globale sur 5 étoiles.

### Système Visuel & Palette de Couleurs
- **Ambiance Sombre & Élégante** :
  - Fond dominant : Ardoise profonde veloutée (`#0B0D11`)
  - Surfaces secondaires et cartes : Noir minéral (`#141822`) avec bordures fines laiton doux (`border-amber-500/15`)
  - Accents dorés : Champagne satiné (`#E6CA65`), Or noble (`#D4AF37`) et Ambre chaleureux
  - Typographie : Titres éditoriaux à fort caractère, corps de texte moderne et épuré, données numériques en `tabular-nums`
- **Discipline Anti-Slop** :
  - Pas d'angles surdimensionnés ou de bulles criardes.
  - Métadonnées épurées avec séparateurs discrets (`·`).
  - Boutons de filtre segmentés et lisibles, contrastes WCAG AA garantis.

---

## 3. Choix Produits & Arbitrages Techniques

### Décision 1 : Moteur de Rappels WhatsApp
- **Approche Retenue** : Système de modèles configurables avec injection automatique des données du RDV et génération d'URL universelle `https://wa.me/{phone}?text={encodedText}`.
- **Bénéfice** : Fonctionne instantanément sur mobile (ouverture de l'application WhatsApp) et sur ordinateur (WhatsApp Web), sans nécessiter d'abonnement coûteux à l'API WhatsApp Business Meta Cloud ni validation de templates par Meta.
- **Planificateur de rappels** : L'agenda affiche des indicateurs de statut de rappel (À envoyer aujourd'hui / Envoyé / Reçu) avec un bouton d'action directe.

### Décision 2 : Réservation Salon vs Domicile
- **Approche Retenue** : Le catalogue permet de configurer si une prestation est disponible en salon uniquement, à domicile uniquement, ou les deux. En mode domicile, l'adresse exacte et d'éventuels frais de déplacement s'intègrent directement au récapitulatif du panier.

### Décision 3 : Persistance Firebase & Mode Démo Réactif
- **Approche Retenue** : Intégration complète de Firebase (Auth Google + Firestore) avec synchronisation en temps réel (`onSnapshot`). En l'absence de configuration immédiate ou en mode invité, un état réactif local initialisé avec des données de démonstration réalistes assure un fonctionnement parfait sans aucun écran bloquant.

---

## 4. Architecture Technique & Modèle de Données

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Barre Supérieure Unifiée                        │
│  [ L'Atelier Privé ]   [ Navigation Contextuelle ]   [ Switch Pro/Client │ Profil ]
└────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│           Espace Pro            │       │          Espace Client          │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ • Planning / Agenda interactif  │       │ • Prise de rendez-vous en ligne │
│ • Fichier Clients & Fiches Tech │       │ • Choix : Salon ou Domicile     │
│ • Statistiques de Revenus       │       │ • Catalogue des coupes & soins  │
│ • Gestionnaire Rappels WhatsApp │       │ • Espace "Mes Rendez-vous"      │
│ • Profil, Services & Avis       │       │ • Profil du coiffeur & Avis     │
│ • Messagerie Pro en direct      │       │ • Chat en direct avec le salon  │
└─────────────────────────────────┘       └─────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                Couche Métier, État Réactif & Firebase                  │
│   • AuthContext (Google Sign-In / Rôles Pro & Client)                  │
│   • AppointmentsStore (Créneaux, statuts, adresses domicile)          │
│   • ClientsStore (Fichier client, historiques techniques, notes)       │
│   • ServicesStore (Prestations, durées, tarifs, compatibilité lieu)    │
│   • ChatStore (Messages instantanés en direct avec pièces jointes)     │
│   • ReviewsStore (Avis vérifiés, notes par critère, réponses pro)      │
│   • WhatsAppEngine (Templates, tag interpolation, URL builder)         │
└────────────────────────────────────────────────────────────────────────┘
```

### Entités Firestore Clés
1. `appointments` : `id`, `clientId`, `clientName`, `clientPhone`, `serviceId`, `serviceName`, `date`, `time`, `duration`, `price`, `type` (`salon` | `domicile`), `clientAddress`, `status` (`pending` | `confirmed` | `completed` | `cancelled`), `whatsappReminderSent`, `notes`, `createdAt`.
2. `clients` : `id`, `name`, `phone`, `email`, `address`, `notes`, `formulaHistory` (tableau d'interventions techniques), `totalSpent`, `appointmentsCount`, `lastVisit`.
3. `services` : `id`, `name`, `category`, `durationMin`, `price`, `description`, `locationAvailability` (`salon` | `domicile` | `both`), `image`.
4. `messages` : `id`, `conversationId`, `senderRole` (`pro` | `client`), `senderName`, `text`, `timestamp`, `read`.
5. `reviews` : `id`, `appointmentId`, `clientName`, `rating` (1-5), `comment`, `serviceName`, `date`, `proReply`.
6. `salon_settings` : `name`, `phone`, `address`, `bio`, `openingHours`, `whatsappTemplates`, `revenueTarget`.

---

## 5. Étapes de Mise en Œuvre

1. **Phase Firebase** : Initialisation du schéma Firestore (`firebase-blueprint.json`), configuration de Firebase Auth, règles de sécurité renforcées (`firestore.rules`).
2. **Design & Thème** : Mise en place du layout responsive 1440px avec style noir et or champagne, navigation pro/client instantanée, typographies et composants UI soignés.
3. **Moteur Métier & Données** : Implémentation du système d'agenda temps réel, du catalogue salon/domicile, du module de calcul des statistiques financières mensuelles et du générateur WhatsApp.
4. **Chat & Avis** : Intégration de la messagerie instantanée en direct et du système d'avis vérifiés.
5. **Vérification & Validation** : Tests fonctionnels de réservation, tests de persistance et compilation de l'applet sans erreurs.
