import { apiRequest } from "./queryClient";

export interface AIChatResponse {
  message: string;
  recommendations: {
    exercise: string;
    duration: number;
    calories: number;
  }[];
}

export async function getAIRecommendations(
  prompt: string,
): Promise<AIChatResponse> {
  const res = await apiRequest("POST", "/api/chat", { prompt });
  return res.json();
}
