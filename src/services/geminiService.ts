import { GoogleGenAI } from "@google/genai";
import { UserData, DetailedPlan, Goal, ActivityLevel, HistoryEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateFitnessPlan(userData: UserData): Promise<DetailedPlan> {
  const goalMap: Record<Goal, string> = {
    emagrecer: 'Emagrecer (Queima de gordura)',
    ganhar_massa: 'Ganhar massa muscular (Hipertrofia)',
    definir: 'Definir o corpo (Tonificação)',
    condicionamento: 'Melhorar condicionamento (Resistência)',
    saude: 'Saúde e disposição (Equilíbrio)'
  };

  const activityMap: Record<ActivityLevel, string> = {
    sentado: 'Trabalho sentado (Escritório)',
    em_pe: 'Trabalho em pé (Vendas/Ensino)',
    peso: 'Trabalho carregando peso (Braçal)',
    muito_ativo: 'Rotina muito ativa (Esportes/Físico)'
  };

  const prompt = `
    Você é um Personal Trainer e Nutricionista de elite focado no público brasileiro.
    Gere um plano completo de transformação corporal para o usuário:
    
    NOME: ${userData.name}
    IDADE: ${userData.age}
    GÊNERO: ${userData.gender}
    PESO: ${userData.weight}kg
    ALTURA: ${userData.height}cm
    OBJETIVO: ${goalMap[userData.goal]}
    NÍVEL DE ATIVIDADE: ${activityMap[userData.activityLevel]}
    EXPERIÊNCIA: ${userData.experienceLevel}
    CONDIÇÕES DE SAÚDE: ${userData.healthConditions.length > 0 ? userData.healthConditions.join(', ') : 'Nenhuma'}
    DIAS DE TREINO: ${userData.trainingDays} dias por semana
    RESUMO DE ALIMENTOS PREFERIDOS:
    - Proteínas: ${userData.preferredProteins.join(', ')}
    - Carboidratos: ${userData.preferredCarbs.join(', ')}
    DIFICULDADE PRINCIPAL: ${userData.mainDifficulty}
    PREFERÊNCIA DE CARDIO: ${userData.cardioPreference}
    SUPLEMENTOS ATUAIS: ${userData.supplements.length > 0 ? userData.supplements.join(', ') : 'Nenhum'}
    RESTRIÇÕES ADICIONAIS: ${userData.dietaryRestrictions || 'Nenhuma'}
    PREFERÊNCIAS GERAIS: ${userData.preferences || 'Nenhuma'}

    ESTRATÉGIA DE FINAL DE SEMANA (WEEKEND MODE):
    - Álcool previsto: ${userData.weekendAlcohol}
    - Refeições livres previstas: ${userData.weekendCheatMeals}

    AJUSTE TÉCNICO IMPORTANTE: 
    - Se o usuário for "iniciante", os exercícios devem ser mais didáticos e focados em técnica.
    - Se houver condições de saúde (Diabetes, Lesões, etc), adapte o treino e dieta especificamente para isso.
    - Foque nos alimentos preferidos citados acima para garantir aderência à dieta.
    - O cardio deve respeitar a preferência "${userData.cardioPreference}" (se odeia, sugira alternativas de baixa fricção; se gosta, use como trunfo).
    - Crie estratégias para superar a dificuldade "${userData.mainDifficulty}".
    - Se houver previsão de álcool ou refeições livres no final de semana, ADAPTE a estratégia semanal: Sugira reduzir carboidratos levemente durante a semana (seg-sex) para criar uma "margem calórica", e talvez aumentar o cardio leve pré-evento.
    - ESTILO DE DIETA: Use exclusivamente "Comida brasileira simples" (Arroz, Feijão, Ovo, Frango, Batata). Evite termos gourmet.
    - DIVISÃO DE TREINO: Escolha a melhor divisão baseada nos dias (${userData.trainingDays}): Full Body, ABC, ABCD, ABCDE ou Push Pull Legs.

    REGRA SOBERANA: No final do texto, inclua OBRIGATORIAMENTE um bloco JSON entre as tags <METRICS> e </METRICS> com os valores calculados:
    <METRICS>
    {
      "calories": 2500,
      "protein": 180,
      "carbs": 250,
      "fats": 70,
      "water": 4,
      "bodyMetrics": {
        "bf": 18.5,
        "ffmi": 21.2,
        "imc": 24.5,
        "tmb": 1850,
        "dailyExpenditure": 2600
      }
    }
    </METRICS>
    (Substitua pelos valores reais calculados tecnicamente para este usuário com base nos dados fornecidos).

    Estruture o texto em Markdown com:
    1. **Estratégia de Evolução**: Foco em biotipo e metabolismo.
    2. **Plano Alimentar (Dieta)**: Alimentos brasileiros realistas e acessíveis.
    3. **Plano de Treino**: Cronograma semanal detalhado para ${userData.trainingDays} dias.
    4. **Protocolo de Cardio**: Frequência e intensidade.
    5. **Dicas de Suplementação**.

    Mantenha um tom motivador, agressivo nos resultados e profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "";
    const metricsRegex = /<METRICS>([\s\S]*?)<\/METRICS>/;
    const match = text.match(metricsRegex);
    
    let metricsData = { calories: 0, protein: 0, carbs: 0, fats: 0, water: 3, bodyMetrics: undefined };
    let markdown = text.replace(metricsRegex, "").trim();

    if (match && match[1]) {
      try {
        metricsData = JSON.parse(match[1].trim());
      } catch (e) {
        console.error("Failed to parse AI metrics", e);
      }
    }

    return {
      markdown,
      macros: {
        calories: metricsData.calories,
        protein: metricsData.protein,
        carbs: metricsData.carbs,
        fats: metricsData.fats,
        water: metricsData.water
      },
      bodyMetrics: metricsData.bodyMetrics
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Falha na comunicação com a IA.");
  }
}
export async function adjustPlan(
  userData: UserData,
  currentPlan: DetailedPlan,
  history: HistoryEntry[]
): Promise<DetailedPlan> {
  const lastCheckin = history.filter(h => h.isWeeklyCheckin).pop();
  if (!lastCheckin) return currentPlan;

  const previousWeight = history.length > 1 
    ? history[history.length - 2].weight 
    : userData.weight;
  
  const weightDiff = lastCheckin.weight - previousWeight;

  const prompt = `
    Você é um Personal Trainer e Nutricionista de elite. 
    Analise o progresso semanal do usuário e ajuste as calorias e macros.

    PLANO ATUAL:
    - Calorias: ${currentPlan.macros.calories} kcal
    - Proteína: ${currentPlan.macros.protein}g
    - Carbs: ${currentPlan.macros.carbs}g
    - Fats: ${currentPlan.macros.fats}g

    DADOS DO CHECK-IN:
    - Peso Anterior: ${previousWeight}kg
    - Peso Atual: ${lastCheckin.weight}kg
    - Diferença: ${weightDiff.toFixed(2)}kg
    - Cintura: ${lastCheckin.waist}cm
    - Energia: ${lastCheckin.energyLevel}/5
    - Fome: ${lastCheckin.hungerLevel}/5
    - Adesão: ${lastCheckin.adherenceLevel}/5
    - Objetivo Original: ${userData.goal}

    REGRAS DE AJUSTE AUTOMÁTICO:
    1. Se o objetivo é EMAGRECER e o peso desceu pouco (< 0.5kg) ou manteve: Reduza 100-200 kcal.
    2. Se o objetivo é EMAGRECER e o peso desceu rápido (> 1.2kg): Aumente 100-150 kcal para proteger massa muscular.
    3. Se o peso está ideal (0.5kg a 1kg/semana): Mantenha.
    4. Se o objetivo é GANHAR MASSA e o peso não subiu: Aumente 200-300 kcal.

    RETORNE OBRIGATORIAMENTE um bloco JSON entre <METRICS> e </METRICS> e um texto curto de 2 parágrafos explicando o motivo do ajuste.
    
    <METRICS>
    {
      "calories": 2300,
      "protein": 180,
      "carbs": 210,
      "fats": 65,
      "water": 4,
      "reason": "Redução estratégica devido à desaceleração metabólica identificada."
    }
    </METRICS>
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "";
    const metricsRegex = /<METRICS>([\s\S]*?)<\/METRICS>/;
    const match = text.match(metricsRegex);
    
    if (match && match[1]) {
      const newMetrics = JSON.parse(match[1].trim());
      const adjustment = {
        date: new Date().toISOString().split('T')[0],
        reason: newMetrics.reason,
        newCalories: newMetrics.calories
      };

      return {
        ...currentPlan,
        markdown: text.replace(metricsRegex, "").trim(),
        macros: {
          calories: newMetrics.calories,
          protein: newMetrics.protein,
          carbs: newMetrics.carbs,
          fats: newMetrics.fats,
          water: newMetrics.water
        },
        adjustments: [...(currentPlan.adjustments || []), adjustment]
      };
    }
    return currentPlan;
  } catch (error) {
    console.error("Adjustment Error:", error);
    return currentPlan;
  }
}
