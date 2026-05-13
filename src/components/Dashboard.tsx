import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Download, RefreshCcw, ArrowLeft, Trophy, Flame, Target, BarChart3, CalendarDays, BookOpen, Droplet, User } from "lucide-react";
import { DetailedPlan, HistoryEntry, UserData } from "../types";
import EvolutionCharts from "./EvolutionCharts";
import DailyTracker from "./DailyTracker";

interface DashboardProps {
  plan: DetailedPlan;
  userData: UserData;
  history: HistoryEntry[];
  onSaveHistory: (entry: HistoryEntry) => void;
  onReset: () => void;
}

export default function Dashboard({ plan, userData, history, onSaveHistory, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'evolution' | 'daily' | 'profile'>('plan');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const tabs = [
    { id: 'plan', label: 'Meu Plano', icon: BookOpen },
    { id: 'daily', label: 'Diário', icon: CalendarDays },
    { id: 'evolution', label: 'Evolução', icon: BarChart3 },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto space-y-6"
    >
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
              <div className="lg:col-span-2">
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
