import type { ApiResponse, PontoColeta } from "@/types";

export const creatPontoColeta = async (pontoColeta: PontoColeta): Promise<ApiResponse> => {
  const response = await fetch(`http://localhost:3000/api/pontos-coleta/cadastra`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pontoColeta)
  });
  if (!response.ok) throw new Error("Erro ao criar ponto de coleta");

  return await response.json();
};