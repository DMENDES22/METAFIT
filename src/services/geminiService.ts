import { GoogleGenAI } from "@google/genai";
import { UserData, DetailedPlan, Goal, ActivityLevel } from "../types";

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

    AJUSTE TÉCNICO IMPORTANTE: 
    - Se o usuário for "iniciante", os exercícios devem ser mais didáticos e focados em técnica.
    - Se houver condições de saúde (Diabetes, Lesões, etc), adapte o treino e dieta especificamente para isso.
    - Foque nos alimentos preferidos citados acima para garantir aderência à dieta.
    - O cardio deve respeitar a preferência "${userData.cardioPreference}" (se odeia, sugira alternativas de baixa fricção; se gosta, use como trunfo).
    - Crie estratégias para superar a dificuldade "${userData.mainDifficulty}".
    - ESTILO DE DIETA: Use exclusivamente "Comida brasileira simples" (Arroz, Feijão, Ovo, Frango, Batata). Evite termos gourmet.
    - DIVISÃO DE TREINO: Escolha a melhor divisão baseada nos dias (${userData.trainingDays}): Full Body, ABC, ABCD, ABCDE ou Push Pull Legs.

    REGRA SOBERANA: No final do texto, inclua OBRIGATORIAMENTE um bloco JSON entre as tags <METRICS> e </METRICS> com os valores calculados:
    <METRICS>
    {
      "calories": 2500,
      "protein": 180,
      "carbs": 250,
      "fats": 70,
      "water": 4
    }
    </METRICS>
    (Substitua pelos valores reais calculados para este usuário).

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
    
    let macros = { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 };
    let markdown = text.replace(metricsRegex, "").trim();

    if (match && match[1]) {
      try {
        macros = JSON.parse(match[1].trim());
      } catch (e) {
        console.error("Failed to parse AI metrics", e);
      }
    }

    return {
      markdown,
      macros
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Falha na comunicação com a IA.");
  }
}
