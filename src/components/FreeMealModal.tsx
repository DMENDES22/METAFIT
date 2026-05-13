import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pizza, X, Droplet, ArrowRight, CheckCircle2, Flame } from 'lucide-react';

interface FreeMealModalProps {
  onSave: (intensity: 'Leve' | 'Média' | 'Pesada' | 'Exagerei') => void;
  onClose: () => void;
}

export default function FreeMealModal({ onSave, onClose }: FreeMealModalProps) {
  const [step, setStep] = useState<'quest' | 'advice'>('quest');
  const [intensity, setIntensity] = useState<'Leve' | 'Média' | 'Pesada' | 'Exagerei' | null>(null);

  const advices = {
    Leve: [
      "Beba 500ml de água extra agora.",
      "Mantenha o plano normal na próxima refeição.",
      "Consistência vence perfeição."
    ],
    Média: [
      "Beba 1L de água extra ao longo do dia.",
      "Reduza pela metade o carboidrato da próxima refeição.",
      "Não se culpe, aproveite o processo."
    ],
    Pesada: [
      "Beba 1.5L de água extra.",
      "Faça 20-30 min de cardio leve (caminhada).",
      "Sua próxima refeição deve ser focada em proteínas e vegetais."
    ],
    Exagerei: [
      "Não tente compensar cortando refeições.",
      "Beba muita água e faça uma caminhada de 40 min.",
      "O plano recomeça na próxima refeição. Uma refeição não estraga meses de trabalho."
    ]
  };

  const handleSelect = (val: 'Leve' | 'Média' | 'Pesada' | 'Exagerei') => {
    setIntensity(val);
    setStep('advice');
    onSave(val);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-[2.5rem] w-full max-w-md overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 'quest' ? (
              <motion.div
                key="quest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <Pizza className="text-primary" size={32} />
                  </div>
                  <h3 className="text-2xl font-display uppercase tracking-tight">Refeição Livre</h3>
                  <p className="text-white/40 text-xs mt-2 uppercase font-bold tracking-widest text-[10px]">Como foi sua refeição?</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(['Leve', 'Média', 'Pesada', 'Exagerei'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all font-bold uppercase text-xs tracking-widest text-left flex items-center justify-between group"
                    >
                      <span>{opt}</span>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="advice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/20">
                    <CheckCircle2 className="text-accent" size={32} />
                  </div>
                  <h3 className="text-2xl font-display uppercase tracking-tight">Protocolo Ativado</h3>
                  <p className="text-white/40 text-xs mt-2 uppercase font-bold tracking-widest text-[10px]">Siga estas instruções para neutralizar o impacto</p>
                </div>

                <div className="space-y-4">
                  {intensity && advices[intensity].map((advice, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      {i === 0 && <Droplet size={18} className="text-blue-400 shrink-0" />}
                      {i === 1 && <Flame size={18} className="text-orange-400 shrink-0" />}
                      {i === 2 && <ArrowRight size={18} className="text-primary shrink-0" />}
                      <p className="text-xs text-white/80 leading-relaxed font-bold uppercase tracking-tighter">{advice}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-sm tracking-[0.1em] transition-all hover:bg-white/90"
                >
                  Entendi, voltando ao foco
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
