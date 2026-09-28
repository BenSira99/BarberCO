import React, { useState, useMemo } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  TrendingUp, 
  Store, 
  Home, 
  Calendar, 
  Scissors, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Award,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  BarChart
} from 'recharts';

export const RevenueTab: React.FC = () => {
  const { appointments, services, currentStylist } = useSalon();

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedMonth, setSelectedMonth] = useState<'septembre' | 'aout' | 'juillet'>('septembre');
  const [exportNotice, setExportNotice] = useState(false);

  // Compute stylist appointments
  const stylistAppointments = useMemo(() => {
    return appointments.filter(
      a => (!a.stylistId || a.stylistId === currentStylist.id) && a.status !== 'cancelled'
    );
  }, [appointments, currentStylist.id]);

  // Current month dynamic calculations
  const totalRealAppointments = stylistAppointments.length;
  const currentTotalRevenue = stylistAppointments.reduce((sum, a) => sum + a.price, 0);
  
  // Simulated monthly baselines tailored to current stylist (Moroccan MAD salon baseline)
  const monthlyMultipliers = {
    septembre: { caBase: 25400, rdvBase: 44, growth: '+14.8%', target: 32000 },
    aout: { caBase: 22100, rdvBase: 38, growth: '+8.2%', target: 30000 },
    juillet: { caBase: 28900, rdvBase: 49, growth: '+19.5%', target: 32000 }
  };

  const selectedStats = monthlyMultipliers[selectedMonth];
  const finalMonthRevenue = currentTotalRevenue + selectedStats.caBase;
  const finalMonthBookings = totalRealAppointments + selectedStats.rdvBase;
  const averageBasket = Math.round(finalMonthRevenue / Math.max(1, finalMonthBookings));
  const goalProgress = Math.min(100, Math.round((finalMonthRevenue / selectedStats.target) * 100));

  // Salon vs Domicile split
  const salonRevenue = Math.round(finalMonthRevenue * 0.68);
  const homeRevenue = finalMonthRevenue - salonRevenue;
  const salonCount = Math.round(finalMonthBookings * 0.70);
  const homeCount = finalMonthBookings - salonCount;

  // Chart 1 data: Weekly Breakdown (for chosen month)
  const weeklyChartData = useMemo(() => {
    return [
      {
        name: 'Semaine 1 (1-7)',
        ca: Math.round(finalMonthRevenue * 0.22),
        rdv: Math.round(finalMonthBookings * 0.22),
        salon: Math.round(finalMonthRevenue * 0.22 * 0.7),
        domicile: Math.round(finalMonthRevenue * 0.22 * 0.3)
      },
      {
        name: 'Semaine 2 (8-14)',
        ca: Math.round(finalMonthRevenue * 0.26),
        rdv: Math.round(finalMonthBookings * 0.25),
        salon: Math.round(finalMonthRevenue * 0.26 * 0.68),
        domicile: Math.round(finalMonthRevenue * 0.26 * 0.32)
      },
      {
        name: 'Semaine 3 (15-21)',
        ca: Math.round(finalMonthRevenue * 0.24),
        rdv: Math.round(finalMonthBookings * 0.24),
        salon: Math.round(finalMonthRevenue * 0.24 * 0.69),
        domicile: Math.round(finalMonthRevenue * 0.24 * 0.31)
      },
      {
        name: 'Semaine 4 (22-30)',
        ca: Math.round(finalMonthRevenue * 0.28),
        rdv: Math.round(finalMonthBookings * 0.29),
        salon: Math.round(finalMonthRevenue * 0.28 * 0.65),
        domicile: Math.round(finalMonthRevenue * 0.28 * 0.35)
      }
    ];
  }, [finalMonthRevenue, finalMonthBookings]);

  // Chart 1 data: Monthly Trends across 6 months (Yearly view)
  const monthlyTrendsData = [
    { name: 'Avr', ca: 19800, rdv: 34, objectif: 25000 },
    { name: 'Mai', ca: 21500, rdv: 37, objectif: 26000 },
    { name: 'Juin', ca: 24200, rdv: 41, objectif: 28000 },
    { name: 'Juil', ca: 28900, rdv: 49, objectif: 30000 },
    { name: 'Août', ca: 22100, rdv: 38, objectif: 30000 },
    { name: 'Sept', ca: finalMonthRevenue, rdv: finalMonthBookings, objectif: selectedStats.target },
    { name: 'Oct (Prév.)', ca: 31000, rdv: 52, objectif: 32000 },
  ];

  // Chart 2 data: Distribution Donut (Salon vs Domicile)
  const distributionData = [
    { name: 'Au Salon', value: salonRevenue, color: '#f59e0b', count: salonCount },
    { name: 'À Domicile', value: homeRevenue, color: '#10b981', count: homeCount }
  ];

  // Chart 3 data: Service performance
  const topServicesData = useMemo(() => {
    return [
      { name: 'Balayage Signature', ca: 9200, rdv: 14 },
      { name: 'Lissage & Botox', ca: 7600, rdv: 11 },
      { name: 'Coupe Couture & Styling', ca: 5400, rdv: 18 },
      { name: 'Soin Renaissance', ca: 4100, rdv: 15 },
      { name: 'Coiffure Mariée & Gala', ca: 3800, rdv: 5 }
    ];
  }, []);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

  // Custom Recharts Tooltip for Dark / Luxury styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-950/95 border border-amber-500/30 p-3 rounded-xl shadow-2xl text-xs space-y-1 backdrop-blur-md">
          <p className="font-semibold text-stone-200 border-b border-stone-800 pb-1 font-editorial">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-3">
              <span className="flex items-center space-x-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name} :</span>
              </span>
              <span className="font-mono font-bold text-stone-100">
                {entry.name.includes('CA') || entry.name.includes('Chiffre') || entry.name.includes('Revenu')
                  ? `${entry.value.toLocaleString()} MAD`
                  : `${entry.value} RDV`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Timeframe controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-3xl border border-stone-800 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-stone-100 font-editorial tracking-wide">
                Tableau de Bord Financier & Statistiques
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 font-mono font-bold border border-amber-500/30">
                100% MAD
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Analyse en temps réel de votre chiffre d'affaires à {currentStylist.city}, nombre de rendez-vous et panier moyen
            </p>
          </div>
        </div>

        {/* View Switches */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Month selector */}
          <div className="flex items-center space-x-1 bg-stone-950 p-1 rounded-2xl border border-stone-800">
            <button
              onClick={() => setSelectedMonth('septembre')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedMonth === 'septembre'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Septembre 2026
            </button>
            <button
              onClick={() => setSelectedMonth('aout')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedMonth === 'aout'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Août 2026
            </button>
            <button
              onClick={() => setSelectedMonth('juillet')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedMonth === 'juillet'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Juillet 2026
            </button>
          </div>

          {/* Export Action */}
          <button
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Exporter (CSV / PDF)</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Le rapport comptable et financier en Dirhams marocains (MAD) pour {selectedMonth} 2026 a été généré avec succès !</span>
        </div>
      )}

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Chiffre d'Affaires Mensuel */}
        <div className="bg-stone-900/80 p-5 rounded-3xl border border-amber-500/30 relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-amber-400 text-[11px]">
              Chiffre d'Affaires Mensuel
            </span>
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold text-xs">
              MAD
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-stone-100 font-mono tracking-tight">
              {finalMonthRevenue.toLocaleString()} <span className="text-lg text-amber-400">MAD</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2 font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>{selectedStats.growth} vs mois précédent</span>
            </div>
          </div>
        </div>

        {/* 2. Total Rendez-vous */}
        <div className="bg-stone-900/80 p-5 rounded-3xl border border-stone-800 relative overflow-hidden shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-stone-300 text-[11px]">
              Rendez-vous Réalisés
            </span>
            <div className="p-1.5 rounded-xl bg-stone-800 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-stone-100 font-mono">
              {finalMonthBookings} <span className="text-base text-stone-400 font-normal">RDV</span>
            </div>
            <div className="text-xs text-stone-400 mt-2 flex items-center space-x-1">
              <span>{salonCount} au salon</span>
              <span>•</span>
              <span className="text-emerald-400">{homeCount} à domicile</span>
            </div>
          </div>
        </div>

        {/* 3. Panier Moyen */}
        <div className="bg-stone-900/80 p-5 rounded-3xl border border-stone-800 relative overflow-hidden shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-stone-300 text-[11px]">
              Panier Moyen par Client
            </span>
            <div className="p-1.5 rounded-xl bg-stone-800 text-stone-300">
              <Scissors className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-stone-100 font-mono">
              {averageBasket} <span className="text-base text-amber-400 font-medium">MAD</span>
            </div>
            <div className="text-xs text-stone-400 mt-2">
              Forfaits couleur, soins & coiffages
            </div>
          </div>
        </div>

        {/* 4. Prestations à Domicile */}
        <div className="bg-stone-900/80 p-5 rounded-3xl border border-stone-800 relative overflow-hidden shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="uppercase tracking-wider font-semibold text-emerald-400 text-[11px]">
              Recettes Domicile
            </span>
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400 font-mono">
              {homeRevenue.toLocaleString()} <span className="text-base font-normal">MAD</span>
            </div>
            <div className="text-xs text-stone-400 mt-2">
              +{currentStylist.homeExtraFee} MAD de déplacement / client
            </div>
          </div>
        </div>

      </div>

      {/* Monthly Target Progress Bar */}
      <div className="bg-stone-900/80 p-5 rounded-3xl border border-stone-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-stone-200">
              Objectif Mensuel Fixé : {selectedStats.target.toLocaleString()} MAD
            </span>
          </div>
          <span className="font-mono text-amber-400 font-bold text-sm">{goalProgress}% atteint</span>
        </div>

        <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden border border-stone-800">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 rounded-full transition-all duration-700"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>

      {/* MAIN GRAPHIC 1: Dual-Axis Recharts Evolution (Chiffre d'affaires & Nombre de Rendez-vous) */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-stone-100 font-editorial tracking-wide">
                Graphique Récapitulatif : Chiffre d'Affaires & Nombre de Rendez-vous
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Corrélation entre les revenus générés en MAD (Axe Gauche) et le volume de réservations (Axe Droit)
            </p>
          </div>

          {/* Toggle between Weekly breakdown and Monthly history */}
          <div className="flex items-center bg-stone-950 p-1 rounded-2xl border border-stone-800 text-xs">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                timeframe === 'weekly'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Par Semaine ({selectedMonth})
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                timeframe === 'monthly'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Historique 6 Mois
            </button>
          </div>
        </div>

        {/* Recharts Dual-Axis Chart */}
        <div className="h-[340px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {timeframe === 'weekly' ? (
              <ComposedChart data={weeklyChartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#78716c" 
                  fontSize={12} 
                  tickLine={false} 
                />
                <YAxis 
                  yAxisId="left" 
                  stroke="#f59e0b" 
                  fontSize={11} 
                  tickLine={false} 
                  unit=" MAD" 
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#10b981" 
                  fontSize={11} 
                  tickLine={false} 
                  unit=" RDV" 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(value) => <span className="text-xs text-stone-300 font-medium">{value}</span>}
                />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="ca" 
                  name="Chiffre d'Affaires (MAD)" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorCa)" 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="rdv" 
                  name="Nombre de Rendez-vous" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24} 
                />
              </ComposedChart>
            ) : (
              <ComposedChart data={monthlyTrendsData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorCaTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#78716c" 
                  fontSize={12} 
                  tickLine={false} 
                />
                <YAxis 
                  yAxisId="left" 
                  stroke="#f59e0b" 
                  fontSize={11} 
                  tickLine={false} 
                  unit=" MAD" 
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#10b981" 
                  fontSize={11} 
                  tickLine={false} 
                  unit=" RDV" 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(value) => <span className="text-xs text-stone-300 font-medium">{value}</span>}
                />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="ca" 
                  name="Chiffre d'Affaires (MAD)" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorCaTrend)" 
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="objectif" 
                  name="Objectif (MAD)" 
                  stroke="#d97706" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5} 
                  dot={false}
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="rdv" 
                  name="Nombre de Rendez-vous" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24} 
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAPHICS 2 & 3: Donut Distribution & Top Prestations BarChart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Donut Chart: Salon vs Domicile */}
        <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-800">
            <PieChartIcon className="w-4 h-4 text-amber-400" />
            <h4 className="text-base font-semibold text-stone-100 font-editorial">
              Répartition Salon vs Domicile
            </h4>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1c1917" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and details */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-stone-950 border border-amber-500/20 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                <Store className="w-3.5 h-3.5" />
                <span>Au Salon (68%)</span>
              </div>
              <p className="font-mono text-stone-100 font-bold text-sm">
                {salonRevenue.toLocaleString()} MAD
              </p>
              <span className="text-[10px] text-stone-500">{salonCount} rendez-vous</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-950 border border-emerald-500/20 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <Home className="w-3.5 h-3.5" />
                <span>À Domicile (32%)</span>
              </div>
              <p className="font-mono text-stone-100 font-bold text-sm">
                {homeRevenue.toLocaleString()} MAD
              </p>
              <span className="text-[10px] text-stone-500">{homeCount} rendez-vous</span>
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart: Top Prestations Rentables */}
        <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-800">
            <Scissors className="w-4 h-4 text-amber-400" />
            <h4 className="text-base font-semibold text-stone-100 font-editorial">
              Top Prestations par Chiffre d'Affaires Généré
            </h4>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topServicesData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" horizontal={false} />
                <XAxis type="number" stroke="#78716c" fontSize={11} unit=" MAD" />
                <YAxis dataKey="name" type="category" stroke="#a8a29e" fontSize={11} width={130} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="ca" name="Chiffre d'Affaires (MAD)" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={16}>
                  {topServicesData.map((_, index) => (
                    <Cell 
                      key={`bar-${index}`} 
                      fill={index === 0 ? '#f59e0b' : index === 1 ? '#d97706' : '#b45309'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Le rituel <strong className="text-stone-200">Balayage Signature</strong> reste le service le plus rentable.</span>
            </span>
            <span className="font-mono text-amber-400 font-semibold">14 prestations ce mois</span>
          </div>

        </div>

      </div>

    </div>
  );
};
