import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Scissors, 
  Lock, 
  Mail, 
  User, 
  Store, 
  MapPin, 
  Phone, 
  Sparkles, 
  Check, 
  LogIn, 
  UserPlus, 
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Calendar
} from 'lucide-react';

export const StylistAuthGate: React.FC = () => {
  const { 
    loginStylist, 
    registerStylist, 
    loginWithGoogle, 
    stylists, 
    setCurrentStylistId, 
    switchMode 
  } = useSalon();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regSalonName, setRegSalonName] = useState('');
  const [regCity, setRegCity] = useState('Casablanca');
  const [regAddress, setRegAddress] = useState('');
  const [regPhone, setRegPhone] = useState('+212 6 ');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regHomeService, setRegHomeService] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await loginStylist(loginEmail, loginPassword);
    } catch (err: any) {
      setErrorMsg(err.message || "Identifiants incorrects ou utilisateur non trouvé.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await registerStylist({
        stylistName: regName,
        salonName: regSalonName,
        city: regCity,
        address: regAddress || `Centre-ville, ${regCity}`,
        phone: regPhone,
        whatsappNumber: regPhone.replace(/[^0-9]/g, ''),
        email: regEmail,
        password: regPassword,
        acceptsHomeBooking: regHomeService,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de la création du compte coiffeur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (stylistId: string) => {
    setCurrentStylistId(stylistId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
      
      {/* Return to client portal button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => switchMode('client')}
          className="inline-flex items-center space-x-2 text-xs font-medium text-stone-400 hover:text-amber-300 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Retourner à l'espace de réservation client</span>
        </button>

        <span className="text-[11px] text-amber-400 font-mono flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Accès Pro Sécurisé • Maroc MAD</span>
        </span>
      </div>

      {/* Hero Presentation */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] mx-auto shadow-xl shadow-amber-500/20">
          <div className="w-full h-full bg-stone-950 rounded-3xl flex items-center justify-center">
            <Scissors className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-stone-100 font-editorial tracking-wide">
          Espace Professionnel Coiffure
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
          Pour accéder à votre tableau de bord unique, gérer votre planning en temps réel, vos recettes en MAD et vos rappels WhatsApp automatiques, veuillez vous connecter ou inscrire votre salon.
        </p>
      </div>

      {/* Feature perks pill row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-200">Planning Interactif</p>
            <p className="text-[11px] text-stone-400">Temps réel salon & domicile</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-200">Rappels WhatsApp</p>
            <p className="text-[11px] text-stone-400">Automatiques & programmables</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-200">Statistiques en MAD</p>
            <p className="text-[11px] text-stone-400">Revenus mensuels et panier moyen</p>
          </div>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Auth Mode Switcher */}
        <div className="flex bg-stone-950 p-1.5 rounded-2xl border border-stone-800 text-xs max-w-md mx-auto">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-medium transition flex items-center justify-center space-x-2 ${
              authMode === 'login'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Se Connecter</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-medium transition flex items-center justify-center space-x-2 ${
              authMode === 'register'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Créer mon Salon (Inscription)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN VIEW */}
        {authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto text-xs">
            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Adresse Email professionnelle :</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="coiffeur@salon.ma"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-3 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Mot de passe :</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-3 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Connexion en cours...' : 'Accéder à mon Dashboard'}</span>
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-stone-500">ou connectez-vous avec</span>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 font-medium text-xs transition flex items-center justify-center space-x-2"
            >
              <span>Continuer avec Google</span>
            </button>

            {/* Quick Demo Test Access */}
            <div className="pt-5 border-t border-stone-800/80 space-y-2.5">
              <div className="text-center">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                  Accès Démo Immédiat (1 clic) :
                </span>
                <span className="text-[10px] text-stone-400">
                  Choisissez un profil de coiffeur existant pour tester son dashboard unique
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {stylists.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(s.id)}
                    className="p-2.5 rounded-xl bg-stone-950 hover:bg-amber-500/10 border border-stone-800 hover:border-amber-500/40 text-left transition group"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                        {s.stylistName.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-semibold text-stone-200 block truncate text-[11px] group-hover:text-amber-300">
                          {s.stylistName}
                        </span>
                        <span className="text-[10px] text-stone-400 truncate block">
                          📍 {s.city}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION VIEW */
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Votre nom et prénom : *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fatima Zahra"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Nom de votre Salon / Atelier : *</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: L'Atelier Bohème Casablanca"
                    value={regSalonName}
                    onChange={(e) => setRegSalonName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Ville au Maroc : *</label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Fès">Fès</option>
                  <option value="Meknès">Meknès</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Téléphone WhatsApp : *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+212 6 12 34 56 78"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium">Adresse du salon (Quartier, Boulevard) :</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Ex: Quartier Racine, Boulevard Massira, Casablanca"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Email professionnel : *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="fatima@atelier.ma"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Mot de passe : *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Au moins 6 caractères"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center space-x-3">
              <input
                type="checkbox"
                id="homeServiceCheck"
                checked={regHomeService}
                onChange={(e) => setRegHomeService(e.target.checked)}
                className="w-4 h-4 rounded border-stone-800 text-amber-500"
              />
              <label htmlFor="homeServiceCheck" className="text-stone-300 cursor-pointer">
                Je propose également des prestations à Domicile (+120 MAD de frais de déplacement)
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Création de votre salon...' : 'Créer mon Salon & Accéder au Dashboard'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
