import { useState } from 'react';
import { motion } from 'motion/react';
import { HistoryEntry } from '../types';
import { Save, Droplet, Weight, Clock, CheckCircle2, Circle } from 'lucide-react';

interface DailyTrackerProps {
  onSave: (entry: HistoryEntry) => void;
  currentWeight: number;
}

export default function DailyTracker({ onSave, currentWeight }: DailyTrackerProps) {
  const [entry, setEntry] = useState<HistoryEntry>({
    date: new Date().toISOString().split('T')[0],
    weight: currentWeight,
    workoutCompleted: false,
    cardioMinutes: 0,
    waterIntake: 0,
    caloriesConsumed: 0
  });

  const handleSave = () => {
    onSave(entry);
    // Visual feedback or reset could go here
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 glow-card backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display uppercase tracking-tight">Registro Diário</h2>
        <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase">{entry.date}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Peso Atual (kg)</label>
          <div className="relative">
            <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            <input 
              type="number" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary transition-colors focus:outline-none"
              value={entry.weight}
              onChange={(e) => setEntry({ ...entry, weight: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Água (Litros)</label>
          <div className="relative">
            <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            <input 
              type="number" 
              step="0.5"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary transition-colors focus:outline-none"
              value={entry.waterIntake}
              onChange={(e) => setEntry({ ...entry, waterIntake: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Calorias Consumidas</label>
          <input 
            type="number" 
            placeholder="2500"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary transition-colors focus:outline-none"
            value={entry.caloriesConsumed}
            onChange={(e) => setEntry({ ...entry, caloriesConsumed: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest">Cardio (Minutos)</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            <input 
              type="number" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary transition-colors focus:outline-none"
              value={entry.cardioMinutes}
              onChange={(e) => setEntry({ ...entry, cardioMinutes: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setEntry({ ...entry, workoutCompleted: !entry.workoutCompleted })}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${
            entry.workoutCompleted 
              ? 'bg-primary/20 border-primary text-primary' 
              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
          }`}
        >
          {entry.workoutCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          <span className="font-bold uppercase text-xs tracking-widest">Treino Concluído</span>
        </button>

        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          <Save size={20} />
          <span>Salvar</span>
        </button>
      </div>
    </div>
  );
}
