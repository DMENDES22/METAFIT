import { useState } from 'react';
import { motion } from 'motion/react';
import { HistoryEntry } from '../types';
import { Scale, Zap, Utensils, Heart, Activity, CheckCircle2 } from 'lucide-react';

interface WeeklyCheckinProps {
  onSave: (entry: HistoryEntry) => void;
  lastWeight: number;
}

export default function WeeklyCheckin({ onSave, lastWeight }: WeeklyCheckinProps) {
  const [entry, setEntry] = useState<Partial<HistoryEntry>>({
    date: new Date().toISOString().split('T')[0],
    weight: lastWeight,
    waist: 0,
    energyLevel: 3,
    hungerLevel: 3,
    adherenceLevel: 4,
    cardioMinutes: 0,
    workoutCompleted: true,
    isWeeklyCheckin: true
  });

  const levels = [
    { value: 1, label: 'Péssimo' },
    { value: 2, label: 'Baixo' },
    { value: 3, label: 'Normal' },
    { value: 4, label: 'Bom' },
    { value: 5, label: 'Excelente' },
  ];

  const handleSave = () => {
    onSave(entry as HistoryEntry);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10 glow-card backdrop-blur-3xl">
      <div className="text-center">
        <span className="text-accent text-[10px] uppercase font-bold tracking-[0.2em] mb-2 block">Check-in Estratégico</span>
        <h2 className="text-3xl font-display uppercase tracking-tight">Análise Semanal</h2>
        <p className="text-white/30 text-xs mt-2">A IA ajustará suas calorias com base nestes dados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest px-1">
            <Scale size={14} className="text-primary" /> Peso Atual (kg)
          </label>
          <input 
            type="number" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary transition-colors focus:outline-none font-display text-xl"
            value={entry.weight}
            onChange={(e) => setEntry({ ...entry, weight: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest px-1">
            <Activity size={14} className="text-accent" /> Cintura (cm)
          </label>
          <input 
            type="number" 
            placeholder="Ex: 85"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary transition-colors focus:outline-none font-display text-xl"
            value={entry.waist || ''}
            onChange={(e) => setEntry({ ...entry, waist: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-8">
        {[
          { key: 'energyLevel', label: 'Nível de Energia', icon: Zap, color: 'text-yellow-400' },
          { key: 'hungerLevel', label: 'Nível de Fome', icon: Utensils, color: 'text-orange-400' },
          { key: 'adherenceLevel', label: 'Adesão à Dieta', icon: Heart, color: 'text-red-400' },
        ].map((field) => (
          <div key={field.key} className="space-y-4">
            <label className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-bold tracking-widest px-1">
              <field.icon size={14} className={field.color} /> {field.label}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {levels.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setEntry({ ...entry, [field.key]: l.value })}
                  className={`py-3 rounded-xl border text-[8px] uppercase font-bold transition-all ${
                    entry[field.key as keyof HistoryEntry] === l.value
                      ? 'bg-white/10 border-white/40 text-white'
                      : 'bg-white/5 border-white/5 text-white/20 hover:border-white/20'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        className="w-full py-5 bg-primary text-black rounded-2xl font-black uppercase text-sm tracking-[0.1em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_-10px_rgba(212,255,0,0.4)] flex items-center justify-center gap-3"
      >
        <span>Atualizar Minha Estratégia</span>
        <CheckCircle2 size={20} />
      </button>
    </div>
  );
}
