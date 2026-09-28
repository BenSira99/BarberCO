import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Service, ServiceCategory } from '../../types';
import { 
  Scissors, 
  Plus, 
  Trash2, 
  Edit3, 
  Store, 
  Home, 
  Clock, 
  Check, 
  Sparkles,
  Tag
} from 'lucide-react';

export const ServicesCatalogTab: React.FC = () => {
  const { services, addService, updateService, deleteService, currentStylist } = useSalon();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Filter services for current stylist
  const stylistServices = services.filter(s => !s.stylistId || s.stylistId === currentStylist.id);

  // New service form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('coupe');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(350);
  const [description, setDescription] = useState('');
  const [salonAvailable, setSalonAvailable] = useState(true);
  const [homeAvailable, setHomeAvailable] = useState(true);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingServiceId) {
      updateService(editingServiceId, {
        name,
        category,
        durationMinutes,
        price,
        description,
        salonAvailable,
        homeAvailable,
      });
      setEditingServiceId(null);
    } else {
      addService({
        stylistId: currentStylist.id,
        name,
        category,
        durationMinutes,
        price,
        description,
        salonAvailable,
        homeAvailable,
        popular: false,
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEdit = (s: Service) => {
    setEditingServiceId(s.id);
    setName(s.name);
    setCategory(s.category);
    setDurationMinutes(s.durationMinutes);
    setPrice(s.price);
    setDescription(s.description);
    setSalonAvailable(s.salonAvailable);
    setHomeAvailable(s.homeAvailable);
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setName('');
    setCategory('coupe');
    setDurationMinutes(60);
    setPrice(350);
    setDescription('');
    setSalonAvailable(true);
    setHomeAvailable(true);
    setEditingServiceId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-stone-100 font-editorial tracking-wide">
              Catalogue des Prestations & Tarifs (MAD)
            </h2>
            <p className="text-xs text-stone-400">
              Définissez les coiffures proposées aux clients de {currentStylist.salonName}, les durées et tarifs en dirhams
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une prestation</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stylistServices.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/30 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700">
                  {srv.category}
                </span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {srv.price} MAD
                </span>
              </div>

              <h3 className="font-semibold text-stone-100 text-sm font-editorial text-base leading-snug">
                {srv.name}
              </h3>

              <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">
                {srv.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-stone-800/80 text-xs">
              <div className="flex items-center justify-between text-stone-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{srv.durationMinutes} minutes</span>
                </span>

                <div className="flex items-center space-x-1.5">
                  {srv.salonAvailable && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20" title="Disponible au salon">
                      Salon
                    </span>
                  )}
                  {srv.homeAvailable && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" title="Disponible à domicile">
                      Domicile
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  onClick={() => handleEdit(srv)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                  title="Modifier"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer la prestation "${srv.name}" ?`)) {
                      deleteService(srv.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-900/40 text-stone-400 hover:text-rose-300 transition"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Service */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-semibold text-stone-100 font-editorial">
                {editingServiceId ? 'Modifier la prestation' : 'Créer une nouvelle prestation'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Intitulé de la coiffure / prestation :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Soin Kératine & Huile d'Argan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Catégorie :</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="coupe">Coupe</option>
                    <option value="coloration">Coloration / Balayage</option>
                    <option value="soin">Soin</option>
                    <option value="coiffage">Coiffage & Brushing</option>
                    <option value="tresses">Tresses & Extensions</option>
                    <option value="barbe">Barbe</option>
                    <option value="evenement">Événement & Mariée</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Prix (MAD) :</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Durée (min) :</label>
                  <input
                    type="number"
                    required
                    step={15}
                    min={15}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Description détaillée :</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez les étapes, les produits utilisés et le résultat..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-stone-300 font-medium block">Disponibilité du service :</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={salonAvailable}
                      onChange={(e) => setSalonAvailable(e.target.checked)}
                      className="rounded border-stone-800 text-amber-500 focus:ring-0"
                    />
                    <span className="text-stone-300">Au Salon</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homeAvailable}
                      onChange={(e) => setHomeAvailable(e.target.checked)}
                      className="rounded border-stone-800 text-amber-500 focus:ring-0"
                    />
                    <span className="text-stone-300">À Domicile</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold rounded-xl shadow-md transition"
                >
                  {editingServiceId ? 'Enregistrer les modifications' : 'Créer la prestation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
