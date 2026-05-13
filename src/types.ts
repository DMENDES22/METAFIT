export type Goal = 'emagrecer' | 'ganhar_massa' | 'definir' | 'condicionamento' | 'saude';
export type ActivityLevel = 'sentado' | 'em_pe' | 'peso' | 'muito_ativo';
export type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado';

export interface UserData {
  name: string;
  age: number;
  gender: 'masculino' | 'feminino' | 'outro';
  weight: number;
  height: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  trainingDays: number;
  experienceLevel: ExperienceLevel;
  healthConditions: string[]; // List of selected conditions with details
  preferredProteins: string[];
  preferredCarbs: string[];
  mainDifficulty: string;
  cardioPreference: string;
  supplements: string[];
  dietaryRestrictions?: string;
  preferences?: string;
  weekendAlcohol?: string;
  weekendCheatMeals?: string;
}

export interface DetailedPlan {
  markdown: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
  };
  bodyMetrics?: {
    bf: number;
    ffmi: number;
    imc: number;
    tmb: number;
    dailyExpenditure: number;
  };
  adjustments?: {
    date: string;
    reason: string;
    newCalories: number;
  }[];
}

export interface HistoryEntry {
  date: string;
  weight: number;
  waist?: number;
  caloriesConsumed?: number;
  waterIntake?: number;
  workoutCompleted: boolean;
  cardioMinutes: number;
  freeMeal?: {
    intensity: 'Leve' | 'Média' | 'Pesada' | 'Exagerei';
    date: string;
  };
  // Check-in specific fields
  isWeeklyCheckin?: boolean;
  energyLevel?: number; // 1-5
  hungerLevel?: number; // 1-5
  adherenceLevel?: number; // 1-5 (Percentage scale in UI maybe?)
}
