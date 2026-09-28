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
  AlertCircle 
} from 'lucide-react';

interface StylistAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StylistAuthModal: React.FC<StylistAuthModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await loginStylist(loginEmail, loginPassword);
      switchMode('stylist');
      onClose();
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
      switchMode('stylist');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de la création du compte coiffeur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (stylistId: string) => {
    setCurrentStylistId(stylistId);
    switchMode('stylist');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-100 p-1.5 rounded-full hover:bg-stone-800 transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] mx-auto shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center">
              <Scissors className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-stone-100 font-editorial">
            Espace Professionnel Coiffeur
          </h2>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            Connectez-vous ou créez votre salon pour gérer votre agenda, vos tarifs en MAD et vos rappels WhatsApp.
          </p>
        </div>

        {/* Auth Mode Switcher */}
        <div className="flex bg-stone-950 p-1 rounded-2xl border border-stone-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl font-medium transition ${
              authMode === 'login'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Se Connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl font-medium transition ${
              authMode === 'register'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Créer mon Salon (Inscription)
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Adresse Email professionnelle :</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="coiffeur@salon.ma"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Mot de passe :</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/10 transition flex items-center justify-center space-x-2"
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
              className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 font-medium text-xs transition flex items-center justify-center space-x-2"
            >
              <span>Continuer avec Google</span>
            </button>

            {/* Quick Demo Test Access */}
            <div className="pt-4 border-t border-stone-800/80 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block text-center">
                Accès Démo Immédiat (1 clic) :
              </span>
              <div className="grid grid-cols-2 gap-2">
                {stylists.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(s.id)}
                    className="p-2 rounded-xl bg-stone-950 hover:bg-amber-500/10 border border-stone-800 hover:border-amber-500/40 text-left transition"
                  >
                    <span className="font-semibold text-stone-200 block truncate text-[11px]">
                      {s.stylistName}
                    </span>
                    <span className="text-[10px] text-stone-400 truncate block">
                      📍 {s.city}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Votre nom et prénom : *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fatima Zahra"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Nom de votre Salon / Atelier : *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: L'Atelier Bohème"
                  value={regSalonName}
                  onChange={(e) => setRegSalonName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Ville au Maroc : *</label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
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

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Téléphone WhatsApp : *</label>
                <input
                  type="tel"
                  required
                  placeholder="+212 6 12 34 56 78"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Adresse du salon (Quartier, Rue) :</label>
              <input
                type="text"
                placeholder="Ex: Quartier Racine, Boulevard Massira, Casablanca"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Email professionnel : *</label>
                <input
                  type="email"
                  required
                  placeholder="fatima@atelier.ma"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Mot de passe : *</label>
                <input
                  type="password"
                  required
                  placeholder="Au moins 6 caractères"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center space-x-2">
              <input
                type="checkbox"
                id="homeServiceCheckbox"
                checked={regHomeService}
                onChange={(e) => setRegHomeService(e.target.checked)}
                className="rounded border-stone-800 text-amber-500"
              />
              <label htmlFor="homeServiceCheckbox" className="text-stone-300 cursor-pointer">
                Je propose également des prestations à Domicile (+120 MAD par déplacement)
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/10 transition flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Création en cours...' : 'Créer mon Salon & Accéder au Dashboard'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
