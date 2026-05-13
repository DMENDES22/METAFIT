/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import StepForm from "./components/StepForm";
import Dashboard from "./components/Dashboard";
import ProcessingScreen from "./components/ProcessingScreen";
import { UserData, DetailedPlan, HistoryEntry } from "./types";
import { generateFitnessPlan, adjustPlan } from "./services/geminiService";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [view, setView] = useState<'form' | 'plan'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<DetailedPlan | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('metafit_plan');
    const savedUser = localStorage.getItem('metafit_user');
    const savedHistory = localStorage.getItem('metafit_history');

    if (savedPlan && savedUser) {
      setPlan(JSON.parse(savedPlan));
      setUserData(JSON.parse(savedUser));
      setView('plan');
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSubmit = async (data: UserData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateFitnessPlan(data);
      setPlan(result);
      setUserData(data);
      setView('plan');
      
      localStorage.setItem('metafit_plan', JSON.stringify(result));
      localStorage.setItem('metafit_user', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveHistory = async (entry: HistoryEntry) => {
    const newHistory = [...history, entry].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setHistory(newHistory);
    localStorage.setItem('metafit_history', JSON.stringify(newHistory));

    // If it's a weekly check-in, trigger adjustment
    if (entry.isWeeklyCheckin && plan && userData) {
      setIsLoading(true);
      try {
        const adjustedPlan = await adjustPlan(userData, plan, newHistory);
        setPlan(adjustedPlan);
        localStorage.setItem('metafit_plan', JSON.stringify(adjustedPlan));
      } catch (err) {
        console.error("Failed to adjust plan:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setView('form');
    setPlan(null);
    setUserData(null);
    localStorage.removeItem('metafit_plan');
    localStorage.removeItem('metafit_user');
    // History is preserved unless user manually clears it (could add that later)
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="processing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProcessingScreen />
          </motion.div>
        ) : view === 'form' ? (
          <motion.div
            key="form-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {error && (
              <div className="max-w-xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="font-bold">×</button>
              </div>
            )}
            <StepForm onSubmit={handleSubmit} isLoading={isLoading} />
          </motion.div>
        ) : (
          plan && userData && (
            <motion.div
              key="plan-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard 
                plan={plan} 
                userData={userData}
                history={history}
                onSaveHistory={handleSaveHistory}
                onReset={handleReset} 
              />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Layout>
  );
}
