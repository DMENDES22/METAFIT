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
}

export interface HistoryEntry {
  date: string;
  weight: number;
  waist?: number;
  caloriesConsumed?: number;
  waterIntake?: number;
  workoutCompleted: boolean;
  cardioMinutes: number;
}
