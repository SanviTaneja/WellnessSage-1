import { apiRequest } from "./queryClient";

export interface ResourceRecommendation {
  title: string;
  type: "book" | "article";
  description: string;
}

export interface ExerciseRecommendation {
  name: string;
  duration: number;
  benefits: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string[];
}

export interface AIChatResponse {
  message: string;
  asanas: ExerciseRecommendation[];
  exercises: ExerciseRecommendation[];
  resources: ResourceRecommendation[];
}

export async function getAIRecommendations(
  prompt: string,
): Promise<AIChatResponse> {
  const res = await apiRequest("POST", "/api/chat", { prompt });
  return res.json();
}