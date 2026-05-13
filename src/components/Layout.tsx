import { ReactNode } from "react";
import { motion } from "motion/react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white fitness-grid relative overflow-hidden font-sans">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <header className="mb-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-primary font-display text-4xl tracking-tighter">METAFIT</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-center max-w-md"
          >
            A inteligência artificial que transforma seu corpo com estratégias reais para o biotipo brasileiro.
          </motion.p>
        </header>
        
        {children}
      </main>
      
      <footer className="relative z-10 border-t border-white/5 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-white/30 text-sm">
          &copy; {new Date().getFullYear()} METAFIT AI. Resultados reais exigem disciplina.
        </div>
      </footer>
    </div>
  );
}
