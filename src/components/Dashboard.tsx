import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Download, RefreshCcw, ArrowLeft, Trophy, Flame, Target, BarChart3, CalendarDays, BookOpen, Droplet, User, AlertCircle, TrendingDown, TrendingUp, Calculator, Scale, Zap, Activity } from "lucide-react";
import { DetailedPlan, HistoryEntry, UserData } from "../types";
import EvolutionCharts from "./EvolutionCharts";
import DailyTracker from "./DailyTracker";
import WeeklyCheckin from "./WeeklyCheckin";
import FreeMealModal from "./FreeMealModal";

interface DashboardProps {
  plan: DetailedPlan;
  userData: UserData;
  history: HistoryEntry[];
  onSaveHistory: (entry: HistoryEntry) => void;
  onReset: () => void;
}

export default function Dashboard({ plan, userData, history, onSaveHistory, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'evolution' | 'daily' | 'profile' | 'checkin' | 'metrics'>('plan');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showFreeMealModal, setShowFreeMealModal] = useState(false);

  const lastAdjustment = plan.adjustments && plan.adjustments.length > 0 
    ? plan.adjustments[plan.adjustments.length - 1] 
    : null;

  const tabs = [
    { id: 'plan', label: 'Meu Plano', icon: BookOpen },
    { id: 'daily', label: 'Diário', icon: CalendarDays },
    { id: 'evolution', label: 'Evolução', icon: BarChart3 },
    { id: 'metrics', label: 'Métricas', icon: Calculator },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const handleWeeklyCheckin = async (entry: HistoryEntry) => {
    setActiveTab('plan');
    onSaveHistory(entry);
  };

  const handleFreeMealSave = (intensity: 'Leve' | 'Média' | 'Pesada' | 'Exagerei') => {
    const entry: HistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: history.length > 0 ? history[history.length - 1].weight : userData.weight,
      workoutCompleted: false,
      cardioMinutes: 0,
      freeMeal: {
        intensity,
        date: new Date().toISOString()
      }
    };
    onSaveHistory(entry);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <AnimatePresence>
        {showFreeMealModal && (
          <FreeMealModal 
            onSave={handleFreeMealSave}
            onClose={() => setShowFreeMealModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* Optimization Banner for Weekly Check-in */}
      <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-accent" size={20} />
          <p className="text-xs font-bold uppercase tracking-tighter text-accent">Análise de progresso recomendada a cada 7 dias.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowFreeMealModal(true)}
            className="flex-1 md:flex-none px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            🍔 Refeição Livre
          </button>
          <button 
            onClick={() => setActiveTab('checkin')}
            className="flex-1 md:flex-none px-4 py-2 bg-accent text-black rounded-lg font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
          >
            Check-in Semanal
          </button>
        </div>
      </div>
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 glow-card backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center border border-primary/20">
              <User className="text-primary" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-display uppercase leading-none mb-1">{userData.name}</h1>
              <div className="flex gap-2 text-[10px] uppercase font-bold text-white/40 tracking-wider">
                <span>{userData.age} anos</span>
                <span>•</span>
                <span>{userData.weight}kg</span>
                <span>•</span>
                <span className="text-primary">{userData.goal.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setActiveTab('profile');
                setShowConfirmReset(true);
              }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 transition-all border border-white/10 hover:border-white/20"
              title="Recalcular"
            >
              <RefreshCcw size={18} />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all border border-white/5">
              <Download size={14} />
              PDF
            </button>
          </div>
        </div>

        {/* Quick Macro Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Calorias', value: plan.macros.calories, unit: 'kcal', color: 'text-primary' },
            { label: 'Proteína', value: plan.macros.protein, unit: 'g', color: 'text-white' },
            { label: 'Carbs', value: plan.macros.carbs, unit: 'g', color: 'text-white' },
            { label: 'Gordura', value: plan.macros.fats, unit: 'g', color: 'text-white' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-center min-w-[100px]">
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-tight mb-1">{stat.label}</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-display ${stat.color}`}>{stat.value}</span>
                <span className="text-[10px] text-white/20">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 w-full md:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-black'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'plan' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {lastAdjustment && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-start gap-4"
                  >
                    <TrendingDown className="text-primary mt-1" size={20} />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-1">Ajuste Inteligente Realizado</p>
                      <p className="text-xs text-white/70 italic">"{lastAdjustment.reason}"</p>
                      <p className="text-[10px] text-white/30 mt-2 font-bold uppercase tracking-widest italic">{lastAdjustment.date}</p>
                    </div>
                  </motion.div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl markdown-body text-white/70 leading-relaxed overflow-hidden glow-card">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h1 className="text-3xl font-display uppercase tracking-tight text-primary mt-10 mb-6 first:mt-0" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-xl font-display uppercase tracking-tight text-accent mt-10 mb-6 border-l-4 border-accent pl-4" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-lg font-bold uppercase tracking-tight text-white mt-8 mb-4" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-sm leading-relaxed" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-5 mb-6 space-y-3 text-sm" {...props} />,
                      li: ({ ...props }) => <li className="text-white/60" {...props} />,
                      strong: ({ ...props }) => <strong className="text-white font-bold" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-white/10 pl-4 italic text-white/40 my-6" {...props} />
                    }}
                  >
                    {plan.markdown}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Droplet className="text-primary" size={20} />
                    <h3 className="font-display uppercase text-sm tracking-tight text-primary">Metas Hídricas</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="text-4xl font-display">{plan.macros.water}L</div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Consumo sugerido por dia</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex-1 h-2 bg-primary/20 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Flame className="text-accent" size={20} />
                    <h3 className="font-display uppercase text-sm tracking-tight text-accent">Protocolo Cardio</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-white/40">Frequência</span>
                      <span className="text-xs font-bold uppercase">Diário</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-white/40">Intensidade</span>
                      <span className="text-xs font-bold uppercase">Moderada</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                   <div className="flex items-center gap-3 mb-4">
                    <Target className="text-white" size={20} />
                    <h3 className="font-display uppercase text-sm tracking-tight">Dica de Hoje</h3>
                  </div>
                  <p className="text-xs text-white/40 italic leading-relaxed">
                    "O biotipo brasileiro responde muito bem a dietas ricas em arroz e feijão. Não corte o arroz, ajuste a porção."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="max-w-2xl mx-auto">
              <DailyTracker 
                currentWeight={userData.weight} 
                onSave={(entry) => {
                  onSaveHistory(entry);
                  setActiveTab('evolution');
                }} 
              />
            </div>
          )}

          {activeTab === 'evolution' && (
            <EvolutionCharts history={history} />
          )}

          {activeTab === 'checkin' && (
            <div className="max-w-2xl mx-auto">
              <WeeklyCheckin 
                lastWeight={history.length > 0 ? history[history.length - 1].weight : userData.weight} 
                onSave={handleWeeklyCheckin}
              />
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Painel Biométrico</span>
                <h2 className="text-3xl font-display uppercase tracking-tight">Cálculos de Performance</h2>
                <p className="text-white/30 text-xs mt-2">Dados calculados por IA com base na sua anamnese e progresso.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    name: 'IMC', 
                    value: plan.bodyMetrics?.imc || (userData.weight / Math.pow(userData.height/100, 2)).toFixed(1), 
                    unit: 'kg/m²', 
                    desc: 'Índice de Massa Corporal',
                    icon: Scale,
                    color: 'text-blue-400'
                  },
                  { 
                    name: 'BF (Gordura)', 
                    value: plan.bodyMetrics?.bf || '--', 
                    unit: '%', 
                    desc: 'Percentual de gordura estimado',
                    icon: Activity,
                    color: 'text-red-400'
                  },
                  { 
                    name: 'FFMI', 
                    value: plan.bodyMetrics?.ffmi || '--', 
                    unit: 'pts', 
                    desc: 'Índice de massa muscular magra',
                    icon: Trophy,
                    color: 'text-primary'
                  },
                  { 
                    name: 'TMB', 
                    value: plan.bodyMetrics?.tmb || '--', 
                    unit: 'kcal', 
                    desc: 'Taxa metabólica basal',
                    icon: Zap,
                    color: 'text-orange-400'
                  },
                  { 
                    name: 'Gasto Diário', 
                    value: plan.bodyMetrics?.dailyExpenditure || '--', 
                    unit: 'kcal', 
                    desc: 'Gasto calórico total estimado',
                    icon: Flame,
                    color: 'text-accent'
                  }
                ].map((metric, i) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all glow-card"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-white/5 ${metric.color}`}>
                          <metric.icon size={18} />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">{metric.name}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-display text-white">{metric.value}</span>
                        <span className="text-xs text-white/20 font-bold uppercase">{metric.unit}</span>
                      </div>
                      <p className="text-[10px] text-white/30 uppercase font-bold leading-tight">{metric.desc}</p>
                    </div>
                    <metric.icon size={80} className={`absolute -bottom-4 -right-4 opacity-[0.03] transition-transform group-hover:scale-110 ${metric.color}`} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-2full flex items-center justify-center shrink-0 border border-primary/20">
                    <AlertCircle className="text-primary" size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-display uppercase tracking-tight mb-2">Análise de IA sobre suas métricas</h4>
                    <p className="text-xs text-white/40 leading-relaxed italic">
                      "Com base no seu objetivo de {userData.goal}, seu foco deve ser em {userData.goal === 'emagrecer' ? 'manter a massa magra através do FFMI' : 'aumentar o TMB através de hipertrofia'}. Seu IMC de {(userData.weight / Math.pow(userData.height/100, 2)).toFixed(1)} indica que você está na fase ideal de {userData.goal}."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto grid grid-cols-1 gap-6">
               <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                  <h3 className="text-lg font-display uppercase tracking-tight mb-6 flex items-center gap-2">
                    <User className="text-primary" size={20} /> Dados do Usuário
                  </h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    {[
                      { label: 'Nome', value: userData.name },
                      { label: 'Objetivo', value: userData.goal },
                      { label: 'Nível', value: userData.experienceLevel },
                      { label: 'Treinos p/ Semana', value: `${userData.trainingDays} dias` },
                      { label: 'Peso Atual', value: `${userData.weight}kg` },
                      { label: 'Altura', value: `${userData.height}cm` },
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">{item.label}</p>
                        <p className="font-bold uppercase text-sm text-white/80">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                    <p className="text-xs text-white/40 text-center italic mb-4">
                      Seus dados são usados para calcular as métricas de treino e dieta via IA.
                    </p>
                    {showConfirmReset ? (
                      <div className="space-y-3">
                        <p className="text-xs text-red-500 font-bold uppercase text-center tracking-tighter">Tem certeza? Isso apagará seu plano atual.</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={onReset}
                            className="flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-2xl font-bold uppercase text-xs tracking-widest transition-all"
                          >
                            Sim, Reiniciar
                          </button>
                          <button 
                            onClick={() => setShowConfirmReset(false)}
                            className="flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowConfirmReset(true)}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all"
                      >
                        <RefreshCcw size={18} />
                        Refazer Toda a Anamnese
                      </button>
                    )}
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => {
            setActiveTab('profile');
            setShowConfirmReset(true);
          }}
          className="flex items-center gap-2 text-white/20 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest group"
        >
          <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          Reiniciar Todo o Perfil
        </button>
      </div>
    </motion.div>
  );
}
