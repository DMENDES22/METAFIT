import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Loader2, Activity, Dumbbell, Utensils, Brain } from "lucide-react";

const messages = [
  "Calculando metabolismo basal...",
  "Analisando biotipo brasileiro...",
  "Montando rotina de treinos...",
  "Ajustando macros e calorias...",
  "Criando estratégia de evolução...",
  "Finalizando plano de elite..."
];

export default function ProcessingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const icons = [
    <Activity className="text-primary" size={40} />,
    <Brain className="text-accent" size={40} />,
    <Dumbbell className="text-primary" size={40} />,
    <Utensils className="text-accent" size={40} />,
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-t-2 border-primary rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index % icons.length}
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    {icons[index % icons.length]}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      <div className="min-h-[60px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-display uppercase tracking-tight text-white">
              {messages[index]}
            </h2>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-[0.3em]">
              Processando via METAFIT AI Engine
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 flex gap-1">
        {messages.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} 
          />
        ))}
      </div>
    </div>
  );
}
