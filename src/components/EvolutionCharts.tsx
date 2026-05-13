import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HistoryEntry } from '../types';

interface EvolutionChartsProps {
  history: HistoryEntry[];
}

export default function EvolutionCharts({ history }: EvolutionChartsProps) {
  if (history.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <p className="text-white/40 text-sm italic">Nenhum dado de evolução disponível ainda.</p>
        <p className="text-xs text-white/20 mt-2 uppercase tracking-widest">Registre seu progresso no Diário</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-display uppercase tracking-wider mb-6 text-primary">Evolução do Peso</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4FF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
              <YAxis stroke="#ffffff40" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff20', borderRadius: '8px' }}
                itemStyle={{ color: '#D4FF00' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#D4FF00" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-display uppercase tracking-wider mb-6 text-accent">Cardio & Treino</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} />
                <YAxis stroke="#ffffff40" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff20', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="cardioMinutes" name="Cardio (min)" stroke="#FFB800" strokeWidth={2} dot={{ fill: '#FFB800' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center flex flex-col justify-center">
            <div className="text-4xl font-display text-white mb-2">
                {history.filter(h => h.workoutCompleted).length}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Treinos Completados</div>
            <div className="mt-4 flex justify-center gap-1">
                {history.slice(-7).map((h, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${h.workoutCompleted ? 'bg-primary' : 'bg-white/10'}`} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
