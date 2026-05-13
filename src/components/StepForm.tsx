import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserData, Goal, ActivityLevel, ExperienceLevel } from "../types";
import { ChevronRight, ChevronLeft, Target, Gauge, Heart, Utensils, Award, AlertCircle, Timer, Zap } from "lucide-react";

interface StepFormProps {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

export default function StepForm({ onSubmit, isLoading }: StepFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserData>>({
    gender: 'masculino',
    goal: 'emagrecer',
    activityLevel: 'sentado',
    trainingDays: 3,
    experienceLevel: 'iniciante',
    healthConditions: [],
    preferredProteins: [],
    preferredCarbs: [],
    mainDifficulty: '',
    cardioPreference: '',
    supplements: [],
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleArrayItem = (field: keyof UserData, item: string) => {
    const current = (formData[field] as string[]) || [];
    if (current.includes(item)) {
      setFormData({ ...formData, [field]: current.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...current, item] });
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!formData.goal;
    if (step === 2) return formData.name && formData.age && formData.weight && formData.height;
    if (step === 3) return !!formData.activityLevel && !!formData.trainingDays;
    if (step === 4) return !!formData.experienceLevel;
    if (step === 6) return (formData.preferredProteins?.length || 0) > 0 || (formData.preferredCarbs?.length || 0) > 0;
    if (step === 7) return !!formData.mainDifficulty;
    if (step === 8) return !!formData.cardioPreference;
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 01</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Qual seu principal objetivo?</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'emagrecer', label: 'Emagrecer', desc: 'Queima de gordura e perda de peso' },
                { id: 'ganhar_massa', label: 'Ganhar massa muscular', desc: 'Hipertrofia e construção de força' },
                { id: 'definir', label: 'Definir o corpo', desc: 'Tonificação e estética avançada' },
                { id: 'condicionamento', label: 'Melhorar condicionamento', desc: 'Resistência e fôlego' },
                { id: 'saude', label: 'Saúde e disposição', desc: 'Equilíbrio e longevidade' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, goal: opt.id as Goal })}
                  className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${
                    formData.goal === opt.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 text-white hover:border-white/30'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold uppercase tracking-tighter text-sm">{opt.label}</p>
                    <p className="text-[10px] opacity-40 mt-1">{opt.desc}</p>
                  </div>
                  <Target size={20} className={formData.goal === opt.id ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'} />
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 02</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Dados Físicos</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Seu Nome</label>
                <input
                  type="text"
                  placeholder="Como devemos te chamar?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors font-bold"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Gênero</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors appearance-none font-bold"
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Idade</label>
                  <input
                    type="number"
                    placeholder="Ex: 25"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors font-bold"
                    value={formData.age || ''}
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    placeholder="Ex: 80"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors font-bold"
                    value={formData.weight || ''}
                    onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    placeholder="Ex: 180"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors font-bold"
                    value={formData.height || ''}
                    onChange={e => setFormData({ ...formData, height: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 03</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Sua Rotina</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-center text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">Como é seu dia a dia?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'sentado', label: 'Sentado', desc: 'Escritório / Home Office' },
                    { id: 'em_pe', label: 'Em pé', desc: 'Vendas / Ensino' },
                    { id: 'peso', label: 'Com Peso', desc: 'Obra / Logística' },
                    { id: 'muito_ativo', label: 'Muito ativo', desc: 'Esportes / Braçal' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, activityLevel: opt.id as ActivityLevel })}
                      className={`p-4 rounded-xl border transition-all text-center ${
                        formData.activityLevel === opt.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 bg-white/5 text-white hover:border-white/30'
                      }`}
                    >
                      <p className="font-bold uppercase tracking-tighter text-xs">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-center text-white/40 text-[10px] uppercase font-bold tracking-widest mb-4">Dias disponíveis para treinar</label>
                <div className="flex justify-between gap-2">
                  {[3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFormData({ ...formData, trainingDays: num })}
                      className={`flex-1 aspect-square flex flex-col items-center justify-center rounded-xl border transition-all ${
                        formData.trainingDays === num
                          ? 'border-primary bg-primary text-black'
                          : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg font-display leading-none">{num}</span>
                      <span className="text-[8px] uppercase font-bold opacity-60">Dias</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 04</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Qual seu nível?</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'iniciante', label: 'Iniciante', desc: 'Nunca treinou ou está voltando agora' },
                { id: 'intermediario', label: 'Intermediário', desc: 'Treina há pelo menos 1 ano consciente' },
                { id: 'avancado', label: 'Avançado', desc: 'Anos de experiência e técnica sólida' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, experienceLevel: opt.id as ExperienceLevel })}
                  className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                    formData.experienceLevel === opt.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 text-white hover:border-white/30'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold uppercase tracking-tighter text-sm">{opt.label}</p>
                    <p className="text-[10px] opacity-40 mt-1">{opt.desc}</p>
                  </div>
                  <Award size={24} className={formData.experienceLevel === opt.id ? 'opacity-100' : 'opacity-20'} />
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 05</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Saúde e Histórico</h2>
              <p className="text-[10px] text-white/40 uppercase font-bold mt-2">Selecione se possuir algum destes:</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Pressão alta', 'Diabetes', 'Lesões', 'Cirurgias', 'Ansiedade', 'Insônia'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => toggleArrayItem('healthConditions', cond)}
                  className={`p-4 rounded-xl border transition-all text-center ${
                    formData.healthConditions?.includes(cond)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{cond}</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2 px-1">Detalhes Adicionais de Saúde</label>
              <textarea
                placeholder="Ex: Tenho hernia de disco na L5, tomo remédio para pressão..."
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none text-sm"
                value={formData.dietaryRestrictions || ''}
                onChange={e => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
              />
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 06</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Alimentação</h2>
              <p className="text-[10px] text-white/40 uppercase font-bold mt-2">Escolha o que você costuma comer:</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest mb-3 px-1">
                  <Heart size={12} className="text-primary" /> Proteínas
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Ovo', 'Frango', 'Carne moída', 'Carne vermelha', 'Whey', 'Outros'].map((p) => (
                    <button
                      key={p}
                      onClick={() => toggleArrayItem('preferredProteins', p)}
                      className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase transition-all ${
                        formData.preferredProteins?.includes(p)
                          ? 'bg-primary border-primary text-black'
                          : 'border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest mb-3 px-1">
                  <Utensils size={12} className="text-accent" /> Carboidratos
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Arroz', 'Feijão', 'Pão francês', 'Rap10', 'Batata', 'Outros'].map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleArrayItem('preferredCarbs', c)}
                      className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase transition-all ${
                        formData.preferredCarbs?.includes(c)
                          ? 'bg-accent border-accent text-black'
                          : 'border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2 px-1">O que você NÃO come de jeito nenhum?</label>
                <input
                  type="text"
                  placeholder="Ex: Coentro, Berinjela, Brócolis..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-primary transition-colors text-sm"
                  value={formData.preferences || ''}
                  onChange={e => setFormData({ ...formData, preferences: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        );
      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 07</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Qual sua maior dificuldade?</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Fome', 'Ansiedade', 'Final de semana', 'Álcool', 'Falta de tempo', 'Outros'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFormData({ ...formData, mainDifficulty: diff })}
                  className={`p-5 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                    formData.mainDifficulty === diff
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-tighter block relative z-10">{diff}</span>
                  <AlertCircle size={40} className={`absolute -bottom-2 -right-2 opacity-10 transition-transform group-hover:scale-110 ${formData.mainDifficulty === diff ? 'text-primary opacity-20' : ''}`} />
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 8:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 08</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Você gosta de cardio?</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'gosto', label: 'Eu Amo', desc: 'Faço sorrindo, me sinto muito bem' },
                { id: 'normal', label: 'Faço o necessário', desc: 'Não amo, mas cumpro o protocolo' },
                { id: 'odeio', label: 'Odeio com todas as forças', desc: 'Prefiro mil vezes puxar ferro' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, cardioPreference: opt.id })}
                  className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                    formData.cardioPreference === opt.id
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-white/10 bg-white/5 text-white hover:border-white/30'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold uppercase tracking-tighter text-sm">{opt.label}</p>
                    <p className="text-[10px] opacity-40 mt-1">{opt.desc}</p>
                  </div>
                  <Timer size={24} className={formData.cardioPreference === opt.id ? 'opacity-100' : 'opacity-20'} />
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 9:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Etapa 09</span>
              <h2 className="text-3xl font-display uppercase tracking-tight">Você usa suplementos?</h2>
              <p className="text-[10px] text-white/40 uppercase font-bold mt-2">Marque todos que utiliza atualmente</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Nenhum', 'Whey Protein', 'Creatina', 'Pré-Treino', 'Multivitamínico', 'Ômega 3', 'Outros'].map((supp) => (
                <button
                  key={supp}
                  onClick={() => toggleArrayItem('supplements', supp)}
                  className={`p-5 rounded-2xl border transition-all text-center relative overflow-hidden group ${
                    formData.supplements?.includes(supp)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-tighter block relative z-10">{supp}</span>
                  <Zap size={40} className={`absolute -bottom-2 -right-2 opacity-5 transition-all group-hover:scale-110 ${formData.supplements?.includes(supp) ? 'text-primary opacity-20' : ''}`} />
                </button>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] glow-card backdrop-blur-3xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-primary shadow-[0_0_10px_#D4FF00]"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 9) * 100}%` }}
          />
        </div>

        <div className="min-h-[460px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-12">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-white/30 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest"
            >
              <ChevronLeft size={16} />
              Voltar
            </button>
          ) : <div />}

          {step < 9 ? (
            <button
              disabled={!isStepValid()}
              onClick={nextStep}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all ${
                isStepValid() 
                  ? 'bg-primary text-black hover:scale-105 active:scale-95 shadow-[0_10px_20px_-10px_rgba(212,255,0,0.5)]' 
                  : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>Próximo Passo</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              disabled={isLoading || !isStepValid()}
              onClick={() => onSubmit(formData as UserData)}
              className="flex items-center gap-3 px-10 py-5 bg-accent text-black rounded-2xl font-black uppercase text-xs tracking-[0.1em] transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_-10px_rgba(255,184,0,0.5)] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Forjando Estratégia...</span>
                </div>
              ) : (
                <>
                  <span>Finalizar Meu Perfil</span>
                  <Gauge size={20} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      <p className="text-center mt-8 text-white/20 text-[10px] uppercase font-bold tracking-[0.25em]">
        Inteligência Artificial de Biotipo Brasileiro
      </p>
    </div>
  );
}
